use std::{collections::HashSet, env};

use async_trait::async_trait;
use chrono::{DateTime, Timelike, Utc};
use inindexer::{
    AutoContinue, BlockRange, Indexer, IndexerOptions,
    near_indexer_primitives::{
        CryptoHash, IndexerExecutionOutcomeWithReceipt, IndexerTransactionWithOutcome,
        StreamerMessage,
        types::AccountId,
        views::{AccessKeyPermissionView, ActionView, ExecutionStatusView, ReceiptEnumView},
    },
    near_utils::{MAINNET_GENESIS_BLOCK_HEIGHT, TESTNET_GENESIS_BLOCK_HEIGHT},
    neardata::NeardataProvider,
    run_indexer,
};
use near_min_api::types::near_crypto::{KeyType, PublicKeyHandle};
use sqlx::{PgPool, postgres::PgPoolOptions};
use tracing_subscriber::EnvFilter;

enum Network {
    Mainnet,
    Testnet,
}

struct TransactionRow {
    tx_hash: CryptoHash,
    block_timestamp: DateTime<Utc>,
    key_type: KeyType,
}

enum AccessKeyOp {
    Insert(PublicKeyHandle, AccountId),
    Delete(PublicKeyHandle, AccountId),
    WipeAccount(AccountId),
}

struct AccountIndexer {
    pool: PgPool,
    pending_transactions: Vec<TransactionRow>,
    pending_signers: HashSet<AccountId>,
    pending_access_key_ops: Vec<AccessKeyOp>,
}

impl AccountIndexer {
    fn new(pool: PgPool) -> Self {
        Self {
            pool,
            pending_transactions: Vec::new(),
            pending_signers: HashSet::new(),
            pending_access_key_ops: Vec::new(),
        }
    }
}

#[async_trait]
impl Indexer for AccountIndexer {
    type Error = String;

    async fn process_transaction(
        &mut self,
        transaction: &IndexerTransactionWithOutcome,
        block: &StreamerMessage,
    ) -> Result<(), Self::Error> {
        let block_timestamp =
            DateTime::from_timestamp_nanos(block.block.header.timestamp_nanosec as i64);
        self.pending_transactions.push(TransactionRow {
            tx_hash: transaction.transaction.hash,
            block_timestamp,
            key_type: transaction.transaction.public_key.key_type(),
        });
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
        let block_timestamp =
            DateTime::from_timestamp_nanos(block.block.header.timestamp_nanosec as i64);
        let hour = truncate_to_hour(block_timestamp);

        for op in self.pending_access_key_ops.drain(..) {
            match op {
                AccessKeyOp::Insert(key_handle, account_id) => {
                    sqlx::query!(
                        "INSERT INTO access_keys (key_handle, account_id) VALUES ($1, $2)",
                        key_handle.to_string(),
                        account_id.as_str()
                    )
                    .execute(&self.pool)
                    .await
                    .expect("insert_access_key: unexpected duplicate (key_handle, account_id)");
                }
                AccessKeyOp::Delete(key_handle, account_id) => {
                    sqlx::query!(
                        "DELETE FROM access_keys WHERE key_handle = $1 AND account_id = $2",
                        key_handle.to_string(),
                        account_id.as_str()
                    )
                    .execute(&self.pool)
                    .await
                    .expect("delete_access_key failed");
                }
                AccessKeyOp::WipeAccount(account_id) => {
                    sqlx::query!(
                        "DELETE FROM access_keys WHERE account_id = $1",
                        account_id.as_str()
                    )
                    .execute(&self.pool)
                    .await
                    .expect("delete_access_keys_for_account failed");
                }
            }
        }

        if !self.pending_transactions.is_empty() {
            let tx_hashes: Vec<Vec<u8>> = self
                .pending_transactions
                .iter()
                .map(|row| row.tx_hash.0.to_vec())
                .collect();
            let block_timestamps: Vec<DateTime<Utc>> = self
                .pending_transactions
                .iter()
                .map(|row| row.block_timestamp)
                .collect();
            let key_types: Vec<String> = self
                .pending_transactions
                .iter()
                .map(|row| row.key_type.to_string())
                .collect();
            sqlx::query!(
                "INSERT INTO transactions (tx_hash, block_timestamp, key_type)
                 SELECT * FROM UNNEST($1::bytea[], $2::timestamptz[], $3::text[])",
                &tx_hashes,
                &block_timestamps,
                &key_types
            )
            .execute(&self.pool)
            .await
            .expect("insert_transactions: unexpected duplicate tx_hash");

            let mut ed25519_count = 0i64;
            let mut secp256k1_count = 0i64;
            let mut ml_dsa_65_count = 0i64;
            for row in &self.pending_transactions {
                match row.key_type {
                    KeyType::ED25519 => ed25519_count += 1,
                    KeyType::SECP256K1 => secp256k1_count += 1,
                    KeyType::MLDSA65 => ml_dsa_65_count += 1,
                }
            }
            let mut hours = Vec::new();
            let mut key_types = Vec::new();
            let mut transaction_counts = Vec::new();
            for (key_type, count) in [
                (KeyType::ED25519, ed25519_count),
                (KeyType::SECP256K1, secp256k1_count),
                (KeyType::MLDSA65, ml_dsa_65_count),
            ] {
                hours.push(hour);
                key_types.push(key_type.to_string());
                transaction_counts.push(count);
            }
            sqlx::query!(
                "INSERT INTO hourly_key_type_stats (hour, key_type, transaction_count)
                 SELECT * FROM UNNEST($1::timestamptz[], $2::text[], $3::bigint[])
                 ON CONFLICT (hour, key_type) DO UPDATE SET
                     transaction_count = hourly_key_type_stats.transaction_count + EXCLUDED.transaction_count",
                &hours,
                &key_types,
                &transaction_counts
            )
            .execute(&self.pool)
            .await
            .expect("upsert_hourly_key_type_stats failed");
            self.pending_transactions.clear();
        }

        for account_id in &self.pending_signers {
            sqlx::query!(
                "INSERT INTO active_accounts (account_id, last_transaction_timestamp)
                 VALUES ($1, $2)
                 ON CONFLICT (account_id) DO UPDATE SET
                     last_transaction_timestamp = EXCLUDED.last_transaction_timestamp
                 WHERE EXCLUDED.last_transaction_timestamp > active_accounts.last_transaction_timestamp",
                account_id.as_str(),
                block_timestamp
            )
            .execute(&self.pool)
            .await
            .expect("upsert_active_account failed");
        }
        if !self.pending_signers.is_empty() {
            let account_ids: Vec<AccountId> = self.pending_signers.drain().collect();
            let account_id_strings: Vec<&str> = account_ids
                .iter()
                .map(|account_id| account_id.as_str())
                .collect();
            let hours = vec![hour; account_ids.len()];
            sqlx::query!(
                "INSERT INTO hourly_active_accounts (hour, account_id)
                 SELECT * FROM UNNEST($1::timestamptz[], $2::text[])
                 ON CONFLICT DO NOTHING",
                &hours,
                &account_id_strings as &[&str]
            )
            .execute(&self.pool)
            .await
            .expect("record_hourly_active_accounts failed");
        }

        if truncate_to_hour(block_timestamp + chrono::Duration::minutes(1)) != hour
            || block.block.header.height.is_multiple_of(100)
        {
            upsert_hourly_stats(&self.pool, hour).await;
        }

        Ok(())
    }
}

fn truncate_to_hour(timestamp: DateTime<Utc>) -> DateTime<Utc> {
    timestamp
        .date_naive()
        .and_hms_opt(timestamp.hour(), 0, 0)
        .expect("hour/0/0 is always a valid time")
        .and_utc()
}

async fn upsert_hourly_stats(pool: &PgPool, hour: DateTime<Utc>) {
    let adoption = sqlx::query!(
        "WITH accounts_this_hour AS (
            SELECT account_id FROM hourly_active_accounts WHERE hour = $1
        ),
        classified AS (
            SELECT a.account_id,
                   COUNT(*) AS total_keys,
                   COUNT(*) FILTER (WHERE ak.key_handle LIKE 'ml-dsa-65-hash:%') AS pq_keys
            FROM accounts_this_hour a
            JOIN access_keys ak ON ak.account_id = a.account_id
            GROUP BY a.account_id
        )
        SELECT
            (SELECT COUNT(*) FROM accounts_this_hour) AS active_accounts_count,
            COUNT(*) FILTER (WHERE total_keys = pq_keys) AS exclusively_pq_accounts_count
        FROM classified",
        hour
    )
    .fetch_one(pool)
    .await
    .expect("compute hourly PQ adoption failed");
    sqlx::query!(
        "INSERT INTO hourly_stats (hour, active_accounts_count, exclusively_pq_accounts_count)
         VALUES ($1, $2, $3)
         ON CONFLICT (hour) DO UPDATE SET
             active_accounts_count = EXCLUDED.active_accounts_count,
             exclusively_pq_accounts_count = EXCLUDED.exclusively_pq_accounts_count",
        hour,
        adoption.active_accounts_count,
        adoption.exclusively_pq_accounts_count
    )
    .execute(pool)
    .await
    .expect("upsert_hourly_stats failed");
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
