use base64::prelude::BASE64_STANDARD;
use base64::Engine;
use borsh::BorshSerialize;
use futures_channel::oneshot;
use futures_timer::Delay;
use futures_util::future::Either;
use futures_util::TryFutureExt;
use leptos::prelude::*;
use leptos::task::spawn_local;
use near_min_api::types::near_crypto::{SecretKey, Signature};
use near_min_api::types::{
    AccountId, Action, ActionErrorKind, CryptoHash, Finality, HandlerError, InvalidTxError,
    NearToken, RpcErrorKind, RpcRequestValidationErrorKind, RpcStatusError, RpcTransactionError,
    ServerError, SignedTransaction, Transaction, TransactionV0, TxExecutionError,
    TxExecutionStatus,
};
use near_min_api::{ExperimentalTxDetails, PendingTransaction, QueryFinality, RpcClient};
use rand::rngs::OsRng;
use rand::RngCore;
use std::cell::OnceCell;
use std::collections::VecDeque;
use std::time::Duration;

use crate::contexts::accounts_context::Account;

use super::accounts_context::AccountsContext;
use super::rpc_context::RpcContext;

#[derive(Clone, PartialEq, Debug)]
pub enum TransactionStage {
    Preparing,
    Publishing,
    Included,
    Doomslug,
    Finalized,
    Failed(String),
}

#[derive(Debug, Clone)]
pub enum TransactionType {
    NearTransaction {
        actions: Vec<Action>,
        receiver_id: AccountId,
    },
    NearIntents {
        message_to_sign: String,
        quote_hash: CryptoHash,
    },
}

enum TransactionResult<'a> {
    PendingTransaction(PendingTransaction<'a>),
    PendingIntent {
        intent_hash: CryptoHash,
        rpc_client: &'a RpcClient,
        tx_hash: OnceCell<CryptoHash>,
    },
}

impl<'a> TransactionResult<'a> {
    async fn wait_for(&self, status: TxExecutionStatus, timeout: Duration) -> Result<(), String> {
        match self {
            TransactionResult::PendingTransaction(tx) => tx
                .wait_for(status, timeout)
                .await
                .map_err(|e| format!("Failed to wait for transaction: {e}")),
            TransactionResult::PendingIntent {
                intent_hash,
                tx_hash,
                ..
            } => {
                if tx_hash.get().is_some() {
                    return Ok(());
                }
                match futures_util::future::select(
                    Box::pin(async {
                        loop {
                            let Ok(response) = reqwest::Client::new()
                                .post("https://solver-relay-v2.chaindefuser.com/rpc")
                                .json(&serde_json::json!({
                                    "jsonrpc": "2.0",
                                    "id": "dontcare",
                                    "method": "get_status",
                                    "params": [{
                                        "intent_hash": intent_hash
                                    }]
                                }))
                                .send()
                                .await
                            else {
                                return Err("Failed to get intent status".to_string());
                            };

                            let Ok(status) = response.json::<serde_json::Value>().await else {
                                return Err("Failed to parse intent status".to_string());
                            };

                            if let Some(result) = status.get("result") {
                                if let Some(status_str) =
                                    result.get("status").and_then(|s| s.as_str())
                                {
                                    if status_str == "SETTLED" {
                                        if let Some(hash) = result
                                            .get("data")
                                            .and_then(|d| d.get("hash").and_then(|h| h.as_str()))
                                            .and_then(|h| h.parse::<CryptoHash>().ok())
                                        {
                                            tx_hash.set(hash).unwrap();
                                        }
                                        return Ok(());
                                    } else if status_str != "PENDING"
                                        && status_str != "TX_BROADCASTED"
                                    {
                                        return Err(format!(
                                            "Intent failed with status: {}",
                                            status_str
                                        ));
                                    }
                                }
                            }

                            Delay::new(Duration::from_secs(1)).await;
                        }
                    }),
                    Box::pin(async {
                        Delay::new(timeout).await;
                    }),
                )
                .await
                {
                    Either::Left((res, _)) => res,
                    Either::Right((_, _)) => Err("Intent polling timed out".to_string()),
                }
            }
        }
    }

    async fn get_tx_details(&self) -> Result<ExperimentalTxDetails, String> {
        match self {
            TransactionResult::PendingTransaction(tx) => tx
                .EXPERIMENTAL_fetch_details()
                .await
                .map_err(|e| format!("Failed to fetch transaction details: {e}")),
            TransactionResult::PendingIntent {
                rpc_client,
                tx_hash,
                ..
            } => {
                if let Some(tx_hash) = tx_hash.get() {
                    rpc_client
                        .EXPERIMENTAL_tx_status(*tx_hash)
                        .await
                        .map_err(|e| format!("Failed to fetch intent status: {e}"))
                } else {
                    Err("Intent was not waited for".to_string())
                }
            }
        }
    }
}

impl TransactionType {
    async fn execute<'a>(
        &self,
        signer: Account,
        rpc_client: &'a RpcClient,
    ) -> Result<TransactionResult<'a>, String> {
        match self {
            TransactionType::NearTransaction {
                actions,
                receiver_id,
            } => {
                let access_key = match rpc_client
                    .get_access_key(
                        signer.account_id.clone(),
                        signer.secret_key.public_key(),
                        QueryFinality::Finality(Finality::None),
                    )
                    .await
                {
                    Ok(key) => key,
                    Err(e) => {
                        // TODO: Handle revoked / limited access keys better
                        return Err(format!("Failed to get access key: {e}"));
                    }
                };

                let block_hash = match rpc_client.fetch_recent_block_hash().await {
                    Ok(hash) => hash,
                    Err(e) => {
                        // Should never happen unless all RPCs are unstable, so no
                        // need to handle this gracefully
                        return Err(format!("Failed to fetch block hash: {e}"));
                    }
                };

                let tx = Transaction::V0(TransactionV0 {
                    signer_id: signer.account_id.clone(),
                    public_key: signer.secret_key.public_key(),
                    nonce: access_key.nonce + 1,
                    receiver_id: receiver_id.clone(),
                    block_hash,
                    actions: actions.clone(),
                });
                let signature = signer.secret_key.sign(tx.get_hash_and_size().0.as_ref());
                let signed_tx = SignedTransaction::new(signature, tx);

                match rpc_client.send_tx(signed_tx).await {
                    Ok(tx) => Ok(TransactionResult::PendingTransaction(tx)),
                    Err(e) => {
                        let error = match e {
                            near_min_api::Error::Reqwest(e) => format!("Failed to connect to RPC: {e}"),
                            near_min_api::Error::JsonRpc(e) => match e.error_struct {
                                None => format!("RPC error with code {code}: {message}", code = e.code, message = e.message),
                                Some(RpcErrorKind::HandlerError(handler_error)) => match handler_error {
                                    HandlerError::RpcQueryError(_) => unreachable!(),
                                    HandlerError::RpcReceiptError(_) => unreachable!(),
                                    HandlerError::RpcStatusError(status_error) => match status_error {
                                        RpcStatusError::NodeIsSyncing => "RPC node is syncing".to_string(),
                                        RpcStatusError::NoNewBlocks { elapsed } => format!("No blocks for {elapsed:?}"),
                                        RpcStatusError::EpochOutOfBounds { epoch_id } => format!("Epoch Out Of Bounds {epoch_id:?}"),
                                    },
                                    HandlerError::RpcTransactionError(tx_error) => match tx_error {
                                        RpcTransactionError::InvalidTransaction {} => {
                                            if let Some(data) = e.data {
                                                if let Ok(server_error) = serde_json::from_value::<ServerError>(data) {
                                                    match server_error {
                                                        ServerError::Closed => "RPC is closed".to_string(),
                                                        ServerError::Timeout => "RPC timeout".to_string(),
                                                        ServerError::TxExecutionError(e) => match e {
                                                            TxExecutionError::ActionError(action_error) => format!("Action error in action #{}: {}", action_error.index.map(|n| n.to_string()).unwrap_or("unknown".to_string()), match action_error.kind {
                                                                ActionErrorKind::AccountAlreadyExists { account_id } =>
                                                                    format!("Cannot create account {account_id}, because it already exists"),
                                                                ActionErrorKind::AccountDoesNotExist { account_id } =>
                                                                    format!("Account {account_id} doesn't exist"),
                                                                ActionErrorKind::CreateAccountOnlyByRegistrar { account_id, registrar_account_id, predecessor_id } =>
                                                                    format!("Account {account_id} can only be created by {registrar_account_id}, not by {predecessor_id}"),
                                                                ActionErrorKind::CreateAccountNotAllowed { account_id, predecessor_id } =>
                                                                    format!("Account {predecessor_id} cannot create account {account_id}"),
                                                                ActionErrorKind::ActorNoPermission { account_id, actor_id } =>
                                                                    format!("Account {actor_id} has no permission to act on {account_id}"),
                                                                ActionErrorKind::DeleteKeyDoesNotExist { account_id, public_key } =>
                                                                    format!("Cannot delete key {public_key} from account {account_id} - key doesn't exist"),
                                                                ActionErrorKind::AddKeyAlreadyExists { account_id, public_key } =>
                                                                    format!("Cannot add key {public_key} to account {account_id} - key already exists"),
                                                                ActionErrorKind::DeleteAccountStaking { account_id } =>
                                                                    format!("Cannot delete account {account_id} because it is staking"),
                                                                ActionErrorKind::LackBalanceForState { account_id, amount } =>
                                                                    format!("Account {account_id} needs {amount} more yoctoNEAR to cover storage"),
                                                                ActionErrorKind::TriesToUnstake { account_id } =>
                                                                    format!("Account {account_id} is trying to unstake but isn't staking"),
                                                                ActionErrorKind::TriesToStake { account_id, stake, locked, balance } =>
                                                                    format!("Account {account_id} cannot stake {stake} - has {locked} staked and {balance} balance"),
                                                                ActionErrorKind::InsufficientStake { account_id, stake, minimum_stake } =>
                                                                    format!("Account {account_id} tried to stake {stake} but minimum stake is {minimum_stake}"),
                                                                ActionErrorKind::FunctionCallError(e) =>
                                                                    format!("Function call error: {e:?}"),
                                                                ActionErrorKind::NewReceiptValidationError(e) =>
                                                                    format!("Receipt validation error: {e}"),
                                                                ActionErrorKind::OnlyImplicitAccountCreationAllowed { account_id } =>
                                                                    format!("Cannot explicitly create account {account_id} - only implicit creation allowed"),
                                                                ActionErrorKind::DeleteAccountWithLargeState { account_id } =>
                                                                    format!("Cannot delete account {account_id} - state is too large"),
                                                                ActionErrorKind::DelegateActionInvalidSignature =>
                                                                    "Invalid delegate action signature".to_string(),
                                                                ActionErrorKind::DelegateActionSenderDoesNotMatchTxReceiver { sender_id, receiver_id } =>
                                                                    format!("Delegate action sender {sender_id} doesn't match transaction receiver {receiver_id}"),
                                                                ActionErrorKind::DelegateActionExpired =>
                                                                    "Delegate action has expired".to_string(),
                                                                ActionErrorKind::DelegateActionAccessKeyError(e) =>
                                                                    format!("Delegate action access key error: {e}"),
                                                                ActionErrorKind::DelegateActionInvalidNonce { delegate_nonce, ak_nonce } =>
                                                                    format!("Invalid delegate action nonce {delegate_nonce} - must be greater than {ak_nonce}"),
                                                                ActionErrorKind::DelegateActionNonceTooLarge { delegate_nonce, upper_bound } =>
                                                                    format!("Delegate action nonce {delegate_nonce} is too large - must be less than {upper_bound}"),
                                                                ActionErrorKind::GlobalContractDoesNotExist { identifier } =>
                                                                    format!("Global contract not found: {identifier:?}"),
                                                            }),
                                                            TxExecutionError::InvalidTxError(e) => match e {
                                                                InvalidTxError::InvalidAccessKeyError(access_key_error) =>
                                                                    format!("Access key error: {access_key_error}"),
                                                                InvalidTxError::InvalidSignerId { signer_id } =>
                                                                    format!("Invalid signer account ID: {signer_id}"),
                                                                InvalidTxError::SignerDoesNotExist { signer_id } =>
                                                                    format!("Signer account {signer_id} does not exist"),
                                                                InvalidTxError::InvalidNonce { tx_nonce, ak_nonce } =>
                                                                    format!("Invalid nonce {tx_nonce} - must be greater than {ak_nonce}"),
                                                                InvalidTxError::NonceTooLarge { tx_nonce, upper_bound } =>
                                                                    format!("Nonce {tx_nonce} is too large - must be less than {upper_bound}"),
                                                                InvalidTxError::InvalidReceiverId { receiver_id } =>
                                                                    format!("Invalid receiver account ID: {receiver_id}"),
                                                                InvalidTxError::InvalidSignature =>
                                                                    "Invalid transaction signature".to_string(),
                                                                InvalidTxError::NotEnoughBalance { signer_id, balance, cost } =>
                                                                    format!("Not enough balance: {signer_id} has {balance} but needs {cost}{is_difference_small}", is_difference_small = if balance.saturating_sub(cost) < NearToken::from_millinear(1) { " (difference is less than 0.001 NEAR)" } else { "" }),
                                                                InvalidTxError::LackBalanceForState { signer_id, amount } =>
                                                                    format!("Account {signer_id} needs {amount} more to cover state"),
                                                                InvalidTxError::CostOverflow =>
                                                                    "Transaction cost overflow".to_string(),
                                                                InvalidTxError::InvalidChain =>
                                                                    "Invalid chain - transaction was created for a different chain".to_string(),
                                                                InvalidTxError::Expired =>
                                                                    "Transaction expired".to_string(),
                                                                InvalidTxError::ActionsValidation(e) =>
                                                                    format!("Actions validation error: {e}"),
                                                                InvalidTxError::TransactionSizeExceeded { size, limit } =>
                                                                    format!("Transaction size {size} exceeds limit {limit}"),
                                                                InvalidTxError::InvalidTransactionVersion =>
                                                                    "Invalid transaction version".to_string(),
                                                                InvalidTxError::StorageError(e) =>
                                                                    format!("Storage error: {e}"),
                                                                InvalidTxError::ShardCongested { shard_id, congestion_level: _ } =>
                                                                    format!("Shard {shard_id} is congested"),
                                                                InvalidTxError::ShardStuck { shard_id, missed_chunks: _ } =>
                                                                    format!("Shard {shard_id} is stuck"),
                                                            },
                                                        },
                                                    }
                                                } else {
                                                    "An error happened during transaction execution".to_string()
                                                }
                                            } else {
                                                "An error happened during transaction execution".to_string()
                                            }
                                        },
                                        RpcTransactionError::DoesNotTrackShard => "RPC node doesn't track this shard. The RPC is probably not working properly".to_string(),
                                        RpcTransactionError::RequestRouted { transaction_hash } =>
                                            format!("Transaction with hash {transaction_hash} was routed"),
                                        RpcTransactionError::UnknownTransaction { requested_transaction_hash } =>
                                            format!("Transaction {requested_transaction_hash} doesn't exist"),
                                        RpcTransactionError::TimeoutError => "Timeout".to_string(),
                                    },
                                    HandlerError::RpcLightClientProofError(_) => unreachable!(),
                                    HandlerError::Other(value) => format!("Other handler error: {value}"),
                                },
                                Some(RpcErrorKind::RequestValidationError(validation_error)) => match validation_error {
                                    RpcRequestValidationErrorKind::MethodNotFound { method_name } =>
                                        format!("Method not found: {method_name}"),
                                    RpcRequestValidationErrorKind::ParseError { error_message } =>
                                        format!("Parse error: {error_message}"),
                                },
                                Some(RpcErrorKind::InternalError(error)) => format!("Internal error: {error}"),
                            },
                            near_min_api::Error::JsonRpcDeserialization(e, res) => format!("Failed to parse JSON RPC response: {e}\n\nResponse: {}", serde_json::to_string_pretty(&res).unwrap()),
                            near_min_api::Error::NoRpcUrls => "RPC configuration error: No working RPCs found. Please add more RPCs in settings".to_string(),
                            near_min_api::Error::OtherQueryError(s) => format!("Unhandled execution error: {s}"),
                        };
                        log::error!("Failed to send transaction: {error}");
                        Err(error)
                    }
                }
            }
            TransactionType::NearIntents {
                message_to_sign,
                quote_hash,
            } => {
                let mut nonce = [0u8; 32];
                OsRng.fill_bytes(&mut nonce);

                let params = serde_json::json!([{
                    "quote_hashes": [quote_hash],
                    "signed_data": {
                        "standard": "nep413",
                        "payload": {
                            "message": message_to_sign,
                            "nonce": BASE64_STANDARD.encode(nonce),
                            "recipient": "intents.near",
                        },
                        "signature": sign_nep413(
                            signer.secret_key.clone(),
                            NEP413Payload {
                                message: message_to_sign.clone(),
                                nonce,
                                recipient: "intents.near".parse().unwrap(),
                                callback_url: None,
                            },
                        ),
                        "public_key": signer.secret_key.public_key(),
                    }
                }]);
                let Ok(response) = reqwest::Client::new()
                    .post("https://solver-relay-v2.chaindefuser.com/rpc")
                    .json(&serde_json::json!({
                        "jsonrpc": "2.0",
                        "id": "dontcare",
                        "method": "publish_intent",
                        "params": params,
                    }))
                    .send()
                    .await
                else {
                    return Err("Failed to publish intent".to_string());
                };
                let Ok(response_value) = response.json::<serde_json::Value>().await else {
                    return Err("Failed to parse publish intent response".to_string());
                };

                if let Some(result) = response_value.get("result") {
                    if let Some(intent_hash) = result.get("intent_hash").and_then(|h| h.as_str()) {
                        if let Ok(intent_hash) = intent_hash.parse::<CryptoHash>() {
                            Ok(TransactionResult::PendingIntent {
                                intent_hash,
                                rpc_client,
                                tx_hash: OnceCell::new(),
                            })
                        } else {
                            Err("Invalid intent hash".to_string())
                        }
                    } else {
                        Err("Intent hash not found in response".to_string())
                    }
                } else {
                    Err("Result not found in response".to_string())
                }
            }
        }
    }
}

#[derive(Debug, BorshSerialize)]
struct NEP413Payload {
    message: String,
    nonce: [u8; 32],
    recipient: String,
    callback_url: Option<String>,
}

fn sign_nep413(secret_key: SecretKey, payload: NEP413Payload) -> Signature {
    const NEP413_413_SIGN_MESSAGE_PREFIX: u32 = (1u32 << 31u32) + 413u32;
    let mut bytes = NEP413_413_SIGN_MESSAGE_PREFIX.to_le_bytes().to_vec();
    borsh::to_writer(&mut bytes, &payload).unwrap();
    let hash = CryptoHash::hash_bytes(&bytes);
    let signature = secret_key.sign(hash.as_ref());
    signature
}

#[derive(Debug)]
pub struct EnqueuedTransaction {
    pub description: String,
    pub stage: TransactionStage,
    pub signer_id: AccountId,
    // pub receiver_id: AccountId,
    // pub actions: Vec<Action>,
    pub transaction_type: TransactionType,
    /// None if the transaction has been taken
    details_tx: Option<oneshot::Sender<Result<ExperimentalTxDetails, String>>>,
    queue_id: u128,
}

impl EnqueuedTransaction {
    pub fn create(
        description: String,
        signer_id: AccountId,
        receiver_id: AccountId,
        actions: Vec<Action>,
    ) -> (
        oneshot::Receiver<Result<ExperimentalTxDetails, String>>,
        Self,
    ) {
        let (details_tx, details_rx) = oneshot::channel();
        (
            details_rx,
            Self {
                description,
                stage: TransactionStage::Preparing,
                signer_id,
                transaction_type: TransactionType::NearTransaction {
                    actions,
                    receiver_id,
                },
                queue_id: rand::random(),
                details_tx: Some(details_tx),
            },
        )
    }

    pub fn create_with_type(
        description: String,
        signer_id: AccountId,
        transaction_type: TransactionType,
    ) -> (
        oneshot::Receiver<Result<ExperimentalTxDetails, String>>,
        Self,
    ) {
        let (details_tx, details_rx) = oneshot::channel();
        (
            details_rx,
            Self {
                description,
                stage: TransactionStage::Preparing,
                signer_id,
                transaction_type,
                queue_id: rand::random(),
                details_tx: Some(details_tx),
            },
        )
    }

    pub fn in_same_queue_as(self, other: &Self) -> Self {
        Self {
            queue_id: other.queue_id,
            ..self
        }
    }

    fn clone_and_take_tx(&mut self) -> Self {
        let tx = if let Some(details_tx) = self.details_tx.take() {
            details_tx
        } else {
            panic!("Transaction has already been taken");
        };
        Self {
            description: self.description.clone(),
            stage: self.stage.clone(),
            signer_id: self.signer_id.clone(),
            transaction_type: self.transaction_type.clone(),
            details_tx: Some(tx),
            queue_id: self.queue_id,
        }
    }
}

#[derive(Clone)]
pub struct TransactionQueueContext {
    pub queue: ReadSignal<VecDeque<EnqueuedTransaction>>,
    pub add_transaction: WriteSignal<Vec<EnqueuedTransaction>>,
    pub current_index: ReadSignal<usize>,
    pub overlay_mode: RwSignal<OverlayMode>,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum OverlayMode {
    Modal,
    Background,
}

pub fn provide_transaction_queue_context() {
    let (queue, set_queue) = signal::<VecDeque<EnqueuedTransaction>>(VecDeque::new());
    let (transactions, set_transactions) = signal::<Vec<EnqueuedTransaction>>(Vec::new());
    let (is_processing, set_is_processing) = signal(false);
    let (current_index, set_current_index) = signal(0);
    let rpc_client = expect_context::<RpcContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();

    // Worker effect that processes the queue
    Effect::new(move |_| {
        queue.track();
        if !is_processing.get() {
            log::info!(
                "Processing transaction at index {}: {:?}",
                current_index.get_untracked(),
                queue.read_untracked().get(current_index.get())
            );
            log::info!("Queue: {:?}", *queue.read_untracked());
            let mut queue_mut = set_queue.write_untracked();
            if let Some(transaction) = queue_mut
                .get_mut(current_index.get())
                .filter(|tx| tx.stage == TransactionStage::Preparing)
                .map(|tx| tx.clone_and_take_tx())
            {
                set_is_processing.set(true);
                let tx_current_index = current_index.get();
                let current_queue_id = transaction.queue_id;
                let rpc_client = rpc_client.client.get();
                let Some(account) = accounts
                    .get_untracked()
                    .accounts
                    .iter()
                    .find(|account| account.account_id == transaction.signer_id)
                    .cloned()
                else {
                    log::error!("Account not found: {}", transaction.signer_id);
                    set_queue.update(|q| {
                        q[tx_current_index].stage =
                            TransactionStage::Failed("Account not found".into())
                    });
                    return;
                };

                spawn_local(async move {
                    log::info!("Transaction started: {}", transaction.description);
                    set_queue.update(|q| q[tx_current_index].stage = TransactionStage::Publishing);

                    let pending_tx = match transaction
                        .transaction_type
                        .execute(account, &rpc_client)
                        .await
                    {
                        Ok(tx) => tx,
                        Err(error) => {
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error.clone());
                                for tx in q.iter_mut() {
                                    if tx.stage == TransactionStage::Preparing && tx.queue_id == current_queue_id {
                                        tx.stage = TransactionStage::Failed("Cancelled because of previous transaction failure".into());
                                        tx.details_tx.take().expect("Transaction details sender should have not been taken until previous transaction in queue is near-final").send(Err(error.clone())).ok();
                                    }
                                }
                                transaction.details_tx.expect("Transaction details sender should have been taken by this task").send(Err(error.clone())).ok();
                            });
                            set_is_processing.set(false);
                            set_current_index.update(|i| *i += 1);
                            Delay::new(Duration::from_secs(5)).await;
                            set_queue.update(|q| {
                                let prev_len = q.len();
                                q.retain(|tx| tx.queue_id != current_queue_id);
                                set_current_index
                                    .update(|i| *i = i.saturating_sub(prev_len - q.len()));
                            });
                            return;
                        }
                    };

                    set_queue.update(|q| q[tx_current_index].stage = TransactionStage::Included);

                    match pending_tx
                        .wait_for(
                            TxExecutionStatus::ExecutedOptimistic,
                            Duration::from_millis(60000),
                        )
                        .and_then(|_| pending_tx.get_tx_details())
                        .await
                    {
                        Ok(details) => {
                            set_queue
                                .update(|q| q[tx_current_index].stage = TransactionStage::Doomslug);
                            transaction
                            .details_tx
                            .expect(
                                "Transaction details sender should have been taken by this task",
                            )
                            .send(Ok(details))
                            .ok();
                        }
                        Err(e) => {
                            let error = format!("Transaction failed to execute: {e}");
                            log::error!("{error}");
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error);
                                for tx in q.iter_mut() {
                                    if tx.stage == TransactionStage::Preparing && tx.queue_id == current_queue_id {
                                        tx.stage = TransactionStage::Failed("Cancelled because of previous transaction failure".into());
                                        tx.details_tx.take().expect("Transaction details sender should have not been taken until previous transaction in queue is near-final").send(Err(e.to_string())).ok();
                                    }
                                }
                                transaction.details_tx.expect("Transaction details sender should have been taken by this task").send(Err(e.to_string())).ok();
                            });
                            set_is_processing.set(false);
                            set_current_index.update(|i| *i += 1);
                            return;
                        }
                    }

                    set_current_index.update(|i| *i += 1);
                    set_is_processing.set(false);
                    if tx_current_index < queue.read_untracked().len() - 1 {
                        match pending_tx
                            .wait_for(TxExecutionStatus::Final, Duration::from_millis(10000))
                            .await
                        {
                            Ok(_) => {
                                set_queue.update(|q| {
                                    if let Some(transaction) = q.get_mut(tx_current_index) {
                                        if transaction.queue_id == current_queue_id {
                                            transaction.stage = TransactionStage::Finalized;
                                        }
                                    }
                                });
                                log::info!("Transaction completed: {}", transaction.description);
                            }
                            Err(e) => {
                                // Should never happen unless 33% of total NEAR Protocol stake
                                // is down or something is wrong with all RPCs
                                let error = format!("Transaction failed to finalize: {e}");
                                log::error!("{error}");
                                set_queue.update(|q| {
                                    q[tx_current_index].stage = TransactionStage::Failed(error)
                                });
                            }
                        }
                    } else {
                        set_timeout(
                            move || {
                                if queue.read_untracked().len() == tx_current_index + 1 {
                                    set_queue.update(|q| {
                                        q.clear();
                                    });
                                    set_current_index.set(0);
                                }
                            },
                            Duration::from_millis(200),
                        );
                    }
                });
            } else if current_index.get() < queue_mut.len() {
                set_current_index.update(|i| *i += 1);
            } else {
                let had_error = queue_mut
                    .get(current_index.get().saturating_sub(1))
                    .map(|tx| matches!(tx.stage, TransactionStage::Failed(_)))
                    .unwrap_or(false);
                set_timeout(
                    move || {
                        if queue.read_untracked().len() <= current_index.get_untracked() + 1
                            && !queue.read_untracked().is_empty()
                        {
                            set_queue.update(|q| {
                                q.clear();
                            });
                            set_current_index.set(0);
                        }
                    },
                    if had_error {
                        Duration::from_millis(5000)
                    } else {
                        Duration::from_millis(200)
                    },
                );
            }
        }
    });

    // Add new transactions to the queue
    Effect::new(move |_| {
        transactions.track();
        let mut txs_to_add = Vec::new();
        set_transactions.maybe_update(|t| {
            if !t.is_empty() {
                std::mem::swap(t, &mut txs_to_add);
                true
            } else {
                false
            }
        });
        if !txs_to_add.is_empty() {
            set_queue.update(|q| {
                q.extend(txs_to_add);
            });
        }
    });

    provide_context(TransactionQueueContext {
        queue,
        add_transaction: set_transactions,
        current_index,
        overlay_mode: RwSignal::new(OverlayMode::Modal),
    });
}
