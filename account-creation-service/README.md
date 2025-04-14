# Account Creation Service

API that sponsors account creation. Accepts .near account name, public key to add to that account, and creates an account with that public key for the user, sponsoring gas costs for the transaction.

The service can make use of multiple private keys on one account to make multiple transaction simultaneously in case you have a lot of users creating accounts at the same time. It waits for full finality before returning a HTTP response, which can be tweaked to return on doomslug or any other finality.


## Running Locally

Copy `.env.example` to `.env`, enter your relayer account ID and private keys, and `cargo run`.


## Maintenance

Unless you have thousands of users, you don't need to worry about that, but you need to check the relayer account balance to make sure it doesn't run out of NEAR.

In the future, we'll need to add captcha to prevent abuse.
