use futures_channel::oneshot;
use leptos::prelude::*;
use leptos::task::spawn_local;
use near_min_api::types::{
    AccountId, Action, Finality, SignedTransaction, Transaction, TransactionV0, TxExecutionStatus,
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
    details_tx: Option<oneshot::Sender<ExperimentalTxDetails>>,
    queue_id: u128,
}

impl EnqueuedTransaction {
    pub fn create(
        description: String,
        signer_id: AccountId,
        receiver_id: AccountId,
        actions: Vec<Action>,
    ) -> (oneshot::Receiver<ExperimentalTxDetails>, Self) {
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
            if let Some(transaction) = set_queue
                .write_untracked()
                .get_mut(current_index.get())
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
                            let error = format!("Failed to get access key: {}", e);
                            log::error!("{}", error);
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error)
                            });
                            return;
                        }
                    };

                    let block_hash = match rpc_client.fetch_recent_block_hash().await {
                        Ok(hash) => hash,
                        Err(e) => {
                            let error = format!("Failed to fetch block hash: {}", e);
                            log::error!("{}", error);
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
                            let error = format!("Failed to send transaction: {}", e);
                            log::error!("{}", error);
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error)
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
                            let error = format!("Transaction failed to execute: {}", e);
                            log::error!("{}", error);
                            set_queue.update(|q| {
                                q[tx_current_index].stage = TransactionStage::Failed(error)
                            });
                            return;
                        }
                    }

                    if let Ok(details) = pending_tx.EXPERIMENTAL_fetch_details().await {
                        transaction
                            .details_tx
                            .expect("Transaction should have been taken by this task")
                            .send(details)
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
                                let error = format!("Transaction failed to finalize: {}", e);
                                log::error!("{}", error);
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
