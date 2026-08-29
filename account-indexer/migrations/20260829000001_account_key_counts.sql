DROP TABLE transactions;
DROP TABLE active_accounts;

CREATE TABLE account_key_counts (
    account_id TEXT PRIMARY KEY,
    full_access_key_count INTEGER NOT NULL,
    pq_key_count INTEGER NOT NULL,
    is_exclusively_pq BOOLEAN GENERATED ALWAYS AS
        (full_access_key_count > 0 AND full_access_key_count = pq_key_count) STORED
);

CREATE INDEX idx_account_key_counts_pq
    ON account_key_counts (account_id) WHERE is_exclusively_pq;

INSERT INTO account_key_counts (account_id, full_access_key_count, pq_key_count)
SELECT account_id,
       count(*)::int,
       count(*) FILTER (WHERE key_handle LIKE 'ml-dsa-65-hash:%')::int
FROM access_keys
GROUP BY account_id;

CREATE TABLE indexer_progress (
    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
    last_block_height BIGINT NOT NULL
);
