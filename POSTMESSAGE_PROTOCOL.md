# Intear Wallet – postMessage Integration Protocol

This document explains how a dApp and Intear Wallet communicate when the wallet is opened in a popup window.  All messages are JSON objects exchanged via `window.postMessage` API.

The same JSON payloads are also used when Intear Wallet runs in a desktop / mobile app, but `ready` part is skipped and follows this API:
1. Connect to `wss://logout-bridge-service/api/session/create`
2. Receive a message with newly generated Session ID.
3. Send a message to that WebSocket connection with the request data (`{"type":"...","data":{...}}`, same message as sent using `postMessage`)
4. Open `intear://connect?sessionId={sessionId}`, `intear://sign-message?sessionId={sessionId}`, `intear://send-transactions?sessionId={sessionId}`
5. Wait for wallet response coming from the WebSocket connection.

---

## 1. Transport rules

1. **Handshake** – Every page (`/connect`, `/sign-message`, `/send-transactions`)
   immediately emits a one-off
   ```json
   {"type": "ready"}
   ```
   so the dApp knows the wallet is loaded and listening to requests. After that,
   the dApp can send a request using `postMessage`. This step is skipped when using
   native `intear://` app.
2. **Timing / Nonce** – Requests contain a `nonce` (milliseconds since unix epoch).
   Intear Wallet rejects messages when the nonce is **older than 5 minutes** or in
   the future.
3. **Signature proof** – The dApp proves ownership of its `publicKey` by signing
   `sha256("${nonce}|${payload}")` with its key, so that we know that the app is
   actually the same app that the user has signed in to.

---

## 2. Connect flow (`/connect`)

### 2.1  Request → wallet

`type = "signIn"`
```jsonc
{
  "type": "signIn",
  "data": {
    "publicKey": "ed25519:...", // a random public key owned by the app's frontend. Must be random for every connection session. Used for authenticating subsequent requests, and optionally can be added as a function call key (see below)
    "contractId": "contract.near", // optional contract ID. If present, the app's public key is added as a function call key
    "methodNames": ["storage_deposit", "ft_transfer"], // optional, for the function call key
    "networkId": "mainnet" | "testnet",
    "nonce": 0, // must be a recent timestamp in milliseconds since unix epoch
    "message": "{\"origin\":\"https://dapp.com\"}", // no longer used in V2+ but currently needs to be present
    "signature": "ed25519:...", // of sha256("${nonce}|${message}")
    "version": "v1" | "v2", // defaults to v1 if doesn't exist
    "actualOrigin": "https://dapp.com" // required in v2. If you use wallet-connector-iframe.html, the iframe injects this value. This is the value displayed to the user
  }
}
```

### 2.2  Response ← wallet

Success:
```jsonc
{
  "type": "connected",
  "accounts": [
    {
      "accountId": "connected-user-account.near",
      "publicKey": "ed25519:..." // user's on-chain full access key
    }
  ],
  "functionCallKeyAdded": true | false, // false if not requested or if the user unchecked the checkbox to add a public key
  "logoutKey": "ed25519:...", // public key owned by the wallet that can be used to verify "logged out by user in the wallet" response from logout bridge
  "useBridge": true | false, // `true` when running a native app that requires intear:// + websocket flow
  "walletUrl": "https://wallet.intear.tech" // currently connected wallet origin. Always use this for subsequent requets, since the user might be running on staging.wallet.intear.tech or a self-hosted instance of the wallet, which should be respected
}
```

Failure:
```json
{"type":"error","message":"<reason>"}
```

The popup needs to be closed by the dApp after receiving `connected` or `error` message.

---

## 3. Sign message flow (`/sign-message`)

### 3.1  Request → wallet

`type = "signMessage"`
```jsonc
{
  "type": "signMessage",
  "data": {
    "message": "{\"message\":\"Hello\",\"nonce\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"recipient\":\"app.near\",\"callback_url\":null,\"state\":\"optional string\"}", // NEP-413 payload (stringified JSON). callback_url will be used to serialize the message (matters for signature creation and verification) but won't be used as an actual callback. `state` is not used for signing as specified in NEP-413 standard, it's only passed and returned in the response
    "accountId": "connected-user-account.near",
    "publicKey": "ed25519:...", // app's public key, used for signature verification
    "nonce": 0, // must be a recent timestamp in milliseconds since unix epoch
    "signature": "ed25519:..." // of sha256("${nonce}|${message}")
  }
}
```

### 3.2  Response ← wallet

Success:
```jsonc
{
  "type": "signed",
  "signature": {
    "accountId": "connected-user-account.near",
    "publicKey": "ed25519:...", // on-chain user's full access key
    "signature": "ed25519:...", // signature of the NEP-413 payload. Note that it's keytype-prefixed base58, so if you need to get the NEP-413 standard signature (base64), you need to remove the keytype prefix (remove "ed25519:" or "secp256k1:"), decode the rest using base58, and encode with base64
    "state": "optional string, same as in the request. Not really necessary to use this for popup-based or websocket-based communication, so better to set this as null in the request"
  }
}
```

Failure:
```json
{"type":"error","message":"<reason>"}
```

The popup needs to be closed by the dApp after receiving `signed` or `error` message.

---

## 4. Send transactions flow (`/send-transactions`)

### 4.1  Request → wallet

`type = "signAndSendTransactions"`
```jsonc
{
  "type": "signAndSendTransactions",
  "data": {
    "accountId": "connected-user-account.near",
    "publicKey": "ed25519:...", // app's public key, used for signature verification
    "nonce": 0, // must be a recent timestamp in milliseconds since unix epoch
    "signature": "ed25519:...", // of sha256("${nonce}|${transactions}")
    "transactions": "[ ... ]" // stringified JSON array of transaction objects as in https://github.com/near/wallet-selector/blob/30703fdfccb7138eead12a0a65c6b0dba89429d7/packages/core/src/lib/wallet/transactions.types.ts#L1-L78
  }
}
```

`transactions` is a JSON array where every item matches
[`WalletSelectorTransaction`](./web/src/utils.rs).

### 4.2  Response ← wallet

Success:
```jsonc
{
  "type": "sent",
  "outcomes": [
    { /* FinalExecutionOutcomeViewEnum in Rust, same type as returned by RPC, but possibly different from what typescript libraries provide */ },
    ...
  ]
}
```

Failure:
```json
{"type":"error","message":"<reason>"}
```

The popup needs to be closed by the dApp after receiving `sent` or `error` message.

> Behavior
> 
> The transactions are sent sequentially, one after confirmation of the previous one. If one of them fails, the previous transactions are not reverted (as NEAR doesn't have this functionality), but the next transactions are not sent and the wallet exits early with a `error` message

---

# Example Implementations

1. [Wallet Selector](https://github.com/near/wallet-selector/tree/30703fdfccb7138eead12a0a65c6b0dba89429d7/packages/intear-wallet) adapter for Intear Wallet. Official, maintained by Intear.

2. [fastintear](https://github.com/elliotBraem/fastintear), unofficial.

3. [hot-connector](./web/src/js/near-selector.js) adapter for Intear Wallet. Official, maintained by Intear
