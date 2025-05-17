use futures_channel::oneshot;
use futures_timer::Delay;
use leptos::prelude::*;
use leptos::task::spawn_local;
use near_min_api::types::{
    AccountId, Action, ActionErrorKind, Finality, HandlerError, InvalidTxError, NearToken,
    RpcErrorKind, RpcRequestValidationErrorKind, RpcStatusError, RpcTransactionError, ServerError,
    SignedTransaction, Transaction, TransactionV0, TxExecutionError, TxExecutionStatus,
};
use near_min_api::{ExperimentalTxDetails, QueryFinality};
use std::collections::VecDeque;
use std::time::Duration;

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

#[derive(Debug)]
pub struct EnqueuedTransaction {
    pub description: String,
    pub stage: TransactionStage,
    pub signer_id: AccountId,
    pub receiver_id: AccountId,
    pub actions: Vec<Action>,
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
                receiver_id,
                actions,
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
            receiver_id: self.receiver_id.clone(),
            actions: self.actions.clone(),
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
                let Some(key) = accounts
                    .get_untracked()
                    .accounts
                    .iter()
                    .find(|account| account.account_id == transaction.signer_id)
                    .map(|account| account.secret_key.clone())
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

                    let access_key = match rpc_client
                        .get_access_key(
                            transaction.signer_id.clone(),
                            key.public_key(),
                            QueryFinality::Finality(Finality::None),
                        )
                        .await
                    {
                        Ok(key) => key,
                        Err(e) => {
                            // TODO: Handle revoked / limited access keys better
                            let error = format!("Failed to get access key: {e}");
                            log::error!("{error}");
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error)
                            });
                            return;
                        }
                    };

                    let block_hash = match rpc_client.fetch_recent_block_hash().await {
                        Ok(hash) => hash,
                        Err(e) => {
                            // Should never happen unless all RPCs are unstable garbage, so no
                            // need to handle this gracefully
                            let error = format!("Failed to fetch block hash: {e}");
                            log::error!("{error}");
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error)
                            });
                            return;
                        }
                    };

                    let tx = Transaction::V0(TransactionV0 {
                        signer_id: transaction.signer_id.clone(),
                        public_key: key.public_key(),
                        nonce: access_key.nonce + 1,
                        receiver_id: transaction.receiver_id.clone(),
                        block_hash,
                        actions: transaction.actions.clone(),
                    });
                    let signature = key.sign(tx.get_hash_and_size().0.as_ref());
                    let signed_tx = SignedTransaction::new(signature, tx);

                    let pending_tx = match rpc_client.send_tx(signed_tx).await {
                        Ok(tx) => tx,
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
                                                                        format!("Not enough balance: {signer_id} has {balance} but needs {cost}", balance = NearToken::from_yoctonear(balance), cost = NearToken::from_yoctonear(cost)),
                                                                    InvalidTxError::LackBalanceForState { signer_id, amount } =>
                                                                        format!("Account {signer_id} needs {amount} more to cover state", amount = NearToken::from_yoctonear(amount)),
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
                            Delay::new(Duration::from_secs(3)).await;
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
                            Duration::from_millis(10000),
                        )
                        .await
                    {
                        Ok(_) => {
                            set_queue
                                .update(|q| q[tx_current_index].stage = TransactionStage::Doomslug);
                        }
                        Err(e) => {
                            let error = format!("Transaction failed to execute: {e}");
                            log::error!("{error}");
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error);
                                for tx in q.iter_mut() {
                                    if tx.stage == TransactionStage::Preparing && tx.queue_id == current_queue_id {
                                        tx.stage = TransactionStage::Failed("Cancelled because of previous transaction failure".into());
                                        tx.details_tx.take().expect("Transaction details sender should have not been taken until previous transaction in queue is near-final").send(Err(format!("{e}"))).ok();
                                    }
                                }
                                transaction.details_tx.expect("Transaction details sender should have been taken by this task").send(Err(format!("{e}"))).ok();
                            });
                            set_is_processing.set(false);
                            set_current_index.update(|i| *i += 1);
                            return;
                        }
                    }

                    if let Ok(details) = pending_tx.EXPERIMENTAL_fetch_details().await {
                        transaction
                            .details_tx
                            .expect(
                                "Transaction details sender should have been taken by this task",
                            )
                            .send(Ok(details))
                            .ok();
                    } else {
                        panic!("Failed to fetch transaction details after doomslug finality");
                    }
                    if tx_current_index < queue.read_untracked().len() - 1 {
                        set_current_index.update(|i| *i += 1);
                        set_is_processing.set(false);
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
                        set_queue.update(|q| {
                            q.clear();
                        });
                        set_current_index.set(0);
                        set_is_processing.set(false);
                    }
                });
            } else if current_index.get() < queue_mut.len() {
                set_current_index.update(|i| *i += 1);
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
    });
}
