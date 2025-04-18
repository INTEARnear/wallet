use leptos::prelude::*;
use leptos::task::spawn_local;
use near_min_api::types::{
    AccountId, Action, Finality, SignedTransaction, Transaction, TransactionV0, TxExecutionStatus,
};
use near_min_api::QueryFinality;
use std::collections::VecDeque;
use std::time::Duration;

use super::accounts_context::AccountsContext;
use super::rpc_context::RpcContext;

#[derive(Clone, Copy, PartialEq, Debug)]
pub enum TransactionStage {
    Preparing,
    Publishing,
    Included,
    Doomslug,
    Finalized,
}

#[derive(Clone, Debug)]
pub struct EnqueuedTransaction {
    pub description: String,
    pub stage: TransactionStage,
    pub signer_id: AccountId,
    pub receiver_id: AccountId,
    pub actions: Vec<Action>,
    queue_id: u128,
}

impl EnqueuedTransaction {
    pub fn new(
        description: String,
        signer_id: AccountId,
        receiver_id: AccountId,
        actions: Vec<Action>,
    ) -> Self {
        Self {
            description,
            stage: TransactionStage::Preparing,
            signer_id,
            receiver_id,
            actions,
            queue_id: rand::random(),
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
        if !is_processing.get() {
            if let Some(transaction) = queue().get_mut(current_index.get()).cloned() {
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
                    log::error!("Account not found: {:?}", transaction);
                    return;
                };

                spawn_local(async move {
                    log::info!("Transaction started: {}", transaction.description);
                    set_queue.update(|q| q[tx_current_index].stage = TransactionStage::Publishing);

                    let Ok(access_key) = rpc_client
                        .get_access_key(
                            transaction.signer_id.clone(),
                            key.public_key(),
                            QueryFinality::Finality(Finality::None),
                        )
                        .await
                    else {
                        log::error!("Access key not found: {:?}", transaction);
                        return;
                    };
                    let tx = Transaction::V0(TransactionV0 {
                        signer_id: transaction.signer_id.clone(),
                        public_key: key.public_key(),
                        nonce: access_key.nonce + 1,
                        receiver_id: transaction.receiver_id.clone(),
                        block_hash: rpc_client.fetch_recent_block_hash().await.unwrap(),
                        actions: transaction.actions.clone(),
                    });
                    let signature = key.sign(tx.get_hash_and_size().0.as_ref());
                    let signed_tx = SignedTransaction::new(signature, tx);
                    let Ok(pending_tx) = rpc_client.send_tx(signed_tx).await else {
                        log::error!("Transaction failed: {:?}", transaction);
                        return;
                    };
                    set_queue.update(|q| q[tx_current_index].stage = TransactionStage::Included);

                    if pending_tx
                        .wait_for(
                            TxExecutionStatus::ExecutedOptimistic,
                            Duration::from_millis(10000),
                        )
                        .await
                        .is_err()
                    {
                        log::error!("Transaction failed: {:?}", transaction);
                        return;
                    }
                    set_queue.update(|q| q[tx_current_index].stage = TransactionStage::Doomslug);
                    set_is_processing.set(false);
                    if tx_current_index < queue.get_untracked().len() - 1 {
                        set_current_index.update(|i| *i += 1);
                        if pending_tx
                            .wait_for(TxExecutionStatus::Final, Duration::from_millis(10000))
                            .await
                            .is_err()
                        {
                            log::error!("Transaction failed: {:?}", transaction);
                            return;
                        }
                        set_queue.update(|q| {
                            if let Some(transaction) = q.get_mut(tx_current_index) {
                                if transaction.queue_id == current_queue_id {
                                    transaction.stage = TransactionStage::Finalized;
                                }
                            }
                        });
                        log::info!("Transaction completed: {}", transaction.description);
                    } else {
                        set_queue.update(|q| {
                            q.clear();
                        });
                        set_current_index.set(0);
                    }
                });
            }
        }
    });

    // Effect to add new transactions to the queue
    Effect::new(move |_| {
        let txs = transactions.get();
        if !txs.is_empty() {
            set_queue.update(|q| {
                q.extend(txs);
            });
            set_transactions.set(Vec::new());
        }
    });

    provide_context(TransactionQueueContext {
        queue,
        add_transaction: set_transactions,
        current_index,
    });
}
