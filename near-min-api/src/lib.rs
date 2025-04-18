pub mod types;
pub mod utils;

use base64::{Engine, prelude::BASE64_STANDARD};
use futures_timer::Delay;
use near_account_id::AccountId;
use near_crypto::PublicKey;
use reqwest::IntoUrl;
use serde::{Deserialize, Serialize, de::DeserializeOwned};
use std::time::Duration;
use types::{
    AccessKeyView, AccountView, BlockId, BlockReference, BlockView, CryptoHash,
    FinalExecutionOutcomeView, FinalExecutionOutcomeWithReceiptView, Finality, HandlerError,
    QueryRequest, QueryResponse, QueryResponseKind, ResultOrError, RpcError, RpcErrorKind,
    RpcLightClientProofError, RpcQueryError, RpcReceiptError, RpcStatusError, RpcTransactionError,
    SignedTransaction, TxExecutionStatus,
};

#[derive(Clone, Debug)]
pub struct RpcClient {
    client: reqwest::Client,
    urls: Vec<reqwest::Url>,
    max_retries: usize,
    starting_delay: Duration,
    backoff_multiplier: f64,
}

impl RpcClient {
    /// Create a new RPC client with the given RPC URLs. If provided more than one,
    /// they'll all be tried in case of any error
    pub fn new(urls: impl IntoIterator<Item = impl IntoUrl>) -> Self {
        Self {
            client: reqwest::Client::new(),
            urls: urls
                .into_iter()
                .map(|url| url.into_url().expect("Invalid URL"))
                .collect(),
            max_retries: 5,
            starting_delay: Duration::from_millis(500),
            backoff_multiplier: 2.0,
        }
    }

    pub fn with_exponential_backoff_settings(
        mut self,
        starting_delay: Duration,
        backoff_multiplier: f64,
    ) -> Self {
        self.starting_delay = starting_delay;
        self.backoff_multiplier = backoff_multiplier;
        self
    }

    pub fn without_exponential_backoff(mut self) -> Self {
        self.starting_delay = Duration::from_millis(0);
        self.backoff_multiplier = 1.0;
        self
    }

    pub fn with_max_retries(&mut self, max_retries: usize) -> &mut Self {
        self.max_retries = max_retries;
        self
    }

    pub fn set_exponential_backoff_settings(
        &mut self,
        starting_delay: Duration,
        backoff_multiplier: f64,
    ) {
        self.starting_delay = starting_delay;
        self.backoff_multiplier = backoff_multiplier;
    }

    pub fn set_max_retries(&mut self, max_retries: usize) {
        self.max_retries = max_retries;
    }

    pub fn set_rpc_urls(&mut self, urls: impl IntoIterator<Item = impl IntoUrl>) {
        self.urls = urls
            .into_iter()
            .map(|url| url.into_url().expect("Invalid URL"))
            .collect();
    }

    pub fn add_rpc_url(&mut self, url: impl IntoUrl) {
        self.urls.push(url.into_url().expect("Invalid URL"));
    }

    pub fn remove_rpc_url(&mut self, url: impl IntoUrl) -> bool {
        let current_length = self.urls.len();
        let url_to_remove = url.into_url().expect("Invalid URL");
        self.urls.retain(|u| u != &url_to_remove);
        self.urls.len() != current_length
    }

    pub fn set_client(&mut self, client: reqwest::Client) {
        self.client = client;
    }

    async fn request<Request: Serialize, Response: DeserializeOwned>(
        &self,
        method: &str,
        params: Request,
    ) -> Result<Response, Error> {
        if self.urls.is_empty() {
            return Err(Error::NoRpcUrls);
        }

        let mut retry_count = 0;
        let max_retries = self.max_retries;
        let mut delay = self.starting_delay;

        loop {
            let mut error = None;
            for url in &self.urls {
                match jsonrpc_request(&self.client, url, method, &params).await {
                    Ok(response) => return Ok(response),
                    Err(
                        e @ Error::JsonRpc(RpcError {
                            error_struct:
                                // Trying to add all cases that can happen because of node's issues,
                                // including nodes configured to not store all blocks, or with limits.
                                // This is because the user might have mroe than one RPC, and the
                                // second one might work. Or if a transaction is pending / not finalized
                                // yet, but will probably be available after exponential backoff.
                                Some(RpcErrorKind::HandlerError(
                                    HandlerError::RpcQueryError(
                                        RpcQueryError::GarbageCollectedBlock { .. }
                                        | RpcQueryError::UnknownBlock { .. }
                                        | RpcQueryError::UnavailableShard { .. }
                                        | RpcQueryError::NoSyncedBlocks
                                        | RpcQueryError::TooLargeContractState { .. },
                                    )
                                    | HandlerError::RpcReceiptError(
                                        RpcReceiptError::UnknownReceipt { .. }
                                    )
                                    | HandlerError::RpcStatusError(
                                        RpcStatusError::NodeIsSyncing
                                        | RpcStatusError::NoNewBlocks { .. }
                                    )
                                    | HandlerError::RpcTransactionError(
                                        RpcTransactionError::DoesNotTrackShard
                                        | RpcTransactionError::RequestRouted { .. }
                                        | RpcTransactionError::UnknownTransaction { .. }
                                        | RpcTransactionError::TimeoutError
                                    )
                                    | HandlerError::RpcLightClientProofError(
                                        RpcLightClientProofError::UnknownBlock
                                        | RpcLightClientProofError::InconsistentState { .. }
                                        | RpcLightClientProofError::NotConfirmed { .. }
                                        | RpcLightClientProofError::UnknownTransactionOrReceipt { .. }
                                        | RpcLightClientProofError::UnavailableShard { .. }
                                    )
                                )),
                            ..
                        }) | e @ Error::Reqwest(_),
                    ) => {
                        error = Some(e);
                        continue;
                    }
                    Err(e) => {
                        return Err(e);
                    }
                }
            }

            if retry_count >= max_retries {
                // Safe because the only branch that doesn't exit the loop is the one that sets error
                return Err(error.unwrap());
            }
            retry_count += 1;
            Delay::new(delay).await;
            delay =
                Duration::from_millis((delay.as_millis() as f64 * self.backoff_multiplier) as u64);
        }
    }

    pub async fn tx(&self, tx_hash: CryptoHash) -> Result<TxDetails, Error> {
        let rpc_method = "tx";
        let rpc_params = serde_json::json!({
            "tx_hash": tx_hash,
            "sender_account_id": "dontcare",
        });
        self.request(rpc_method, rpc_params).await
    }

    #[allow(non_snake_case)]
    pub async fn EXPERIMENTAL_tx_status(
        &self,
        tx_hash: CryptoHash,
    ) -> Result<ExperimentalTxDetails, Error> {
        let rpc_method = "EXPERIMENTAL_tx_status";

        let rpc_params = serde_json::json!({
            "tx_hash": tx_hash,
            "sender_account_id": "dontcare",
        });
        self.request(rpc_method, rpc_params).await
    }

    pub async fn call<R: DeserializeOwned>(
        &self,
        contract_id: AccountId,
        method: &str,
        args: impl Serialize,
        finality: QueryFinality,
    ) -> Result<R, CallError> {
        let rpc_method = "query";
        let rpc_params = Query {
            request: QueryRequest::CallFunction {
                account_id: contract_id,
                method_name: method.to_string(),
                args: serde_json::to_vec(&args)
                    .map_err(CallError::ArgsSerialization)?
                    .into(),
            },
            finality,
        };
        let response: QueryResponse = self
            .request(rpc_method, rpc_params)
            .await
            .map_err(CallError::Rpc)?;
        match response.kind {
            QueryResponseKind::CallResult(result) => match result.result_or_error {
                ResultOrError::Result(result) => {
                    serde_json::from_slice(&result).map_err(CallError::ResultDeserialization)
                }
                ResultOrError::Error(error) => Err(CallError::ExecutionError(error)),
            },
            _ => unreachable!("Unexpected query response kind: {:?}", response.kind),
        }
    }

    pub async fn view_account(
        &self,
        account_id: AccountId,
        finality: QueryFinality,
    ) -> Result<AccountView, Error> {
        let rpc_method = "query";
        let rpc_params = Query {
            request: QueryRequest::ViewAccount { account_id },
            finality,
        };
        self.request(rpc_method, rpc_params).await
    }

    /// Low-level method to send a transaction.
    /// Example:
    /// ```ignore
    /// let account: AccountId = "account.near".parse().unwrap();
    /// let key: SecretKey = "ed25519:...".parse().unwrap();
    /// let client = RpcClient::new(vec!["https://rpc.intear.tech"]);
    /// let tx = Transaction::V0(TransactionV0 {
    ///     signer_id: account.clone(),
    ///     public_key: key.public_key(),
    ///     nonce: client
    ///         .get_access_key(account.clone(), key.public_key())
    ///         .await
    ///         .unwrap()
    ///         .nonce
    ///         + 1,
    ///     receiver_id: account.clone(),
    ///     block_hash: client.fetch_recent_block_hash().await.unwrap(),
    ///     actions: vec![...],
    /// });
    /// let signature = key.sign(tx.get_hash_and_size().0.as_ref());
    /// let tx = SignedTransaction::new(signature, tx);
    /// let pending_tx = client.send_tx(tx).await.unwrap();
    /// pending_tx
    ///     .wait_for(TxExecutionStatus::Included, Duration::from_secs(30))
    ///     .await
    ///     .unwrap();
    /// ```
    pub async fn send_tx(&self, signed_tx: SignedTransaction) -> Result<PendingTransaction, Error> {
        let rpc_method = "send_tx";
        let rpc_params = serde_json::json!({
            "signed_tx_base64": BASE64_STANDARD.encode(borsh::to_vec(&signed_tx).unwrap()),
            "wait_until": TxExecutionStatus::Included,
        });
        let _: TxDetails = self.request(rpc_method, rpc_params).await?;
        Ok(PendingTransaction(self, signed_tx.get_hash()))
    }

    pub async fn get_access_key(
        &self,
        account_id: AccountId,
        public_key: PublicKey,
        finality: QueryFinality,
    ) -> Result<AccessKeyView, Error> {
        let rpc_method = "query";
        let rpc_params = Query {
            request: QueryRequest::ViewAccessKey {
                account_id,
                public_key,
            },
            finality,
        };
        let response: QueryResponse = self.request(rpc_method, rpc_params).await?;
        match response.kind {
            QueryResponseKind::AccessKey(access_key) => Ok(access_key),
            _ => unreachable!("Unexpected query response kind: {:?}", response.kind),
        }
    }

    pub async fn fetch_block(&self, block_id: BlockReference) -> Result<BlockView, Error> {
        let rpc_method = "block";
        let rpc_params = block_id;
        self.request(rpc_method, rpc_params).await
    }

    pub async fn fetch_recent_block_hash(&self) -> Result<CryptoHash, Error> {
        self.fetch_block(BlockReference::Finality(Finality::Final))
            .await
            .map(|block| block.header.hash)
    }
}

pub struct PendingTransaction<'a>(&'a RpcClient, CryptoHash);

impl<'a> PendingTransaction<'a> {
    pub async fn wait_for(
        &self,
        status: TxExecutionStatus,
        timeout: Duration,
    ) -> Result<(), WaitError> {
        let wait_future = Box::pin(self.internal_wait_for(status));
        let timeout_future = Box::pin(Delay::new(timeout));

        match futures_util::future::select(wait_future, timeout_future).await {
            futures_util::future::Either::Left((result, _)) => result.map_err(WaitError::Rpc),
            futures_util::future::Either::Right(_) => Err(WaitError::Timeout),
        }
    }

    async fn internal_wait_for(&self, status: TxExecutionStatus) -> Result<(), Error> {
        loop {
            let tx: TxDetails = self.0.tx(self.1).await?;
            if tx.final_execution_status >= status {
                return Ok(());
            }
            Delay::new(Duration::from_millis(100)).await;
        }
    }

    pub async fn fetch_details(&self) -> Result<TxDetails, Error> {
        self.0.tx(self.1).await
    }

    #[allow(non_snake_case)]
    pub async fn EXPERIMENTAL_fetch_details(&self) -> Result<ExperimentalTxDetails, Error> {
        self.0.EXPERIMENTAL_tx_status(self.1).await
    }
}

#[derive(Debug, thiserror::Error)]
pub enum WaitError {
    #[error("Timeout")]
    Timeout,
    #[error("RPC error: {0}")]
    Rpc(Error),
}

#[derive(Debug, thiserror::Error)]
pub enum CallError {
    #[error("RPC error: {0}")]
    Rpc(Error),
    #[error("Args serialization error: {0}")]
    ArgsSerialization(serde_json::Error),
    #[error("Result deserialization error: {0}")]
    ResultDeserialization(serde_json::Error),
    #[error("Execution error: {0}")]
    ExecutionError(String),
}

#[derive(Debug, Serialize, Clone)]
struct Query {
    #[serde(flatten)]
    request: QueryRequest,
    #[serde(flatten)]
    finality: QueryFinality,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum QueryFinality {
    Finality(Finality),
    BlockId(BlockId),
}

impl Default for QueryFinality {
    fn default() -> Self {
        Self::Finality(Finality::Final)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TxDetails {
    // Guaranteed to be FinalExecutionOutcomeViewEnum::FinalExecutionOutcome... I guess?
    #[serde(flatten)]
    pub final_execution_outcome: Option<FinalExecutionOutcomeView>,
    pub final_execution_status: TxExecutionStatus,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExperimentalTxDetails {
    // Guaranteed to be FinalExecutionOutcomeViewEnum::FinalExecutionWithReceiptsOutcome... I guess?
    #[serde(flatten)]
    pub final_execution_outcome: Option<FinalExecutionOutcomeWithReceiptView>,
    pub final_execution_status: TxExecutionStatus,
}

async fn jsonrpc_request<Request: Serialize, Response: DeserializeOwned>(
    client: &reqwest::Client,
    url: &reqwest::Url,
    method: &str,
    params: Request,
) -> Result<Response, Error> {
    let response = client
        .post(url.clone())
        .json(&serde_json::json!({
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": "dontcare",
        }))
        .send()
        .await
        .map_err(Error::Reqwest)?
        .error_for_status()
        .map_err(Error::Reqwest)?;
    let response_json = response
        .json::<serde_json::Value>()
        .await
        .map_err(Error::Reqwest)?;
    let response = serde_json::from_value::<JsonRpcResponse<Response>>(response_json.clone())
        .map_err(|e| Error::JsonRpcDeserialization(e, response_json))?;
    match response.result {
        ResultOrError::Result(result) => Ok(result),
        ResultOrError::Error(error) => Err(Error::JsonRpc(error)),
    }
}

#[derive(Debug, Deserialize)]
struct JsonRpcResponse<T> {
    #[allow(dead_code)]
    jsonrpc: String,
    #[serde(flatten)]
    result: ResultOrError<T, RpcError>,
    #[allow(dead_code)]
    id: String,
}

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Request error: {0}")]
    Reqwest(reqwest::Error),
    #[error("RPC returned an error: {0:?}")]
    JsonRpc(RpcError),
    #[error("RPC returned an error: {0:?}")]
    JsonRpcDeserialization(serde_json::Error, serde_json::Value),
    #[error("No RPC URLs provided in RpcClient")]
    NoRpcUrls,
}
