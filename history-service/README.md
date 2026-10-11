# History Service

API for a wallet that pages through [price-indexer](https://docs.intear.tech/docs/token-indexer/)'s `/transfers` for the transactions the user sent or received and the ones that moved their tokens or NEAR, fetches transaction data from normal / archival RPC, and uses [RocksDB](https://rocksdb.org) to cache transaction responses.

`GET /api/transactions/{account_id}?cursor=` returns `{ "transactions": [...], "next_cursor": "string" | null }`, newest first. Pass `next_cursor` back as `cursor` for older transactions.


## Running Locally

Copy `.env.example` to `.env` and optionally add your own RPCs. At least one of the RPCs needs to be archival, so that old historical transactions can be retrieved.


## Maintenance

It's safe to purge the database when it grows too big, but it might cause an initial spike of requests to archival RPC, which might be rate-limited if you're using free ones.
