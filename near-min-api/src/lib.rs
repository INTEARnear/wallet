pub mod types;
pub mod utils;

use base64::{Engine, prelude::BASE64_STANDARD};
use futures_timer::Delay;
use near_account_id::AccountId;
use near_crypto::PublicKey;
use reqwest::IntoUrl;
use serde::{Deserialize, Serialize, de::DeserializeOwned};
use std::{
    collections::{HashMap, VecDeque},
    time::Duration,
};
use types::{
    AccessKeyList, AccessKeyView, AccountView, BlockId, BlockReference, BlockView, CryptoHash,
    FinalExecutionOutcomeView, FinalExecutionOutcomeWithReceiptView, Finality, HandlerError,
    QueryRequest, QueryResponse, QueryResponseKind, ResultOrError, RpcError, RpcErrorKind,
    RpcLightClientProofError, RpcQueryError, RpcReceiptError, RpcStatusError, RpcTransactionError,
    SignedTransaction, TxExecutionStatus,
};

use crate::types::{
    BlockHeightDelta, ContractCodeView, EpochReference, EpochValidatorInfo, StateRecord,
    StatusResponse, ViewStateResult,
};

#[derive(Clone, Debug)]
pub struct RpcClient {
    client: reqwest::Client,
    urls: Vec<reqwest::Url>,
    max_retries: usize,
    starting_delay: Duration,
    backoff_multiplier: f64,
}

#[allow(non_snake_case)]
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

    pub fn with_max_retries(mut self, max_retries: usize) -> Self {
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

    pub async fn view_code(
        &self,
        account_id: AccountId,
        finality: QueryFinality,
    ) -> Result<ContractCodeView, Error> {
        let rpc_method = "query";
        let rpc_params = Query {
            request: QueryRequest::ViewCode { account_id },
            finality,
        };
        self.request(rpc_method, rpc_params).await
    }

    /// Low-level method to send a transaction.
    /// Example:
    /// ```ignore
    /// let account: AccountId = "account.near".parse().unwrap();
    /// let key: SecretKey = "ed25519:...".parse().unwrap();
    /// let client = RpcClient::new(vec!["https://rpc.intea.rs"]);
    /// let tx = Transaction::V0(TransactionV0 {
    ///     signer_id: account.clone(),
    ///     public_key: key.public_key(),
    ///     nonce: client
    ///         .get_access_key(account.clone(), key.public_key(), QueryFinality::Finality(Finality::Final))
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
    pub async fn send_tx(
        &self,
        signed_tx: SignedTransaction,
    ) -> Result<PendingTransaction<'_>, Error> {
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
            QueryResponseKind::CallResult(result) => match result.result_or_error {
                ResultOrError::Result(result) => {
                    unreachable!("Unexpected query response kind: result {result:#X?}")
                }
                ResultOrError::Error(error) => Err(Error::OtherQueryError(error)),
            },
            _ => unreachable!("Unexpected query response kind: {:?}", response.kind),
        }
    }

    pub async fn block(&self, block_id: BlockReference) -> Result<BlockView, Error> {
        let rpc_method = "block";
        let rpc_params = block_id;
        self.request(rpc_method, rpc_params).await
    }

    pub async fn view_access_key_list(
        &self,
        account_id: AccountId,
        finality: QueryFinality,
    ) -> Result<AccessKeyList, Error> {
        let rpc_method = "query";
        let rpc_params = Query {
            request: QueryRequest::ViewAccessKeyList { account_id },
            finality,
        };
        let response: QueryResponse = self.request(rpc_method, rpc_params).await?;
        match response.kind {
            QueryResponseKind::AccessKeyList(access_key_list) => Ok(access_key_list),
            _ => unreachable!("Unexpected query response kind: {:?}", response.kind),
        }
    }

    pub fn supports_intear_methods(&self) -> bool {
        self.urls.iter().any(|url| {
            url.host_str().unwrap_or_default().ends_with("intear.tech")
                || url.host_str().unwrap_or_default().ends_with("intea.rs")
        })
    }

    pub async fn INTEAR_batch_query(
        &self,
        requests: Vec<Query>,
    ) -> Result<Vec<ResultOrError<QueryResponse, RpcError>>, Error> {
        let rpc_method = "INTEAR_batch_query";
        self.request(rpc_method, requests).await
    }

    pub async fn batch_call<R: DeserializeOwned>(
        &self,
        requests: Vec<(AccountId, &str, impl Serialize, QueryFinality)>,
    ) -> Result<Vec<Result<R, CallError>>, Error> {
        if self.supports_intear_methods() {
            let mut queries = Vec::new();
            let mut errors = HashMap::new();
            let num_requests = requests.len();
            for (i, (account_id, method, args, finality)) in requests.into_iter().enumerate() {
                match serde_json::to_vec(&args) {
                    Ok(args) => {
                        queries.push(Query {
                            request: QueryRequest::CallFunction {
                                account_id,
                                method_name: method.to_string(),
                                args: args.into(),
                            },
                            finality,
                        });
                    }
                    Err(error) => {
                        // Skip, but mark as CallError::ArgsSerialization
                        errors.insert(i, CallError::ArgsSerialization(error));
                    }
                }
            }
            let mut results = self.INTEAR_batch_query(queries).await.map(|r| {
                r.into_iter()
                    .map(|r| match r {
                        ResultOrError::Result(result) => match result.kind {
                            QueryResponseKind::CallResult(result) => match result.result_or_error {
                                ResultOrError::Result(result) => {
                                    serde_json::from_slice::<R>(&result)
                                        .map_err(CallError::ResultDeserialization)
                                }
                                ResultOrError::Error(error) => {
                                    Err(CallError::ExecutionError(error))
                                }
                            },
                            _ => unreachable!("Unexpected query response kind: {:?}", result.kind),
                        },
                        ResultOrError::Error(error) => Err(CallError::Rpc(Error::JsonRpc(error))),
                    })
                    .collect::<VecDeque<_>>()
            })?;
            let mut final_results = Vec::new();
            for i in 0..num_requests {
                if let Some(error) = errors.remove(&i) {
                    final_results.push(Err(error));
                } else if let Some(result) = results.pop_front() {
                    final_results.push(result);
                } else {
                    panic!(
                        "Unexpected number of results: {:?}. This is a bug.",
                        results.len()
                    );
                }
            }
            Ok(final_results)
        } else {
            let futures = requests
                .into_iter()
                .map(|(account_id, method, args, finality)| {
                    self.call::<R>(account_id, method, args, finality)
                });
            Ok(futures_util::future::join_all(futures).await)
        }
    }

    pub async fn batch_get_access_key(
        &self,
        requests: Vec<(AccountId, PublicKey, QueryFinality)>,
    ) -> Result<Vec<Result<AccessKeyView, Error>>, Error> {
        if self.supports_intear_methods() {
            let queries: Vec<Query> = requests
                .iter()
                .map(|(account_id, public_key, finality)| Query {
                    request: QueryRequest::ViewAccessKey {
                        account_id: account_id.clone(),
                        public_key: public_key.clone(),
                    },
                    finality: finality.clone(),
                })
                .collect();

            let raw_results = self.INTEAR_batch_query(queries).await?;

            let parsed_results = raw_results
                .into_iter()
                .map(|res| match res {
                    ResultOrError::Result(query_response) => match query_response.kind {
                        QueryResponseKind::AccessKey(access_key) => Ok(access_key),
                        QueryResponseKind::CallResult(result) => match result.result_or_error {
                            ResultOrError::Result(result) => unreachable!(
                                "Unexpected successful call result for view_access_key: {result:#X?}"
                            ),
                            ResultOrError::Error(err) => Err(Error::OtherQueryError(err)),
                        },
                        _ => unreachable!("Unexpected query response kind: {:?}", query_response.kind),
                    },
                    ResultOrError::Error(err) => Err(Error::JsonRpc(err)),
                })
                .collect();

            Ok(parsed_results)
        } else {
            let futures = requests
                .into_iter()
                .map(|(account_id, public_key, finality)| {
                    self.get_access_key(account_id, public_key, finality)
                });
            Ok(futures_util::future::join_all(futures).await)
        }
    }

    pub async fn status(&self) -> Result<StatusResponse, Error> {
        let rpc_method = "status";
        let rpc_params = serde_json::json!({});
        self.request(rpc_method, rpc_params).await
    }

    pub async fn validators(&self, epoch: EpochReference) -> Result<EpochValidatorInfo, Error> {
        let rpc_method = "validators";
        self.request(rpc_method, epoch).await
    }

    pub async fn view_state(
        &self,
        account_id: AccountId,
        prefix: &[u8],
        finality: QueryFinality,
    ) -> Result<ViewStateResult, Error> {
        let rpc_method = "query";
        let rpc_params = Query {
            request: QueryRequest::ViewState {
                account_id,
                prefix: prefix.to_vec().into(),
                after_key: None,
                limit: None,
                include_proof: false,
            },
            finality,
        };
        let response: QueryResponse = self.request(rpc_method, rpc_params).await?;
        match response.kind {
            QueryResponseKind::ViewState(view_state_result) => Ok(view_state_result),
            _ => unreachable!("Unexpected query response kind: {:?}", response.kind),
        }
    }

    pub async fn sandbox_fast_forward(&self, delta_height: BlockHeightDelta) -> Result<(), Error> {
        let rpc_method = "sandbox_fast_forward";
        let rpc_params = serde_json::json!({
            "delta_height": delta_height,
        });
        self.request(rpc_method, rpc_params).await
    }

    pub async fn sandbox_patch_state(&self, records: Vec<StateRecord>) -> Result<(), Error> {
        let rpc_method = "sandbox_patch_state";
        let rpc_params = serde_json::json!({
            "records": records,
        });
        self.request(rpc_method, rpc_params).await
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

    pub fn from_parts(rpc_client: &'a RpcClient, tx_hash: CryptoHash) -> Self {
        Self(rpc_client, tx_hash)
    }
}

#[allow(clippy::large_enum_variant)]
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
pub struct Query {
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
        Self::Finality(Finality::DoomSlug)
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
    #[error("RPC returned an unprocessable response: {0:?}. Response: {1:?}")]
    JsonRpcDeserialization(serde_json::Error, serde_json::Value),
    #[error("No RPC URLs provided in RpcClient")]
    NoRpcUrls,
    #[error("Query error: {0:?}")]
    OtherQueryError(String),
}

#[cfg(test)]
mod live_rpc_tests {
    use super::*;

    const LIVE_RPC_URL: &str = "https://rpc.intea.rs";
    const WRAP_NEAR: &str = "wrap.near";
    const AURORA: &str = "aurora";
    const NEAR: &str = "near";

    struct LiveRpc {
        _guard: tokio::sync::MutexGuard<'static, ()>,
        client: RpcClient,
    }

    async fn live_rpc() -> LiveRpc {
        static LOCK: tokio::sync::Mutex<()> = tokio::sync::Mutex::const_new(());
        let guard = LOCK.lock().await;
        LiveRpc {
            _guard: guard,
            client: RpcClient::new([LIVE_RPC_URL])
                .with_max_retries(4)
                .with_exponential_backoff_settings(Duration::from_millis(500), 2.0),
        }
    }

    fn wrap_near() -> AccountId {
        WRAP_NEAR.parse().unwrap()
    }

    fn aurora() -> AccountId {
        AURORA.parse().unwrap()
    }

    fn near() -> AccountId {
        NEAR.parse().unwrap()
    }

    fn format_rpc_response(response: &serde_json::Value) -> String {
        let pretty =
            serde_json::to_string_pretty(response).unwrap_or_else(|_| response.to_string());
        const MAX_CHARS: usize = 4000;
        if pretty.len() <= MAX_CHARS {
            pretty
        } else {
            format!(
                "{}… (truncated {} chars)",
                &pretty[..MAX_CHARS],
                pretty.len()
            )
        }
    }

    fn unwrap_rpc<T: std::fmt::Debug>(method: &str, result: Result<T, Error>) -> T {
        match result {
            Ok(value) => value,
            Err(Error::JsonRpcDeserialization(error, response)) => {
                panic!(
                    "{method}: response deserialization failed: {error}\n{}",
                    format_rpc_response(&response)
                );
            }
            Err(error) => panic!("{method}: request failed: {error:?}"),
        }
    }

    async fn latest_tx_hash(client: &RpcClient) -> CryptoHash {
        let mut block = unwrap_rpc(
            "block",
            client
                .block(BlockReference::Finality(Finality::Final))
                .await,
        );
        for _ in 0..30 {
            for chunk_header in &block.chunks {
                if chunk_header.height_included != block.header.height {
                    continue;
                }
                let chunk: serde_json::Value = unwrap_rpc(
                    "chunk",
                    client
                        .request(
                            "chunk",
                            serde_json::json!({ "chunk_id": chunk_header.chunk_hash }),
                        )
                        .await,
                );
                if let Some(hash) = chunk
                    .get("transactions")
                    .and_then(|transactions| transactions.as_array())
                    .and_then(|transactions| transactions.first())
                    .and_then(|transaction| transaction.get("hash"))
                    .and_then(|hash| hash.as_str())
                {
                    return hash.parse().expect("chunk transaction hash");
                }
            }
            block = unwrap_rpc(
                "block",
                client
                    .block(BlockReference::BlockId(BlockId::Hash(
                        block.header.prev_hash,
                    )))
                    .await,
            );
        }
        panic!("no transactions found in recent blocks");
    }

    #[tokio::test]
    async fn status() {
        let rpc = live_rpc().await;
        let status = unwrap_rpc("status", rpc.client.status().await);
        assert!(!status.chain_id.is_empty());
        assert!(status.protocol_version > 0);
        assert!(status.sync_info.latest_block_height > 0);
    }

    #[tokio::test]
    async fn block() {
        let rpc = live_rpc().await;
        let client = &rpc.client;
        let final_block = unwrap_rpc(
            "block",
            client
                .block(BlockReference::Finality(Finality::Final))
                .await,
        );
        assert!(final_block.header.height > 0);
        assert!(!final_block.chunks.is_empty());

        let by_hash = unwrap_rpc(
            "block",
            client
                .block(BlockReference::BlockId(BlockId::Hash(
                    final_block.header.hash,
                )))
                .await,
        );
        assert_eq!(by_hash.header.hash, final_block.header.hash);

        let by_height = unwrap_rpc(
            "block",
            client
                .block(BlockReference::BlockId(BlockId::Height(
                    final_block.header.height,
                )))
                .await,
        );
        assert_eq!(by_height.header.height, final_block.header.height);
    }

    #[tokio::test]
    async fn validators() {
        let rpc = live_rpc().await;
        let client = &rpc.client;
        let latest = unwrap_rpc(
            "validators",
            client.validators(EpochReference::Latest).await,
        );
        assert!(!latest.current_validators.is_empty());
        assert!(latest.epoch_height > 0);

        let block = unwrap_rpc(
            "block",
            client
                .block(BlockReference::Finality(Finality::Final))
                .await,
        );
        let by_block = unwrap_rpc(
            "validators",
            client
                .validators(EpochReference::BlockId(BlockId::Hash(block.header.hash)))
                .await,
        );
        assert_eq!(by_block.epoch_height, latest.epoch_height);
    }

    #[tokio::test]
    async fn query_view_account() {
        let rpc = live_rpc().await;
        let client = &rpc.client;
        let account = unwrap_rpc(
            "query",
            client
                .view_account(wrap_near(), QueryFinality::Finality(Finality::Final))
                .await,
        );
        assert!(account.storage_usage > 0);

        let response: QueryResponse = unwrap_rpc(
            "query",
            client
                .request(
                    "query",
                    Query {
                        request: QueryRequest::ViewAccount {
                            account_id: wrap_near(),
                        },
                        finality: QueryFinality::Finality(Finality::Final),
                    },
                )
                .await,
        );
        assert!(matches!(response.kind, QueryResponseKind::ViewAccount(_)));
        assert!(response.block_height > 0);
    }

    #[tokio::test]
    async fn query_view_code() {
        let rpc = live_rpc().await;
        let client = &rpc.client;
        let code = unwrap_rpc(
            "query",
            client
                .view_code(wrap_near(), QueryFinality::Finality(Finality::Final))
                .await,
        );
        assert!(!code.code.is_empty());

        let response: QueryResponse = unwrap_rpc(
            "query",
            client
                .request(
                    "query",
                    Query {
                        request: QueryRequest::ViewCode {
                            account_id: wrap_near(),
                        },
                        finality: QueryFinality::Finality(Finality::Final),
                    },
                )
                .await,
        );
        assert!(matches!(response.kind, QueryResponseKind::ViewCode(_)));
    }

    #[tokio::test]
    async fn query_call_function() {
        let rpc = live_rpc().await;
        let metadata: serde_json::Value = match rpc
            .client
            .call(
                wrap_near(),
                "ft_metadata",
                serde_json::json!({}),
                QueryFinality::Finality(Finality::Final),
            )
            .await
        {
            Ok(value) => value,
            Err(CallError::Rpc(Error::JsonRpcDeserialization(error, response))) => {
                panic!(
                    "query: response deserialization failed: {error}\n{}",
                    format_rpc_response(&response)
                );
            }
            Err(error) => panic!("query: request failed: {error:?}"),
        };
        assert_eq!(metadata["symbol"], "wNEAR");
    }

    #[tokio::test]
    async fn query_view_state() {
        let rpc = live_rpc().await;
        let state = unwrap_rpc(
            "query",
            rpc.client
                .view_state(
                    near(),
                    b"\xffintear-missing-prefix",
                    QueryFinality::Finality(Finality::Final),
                )
                .await,
        );
        assert!(state.values.is_empty());
    }

    #[tokio::test]
    async fn query_view_access_key_list() {
        let rpc = live_rpc().await;
        let keys = unwrap_rpc(
            "query",
            rpc.client
                .view_access_key_list(aurora(), QueryFinality::Finality(Finality::Final))
                .await,
        );
        assert!(!keys.keys.is_empty());
    }

    #[tokio::test]
    async fn query_view_access_key() {
        let rpc = live_rpc().await;
        let client = &rpc.client;
        let keys = unwrap_rpc(
            "query",
            client
                .view_access_key_list(aurora(), QueryFinality::Finality(Finality::Final))
                .await,
        );
        let public_key = keys
            .keys
            .iter()
            .find_map(|key| key.public_key.full_pubkey())
            .expect("aurora should have an ed25519 or secp256k1 access key");
        let _access_key = unwrap_rpc(
            "query",
            client
                .get_access_key(
                    aurora(),
                    public_key,
                    QueryFinality::Finality(Finality::Final),
                )
                .await,
        );
    }

    #[tokio::test]
    async fn intear_batch_query() {
        let rpc = live_rpc().await;
        let responses = unwrap_rpc(
            "INTEAR_batch_query",
            rpc.client
                .INTEAR_batch_query(vec![
                    Query {
                        request: QueryRequest::ViewAccount {
                            account_id: wrap_near(),
                        },
                        finality: QueryFinality::Finality(Finality::Final),
                    },
                    Query {
                        request: QueryRequest::CallFunction {
                            account_id: wrap_near(),
                            method_name: "ft_metadata".to_string(),
                            args: serde_json::to_vec(&serde_json::json!({})).unwrap().into(),
                        },
                        finality: QueryFinality::Finality(Finality::Final),
                    },
                ])
                .await,
        );
        assert_eq!(responses.len(), 2);
        match &responses[0] {
            ResultOrError::Result(response) => {
                assert!(matches!(response.kind, QueryResponseKind::ViewAccount(_)));
            }
            ResultOrError::Error(error) => {
                panic!("INTEAR_batch_query account query failed: {error:?}")
            }
        }
        match &responses[1] {
            ResultOrError::Result(response) => {
                assert!(matches!(response.kind, QueryResponseKind::CallResult(_)));
            }
            ResultOrError::Error(error) => {
                panic!("INTEAR_batch_query call query failed: {error:?}")
            }
        }
    }

    #[tokio::test]
    async fn tx() {
        let rpc = live_rpc().await;
        let tx_hash = latest_tx_hash(&rpc.client).await;
        let details = unwrap_rpc("tx", rpc.client.tx(tx_hash).await);
        assert!(details.final_execution_status >= TxExecutionStatus::Included);
    }

    #[tokio::test]
    async fn experimental_tx_status() {
        let rpc = live_rpc().await;
        let tx_hash = latest_tx_hash(&rpc.client).await;
        let details = unwrap_rpc(
            "EXPERIMENTAL_tx_status",
            rpc.client.EXPERIMENTAL_tx_status(tx_hash).await,
        );
        assert!(details.final_execution_status >= TxExecutionStatus::Included);
        let outcome = details
            .final_execution_outcome
            .expect("finalized transaction should include an execution outcome");
        assert!(
            !outcome
                .final_outcome
                .transaction
                .signer_id
                .as_str()
                .is_empty()
        );
    }
}
