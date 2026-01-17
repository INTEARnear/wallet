# Account Creation Service

API that sponsors account creation. Accepts .near account name, public key to add to that account, and creates an account with that public key for the user, sponsoring gas costs for the transaction.

The service can make use of multiple private keys on one account to make multiple transaction simultaneously in case you have a lot of users creating accounts at the same time. It waits for full finality before returning a HTTP response, which can be tweaked to return on doomslug or any other finality.

## Configuration

The service supports multiple relayers, each with its own configuration. Relayers are configured via a JSON file (default: `relayers.json`).

### Relayers Configuration File

Copy `relayers.example.json` to `relayers.json` and configure your relayers. Each relayer has:

- `relayer_id`: The NEAR account ID of the relayer
- `relayer_private_keys`: Array of private keys for parallel transaction processing
- `rpc_urls`: Array of RPC endpoints
- `finality`: Transaction finality level (`NONE`, `INCLUDED`, `EXECUTED_OPTIMISTIC`, `INCLUDED_FINAL`, `EXECUTED`, or `FINAL`), default is `EXECUTED_OPTIMISTIC`
- `factory`: Optional factory contract for account creation
- `create_account_deposit`: Optional amount to deposit when creating accounts (e.g., `"0.05 NEAR"`)
- `intear_dex`: Optional Intear DEX contract for swap-for-gas functionality
- `slimedrop`: Optional Slimedrop contract for gift claims
- `enabled`: Whether the relayer is enabled
- `max_accounts_created_per_day`: Optional limit on the number of accounts that can be created in a 24-hour rolling window

### Request Headers

All API requests must include the `x-relayer-id` header specifying which relayer to use. The value should match a key in your `relayers.json` configuration.

Example:
```
x-relayer-id: mainnet-relayer
```

If the header is missing or references a non-existent relayer, the request will be rejected with an error.

### Environment Variables

- `RELAYERS_CONFIG_PATH`: Path to the relayers configuration file (default: `relayers.json`)
- `ACCOUNT_CREATION_SERVICE_BIND`: Address to bind the server (default: `127.0.0.1:3002`)
- `REMOTE_CONFIGURATION_AUTH_TOKEN`: Authentication token required for configuration management endpoints. Must be set to use the configuration API.

## Running Locally

1. Copy `relayers.example.json` to `relayers.json`
2. Update the configuration with your relayer accounts and private keys
3. Run `cargo run`

## API Endpoints

All public endpoints require the `x-relayer-id` header.

- `GET /get-root` - Get the root account ID for the relayer
- `POST /create` - Create a new account
- `POST /recover` - Recover an account using Ethereum/Solana signature
- `POST /relay-signed-delegate-action` - Relay a signed delegate action
- `POST /swap-for-gas` - Generate swap-for-gas authorized trade intent

## Maintenance

Unless you have thousands of users, you don't need to worry about that, but you need to check the relayer account balance to make sure it doesn't run out of NEAR.

In the future, we'll need to add captcha to prevent abuse.
