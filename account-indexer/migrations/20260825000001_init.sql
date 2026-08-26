CREATE TABLE access_keys (
    key_handle TEXT NOT NULL,
    account_id TEXT NOT NULL,
    PRIMARY KEY (key_handle, account_id)
);

CREATE INDEX idx_access_keys_account_id ON access_keys (account_id);

CREATE TABLE active_accounts (
    account_id TEXT PRIMARY KEY,
    last_transaction_timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE transactions (
    tx_hash BYTEA PRIMARY KEY,
    block_timestamp TIMESTAMPTZ NOT NULL,
    key_type TEXT NOT NULL
);

CREATE INDEX idx_transactions_block_timestamp ON transactions (block_timestamp);

CREATE TABLE hourly_key_type_stats (
    hour TIMESTAMPTZ NOT NULL,
    key_type TEXT NOT NULL,
    transaction_count BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (hour, key_type)
);

CREATE TABLE hourly_active_accounts (
    hour TIMESTAMPTZ NOT NULL,
    account_id TEXT NOT NULL,
    PRIMARY KEY (hour, account_id)
);

CREATE TABLE hourly_stats (
    hour TIMESTAMPTZ PRIMARY KEY,
    active_accounts_count BIGINT NOT NULL,
    exclusively_pq_accounts_count BIGINT NOT NULL
);
