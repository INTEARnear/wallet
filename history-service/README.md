# History Service

API for a wallet that uses [intear-events](https://github.com/INTEARnear/intear-events) to get lists of recent transactions with the user as signer / receiver, fetches transaction data from normal / archival RPC, and uses [RocksDB](https://rocksdb.org) to cache transaction responses.


## Running Locally

Copy `.env.example` to `.env` and optionally add your own RPCs. At least one of the RPCs needs to be archival, so that old historical transactions can be retrieved.


## Maintenance

It's safe to purge the database when it grows too big, but it might cause an initial spike of requests to archival RPC, which might be rate-limited if you're using free ones.
