use std::{collections::HashSet, env};

use async_trait::async_trait;
use chrono::{DateTime, Timelike, Utc};
use inindexer::{
    AutoContinue, BlockRange, Indexer, IndexerOptions,
    near_indexer_primitives::{
        IndexerExecutionOutcomeWithReceipt, IndexerTransactionWithOutcome, StreamerMessage,
        types::AccountId,
        views::{AccessKeyPermissionView, ActionView, ExecutionStatusView, ReceiptEnumView},
    },
    near_utils::{MAINNET_GENESIS_BLOCK_HEIGHT, TESTNET_GENESIS_BLOCK_HEIGHT},
    neardata::NeardataProvider,
    run_indexer,
};
use near_min_api::types::near_crypto::{KeyType, PublicKeyHandle};
use sqlx::{PgPool, Postgres, Transaction, postgres::PgPoolOptions};
use tracing_subscriber::EnvFilter;

enum Network {
    Mainnet,
    Testnet,
}

#[derive(Default)]
struct KeyTypeCounts {
    ed25519: i64,
    secp256k1: i64,
    ml_dsa_65: i64,
}

impl KeyTypeCounts {
    fn record(&mut self, key_type: KeyType) {
        match key_type {
            KeyType::ED25519 => self.ed25519 += 1,
            KeyType::SECP256K1 => self.secp256k1 += 1,
            KeyType::MLDSA65 => self.ml_dsa_65 += 1,
        }
    }

    fn per_key_type(&self) -> [(KeyType, i64); 3] {
        [
            (KeyType::ED25519, self.ed25519),
            (KeyType::SECP256K1, self.secp256k1),
            (KeyType::MLDSA65, self.ml_dsa_65),
        ]
    }
}

enum AccessKeyOp {
    Insert(PublicKeyHandle, AccountId),
    Delete(PublicKeyHandle, AccountId),
    WipeAccount(AccountId),
}

struct AccountIndexer {
    pool: PgPool,
    pending_transaction_counts: KeyTypeCounts,
    pending_signers: HashSet<AccountId>,
    pending_access_key_ops: Vec<AccessKeyOp>,
    last_seen_hour: Option<DateTime<Utc>>,
}

impl AccountIndexer {
    fn new(pool: PgPool) -> Self {
        Self {
            pool,
            pending_transaction_counts: KeyTypeCounts::default(),
            pending_signers: HashSet::new(),
            pending_access_key_ops: Vec::new(),
            last_seen_hour: None,
        }
    }

    fn discard_pending(&mut self) {
        self.pending_transaction_counts = KeyTypeCounts::default();
        self.pending_signers.clear();
        self.pending_access_key_ops.clear();
    }
}

#[async_trait]
impl Indexer for AccountIndexer {
    type Error = String;

    async fn process_transaction(
        &mut self,
        transaction: &IndexerTransactionWithOutcome,
        _block: &StreamerMessage,
    ) -> Result<(), Self::Error> {
        self.pending_transaction_counts
            .record(transaction.transaction.public_key.key_type());
        self.pending_signers
            .insert(transaction.transaction.signer_id.clone());
        Ok(())
    }

    async fn process_receipt(
        &mut self,
        receipt: &IndexerExecutionOutcomeWithReceipt,
        _block: &StreamerMessage,
    ) -> Result<(), Self::Error> {
        let is_successful = matches!(
            receipt.execution_outcome.outcome.status,
            ExecutionStatusView::SuccessValue(_) | ExecutionStatusView::SuccessReceiptId(_)
        );
        if !is_successful {
            return Ok(());
        }
        let ReceiptEnumView::Action { actions, .. } = &receipt.receipt.receipt else {
            return Ok(());
        };
        let receiver_id = receipt.receipt.receiver_id.clone();
        for action in actions {
            match action {
                ActionView::AddKey {
                    public_key,
                    access_key,
                } => {
                    if matches!(access_key.permission, AccessKeyPermissionView::FullAccess) {
                        self.pending_access_key_ops
                            .push(AccessKeyOp::Insert(public_key.into(), receiver_id.clone()));
                    }
                }
                ActionView::DeleteKey { public_key } => {
                    self.pending_access_key_ops
                        .push(AccessKeyOp::Delete(public_key.into(), receiver_id.clone()));
                }
                ActionView::DeleteAccount { .. } => {
                    self.pending_access_key_ops
                        .push(AccessKeyOp::WipeAccount(receiver_id.clone()));
                }
                _ => {}
            }
        }
        Ok(())
    }

    async fn process_block_end(&mut self, block: &StreamerMessage) -> Result<(), Self::Error> {
        let block_height = block.block.header.height as i64;
        let block_timestamp =
            DateTime::from_timestamp_nanos(block.block.header.timestamp_nanosec as i64);
        let hour = truncate_to_hour(block_timestamp);

        let mut db_transaction = self
            .pool
            .begin()
            .await
            .expect("begin block transaction failed");

        let last_applied_height =
            sqlx::query_scalar!("SELECT last_block_height FROM indexer_progress WHERE id")
                .fetch_optional(&mut *db_transaction)
                .await
                .expect("read indexer_progress failed");
        if last_applied_height.is_some_and(|applied| applied >= block_height) {
            self.discard_pending();
            return Ok(());
        }

        for op_group in group_consecutive_ops(std::mem::take(&mut self.pending_access_key_ops)) {
            match op_group {
                AccessKeyOpGroup::Insert {
                    key_handles,
                    account_ids,
                } => {
                    sqlx::query!(
                        "WITH inserted AS (
                             INSERT INTO access_keys (key_handle, account_id)
                             SELECT * FROM UNNEST($1::text[], $2::text[])
                             ON CONFLICT DO NOTHING
                             RETURNING account_id, key_handle
                         ), deltas AS (
                             SELECT account_id,
                                    count(*)::int AS added_keys,
                                    count(*) FILTER (WHERE key_handle LIKE 'ml-dsa-65-hash:%')::int
                                        AS added_pq_keys
                             FROM inserted
                             GROUP BY account_id
                         )
                         INSERT INTO account_key_counts (account_id, full_access_key_count, pq_key_count)
                         SELECT account_id, added_keys, added_pq_keys FROM deltas
                         ON CONFLICT (account_id) DO UPDATE SET
                             full_access_key_count = account_key_counts.full_access_key_count
                                 + EXCLUDED.full_access_key_count,
                             pq_key_count = account_key_counts.pq_key_count + EXCLUDED.pq_key_count",
                        &key_handles,
                        &account_ids
                    )
                    .execute(&mut *db_transaction)
                    .await
                    .expect("insert_access_keys failed");
                }
                AccessKeyOpGroup::Delete {
                    key_handles,
                    account_ids,
                } => {
                    sqlx::query!(
                        "WITH deleted AS (
                             DELETE FROM access_keys
                             WHERE (key_handle, account_id)
                                 IN (SELECT * FROM UNNEST($1::text[], $2::text[]))
                             RETURNING account_id, key_handle
                         ), deltas AS (
                             SELECT account_id,
                                    count(*)::int AS removed_keys,
                                    count(*) FILTER (WHERE key_handle LIKE 'ml-dsa-65-hash:%')::int
                                        AS removed_pq_keys
                             FROM deleted
                             GROUP BY account_id
                         )
                         UPDATE account_key_counts SET
                             full_access_key_count = account_key_counts.full_access_key_count
                                 - deltas.removed_keys,
                             pq_key_count = account_key_counts.pq_key_count - deltas.removed_pq_keys
                         FROM deltas
                         WHERE account_key_counts.account_id = deltas.account_id",
                        &key_handles,
                        &account_ids
                    )
                    .execute(&mut *db_transaction)
                    .await
                    .expect("delete_access_keys failed");
                }
                AccessKeyOpGroup::WipeAccount { account_ids } => {
                    sqlx::query!(
                        "DELETE FROM access_keys WHERE account_id = ANY($1::text[])",
                        &account_ids
                    )
                    .execute(&mut *db_transaction)
                    .await
                    .expect("delete_access_keys_for_accounts failed");
                    sqlx::query!(
                        "DELETE FROM account_key_counts WHERE account_id = ANY($1::text[])",
                        &account_ids
                    )
                    .execute(&mut *db_transaction)
                    .await
                    .expect("delete_account_key_counts failed");
                }
            }
        }

        let mut hours = Vec::new();
        let mut key_types = Vec::new();
        let mut transaction_counts = Vec::new();
        for (key_type, count) in self.pending_transaction_counts.per_key_type() {
            if count == 0 {
                continue;
            }
            hours.push(hour);
            key_types.push(key_type.to_string());
            transaction_counts.push(count);
        }
        self.pending_transaction_counts = KeyTypeCounts::default();
        if !hours.is_empty() {
            sqlx::query!(
                "INSERT INTO hourly_key_type_stats (hour, key_type, transaction_count)
                 SELECT * FROM UNNEST($1::timestamptz[], $2::text[], $3::bigint[])
                 ON CONFLICT (hour, key_type) DO UPDATE SET
                     transaction_count = hourly_key_type_stats.transaction_count + EXCLUDED.transaction_count",
                &hours,
                &key_types,
                &transaction_counts
            )
            .execute(&mut *db_transaction)
            .await
            .expect("upsert_hourly_key_type_stats failed");
        }

        if !self.pending_signers.is_empty() {
            let account_ids: Vec<String> = self
                .pending_signers
                .drain()
                .map(|account_id| account_id.to_string())
                .collect();
            let hours = vec![hour; account_ids.len()];
            sqlx::query!(
                "INSERT INTO hourly_active_accounts (hour, account_id)
                 SELECT * FROM UNNEST($1::timestamptz[], $2::text[])
                 ON CONFLICT DO NOTHING",
                &hours,
                &account_ids
            )
            .execute(&mut *db_transaction)
            .await
            .expect("record_hourly_active_accounts failed");
        }

        let hour_changed = self.last_seen_hour != Some(hour);
        if hour_changed {
            finalize_past_hours(&mut db_transaction, hour).await;
        }
        if hour_changed || block.block.header.height.is_multiple_of(100) {
            upsert_hourly_stats(&mut db_transaction, hour).await;
        }

        sqlx::query!(
            "INSERT INTO indexer_progress (id, last_block_height) VALUES (TRUE, $1)
             ON CONFLICT (id) DO UPDATE SET last_block_height = EXCLUDED.last_block_height",
            block_height
        )
        .execute(&mut *db_transaction)
        .await
        .expect("upsert_indexer_progress failed");

        db_transaction
            .commit()
            .await
            .expect("commit block transaction failed");
        self.last_seen_hour = Some(hour);

        Ok(())
    }
}

enum AccessKeyOpGroup {
    Insert {
        key_handles: Vec<String>,
        account_ids: Vec<String>,
    },
    Delete {
        key_handles: Vec<String>,
        account_ids: Vec<String>,
    },
    WipeAccount {
        account_ids: Vec<String>,
    },
}

/// Merges runs of same-kind operations into batched statements. Only consecutive
/// operations are merged, because a key added and then deleted within the same block
/// must still be applied in that order.
fn group_consecutive_ops(ops: Vec<AccessKeyOp>) -> Vec<AccessKeyOpGroup> {
    let mut groups: Vec<AccessKeyOpGroup> = Vec::new();
    for op in ops {
        match op {
            AccessKeyOp::Insert(key_handle, account_id) => {
                if let Some(AccessKeyOpGroup::Insert {
                    key_handles,
                    account_ids,
                }) = groups.last_mut()
                {
                    key_handles.push(key_handle.to_string());
                    account_ids.push(account_id.to_string());
                } else {
                    groups.push(AccessKeyOpGroup::Insert {
                        key_handles: vec![key_handle.to_string()],
                        account_ids: vec![account_id.to_string()],
                    });
                }
            }
            AccessKeyOp::Delete(key_handle, account_id) => {
                if let Some(AccessKeyOpGroup::Delete {
                    key_handles,
                    account_ids,
                }) = groups.last_mut()
                {
                    key_handles.push(key_handle.to_string());
                    account_ids.push(account_id.to_string());
                } else {
                    groups.push(AccessKeyOpGroup::Delete {
                        key_handles: vec![key_handle.to_string()],
                        account_ids: vec![account_id.to_string()],
                    });
                }
            }
            AccessKeyOp::WipeAccount(account_id) => {
                if let Some(AccessKeyOpGroup::WipeAccount { account_ids }) = groups.last_mut() {
                    account_ids.push(account_id.to_string());
                } else {
                    groups.push(AccessKeyOpGroup::WipeAccount {
                        account_ids: vec![account_id.to_string()],
                    });
                }
            }
        }
    }
    groups
}

fn truncate_to_hour(timestamp: DateTime<Utc>) -> DateTime<Utc> {
    timestamp
        .date_naive()
        .and_hms_opt(timestamp.hour(), 0, 0)
        .expect("hour/0/0 is always a valid time")
        .and_utc()
}

async fn upsert_hourly_stats(db_transaction: &mut Transaction<'_, Postgres>, hour: DateTime<Utc>) {
    sqlx::query!(
        "INSERT INTO hourly_stats (hour, active_accounts_count, exclusively_pq_accounts_count)
         SELECT $1::timestamptz, count(*), count(*) FILTER (WHERE c.is_exclusively_pq)
         FROM hourly_active_accounts h
         LEFT JOIN account_key_counts c ON c.account_id = h.account_id
         WHERE h.hour = $1
         ON CONFLICT (hour) DO UPDATE SET
             active_accounts_count = EXCLUDED.active_accounts_count,
             exclusively_pq_accounts_count = EXCLUDED.exclusively_pq_accounts_count",
        hour
    )
    .execute(&mut **db_transaction)
    .await
    .expect("upsert_hourly_stats failed");
}

/// Writes the final numbers for every hour that has already elapsed, then drops their
/// per-account rows: only the current hour is ever recomputed, so the membership of
/// earlier hours is no longer needed.
async fn finalize_past_hours(
    db_transaction: &mut Transaction<'_, Postgres>,
    current_hour: DateTime<Utc>,
) {
    sqlx::query!(
        "INSERT INTO hourly_stats (hour, active_accounts_count, exclusively_pq_accounts_count)
         SELECT h.hour, count(*), count(*) FILTER (WHERE c.is_exclusively_pq)
         FROM hourly_active_accounts h
         LEFT JOIN account_key_counts c ON c.account_id = h.account_id
         WHERE h.hour < $1
         GROUP BY h.hour
         ON CONFLICT (hour) DO UPDATE SET
             active_accounts_count = EXCLUDED.active_accounts_count,
             exclusively_pq_accounts_count = EXCLUDED.exclusively_pq_accounts_count",
        current_hour
    )
    .execute(&mut **db_transaction)
    .await
    .expect("finalize_past_hourly_stats failed");

    sqlx::query!(
        "DELETE FROM hourly_active_accounts WHERE hour < $1",
        current_hour
    )
    .execute(&mut **db_transaction)
    .await
    .expect("prune_hourly_active_accounts failed");
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive("info".parse().unwrap())
                .from_env()
                .unwrap(),
        )
        .init();

    let network = match env::var("NETWORK").as_deref() {
        Ok("mainnet") => Network::Mainnet,
        Ok("testnet") => Network::Testnet,
        _ => {
            panic!("Invalid NETWORK environment variable. Should be either 'mainnet' or 'testnet'")
        }
    };
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL environment variable is required");
    let pool = PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run database migrations");

    let mut indexer = AccountIndexer::new(pool);

    let (provider, genesis_block_height) = match network {
        Network::Mainnet => (NeardataProvider::mainnet(), MAINNET_GENESIS_BLOCK_HEIGHT),
        Network::Testnet => (NeardataProvider::testnet(), TESTNET_GENESIS_BLOCK_HEIGHT),
    };

    run_indexer(
        &mut indexer,
        provider,
        IndexerOptions {
            range: BlockRange::AutoContinue(AutoContinue {
                start_height_if_does_not_exist: genesis_block_height,
                ..Default::default()
            }),
            stop_on_error: false,
            preprocess_transactions: None,
            genesis_block_height,
            ctrl_c_handler: true,
        },
    )
    .await
    .expect("Indexer run failed");
}
