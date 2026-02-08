/**
 * The native wallet URL for Intear Wallet desktop/mobile apps.
 * Use this as the walletUrl option to connect via the native app instead of web popup.
 */
export const INTEAR_NATIVE_WALLET_URL = "intear://";
/**
 * Use a selector iframe to let the user choose which way to connect. This is the
 * preferred way for most dapps, since the user can be using staging or native app,
 * so you don't have to implement the selector yourself.
 * @param walletUrl - Origin of the iframe (where the iframe .html is loaded from).
 * @returns The valid walletUrl parameter that you can use in requestConnection call.
 */
export function iframe(walletUrl = "https://wallet.intear.tech") {
    return `iframe:${walletUrl}`;
}
/**
 * Decodes a base64url string to byte array
 * @param str - The base64 or base64url encoded string
 * @returns The decoded byte array
 */
function base64Decode(str) {
    const binaryString = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binaryString, char => char.charCodeAt(0));
}
/**
 * Encodes a byte array to base64 string
 * @param bytes - The byte array to encode
 * @returns The base64 encoded string
 */
function base64Encode(bytes) {
    return btoa(String.fromCharCode(...bytes));
}
/**
 * Encodes a byte array to base58 string
 * @param bytes - The byte array to encode
 * @returns The base58 encoded string
 */
function base58Encode(bytes) {
    const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let bytesArray;
    if (!(bytes instanceof Uint8Array)) {
        bytesArray = Uint8Array.from(bytes);
    }
    else {
        bytesArray = bytes;
    }
    let zeroCount = 0;
    while (zeroCount < bytesArray.length && bytesArray[zeroCount] === 0) {
        zeroCount++;
    }
    const digits = [];
    for (let i = zeroCount; i < bytesArray.length; i++) {
        let carry = bytesArray[i];
        for (let j = 0; j < digits.length; j++) {
            carry += digits[j] << 8;
            digits[j] = carry % 58;
            carry = (carry / 58) | 0;
        }
        while (carry > 0) {
            digits.push(carry % 58);
            carry = (carry / 58) | 0;
        }
    }
    let result = "";
    for (let i = 0; i < zeroCount; i++) {
        result += ALPHABET[0];
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        result += ALPHABET[digits[i]];
    }
    return result;
}
/**
 * Decodes a base58 string to byte array
 * @param str - The base58 encoded string
 * @returns The decoded byte array
 */
export function base58Decode(str) {
    const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const ALPHABET_MAP = {};
    for (let i = 0; i < ALPHABET.length; i++) {
        ALPHABET_MAP[ALPHABET[i]] = i;
    }
    let zeroCount = 0;
    while (zeroCount < str.length && str[zeroCount] === ALPHABET[0]) {
        zeroCount++;
    }
    const bytes = [];
    for (let i = zeroCount; i < str.length; i++) {
        const char = str[i];
        if (!(char in ALPHABET_MAP)) {
            throw new Error(`Invalid base58 character: ${char}`);
        }
        let carry = ALPHABET_MAP[char];
        for (let j = 0; j < bytes.length; j++) {
            carry += bytes[j] * 58;
            bytes[j] = carry & 0xff;
            carry >>= 8;
        }
        while (carry > 0) {
            bytes.push(carry & 0xff);
            carry >>= 8;
        }
    }
    const result = new Uint8Array(zeroCount + bytes.length);
    for (let i = 0; i < zeroCount; i++) {
        result[i] = 0;
    }
    for (let i = 0; i < bytes.length; i++) {
        result[zeroCount + bytes.length - 1 - i] = bytes[i];
    }
    return result;
}
/**
 * Opens a popup and handles the message flow with the wallet (web popup flow)
 * @param config - Configuration for the popup flow
 * @returns A promise that resolves with the response, or null if user rejected/closed
 * @throws Error if popup fails to open or wallet returns an error
 */
async function openPopupFlow(config) {
    let popup = window.selector.open(`${config.walletUrl}/${config.method}`, "dontcare", 'width=400,height=700,scrollbars=yes,resizable=yes');
    if (await popup.id() === null || popup.closed) {
        await window.selector.ui.whenApprove({ title: `App asks you to ${config.description}`, button: config.button });
        popup = window.selector.open(`${config.walletUrl}/${config.method}`, "dontcare", 'width=400,height=700,scrollbars=yes,resizable=yes');
        if (await popup.id() === null || popup.closed) {
            throw new Error('Popup blocked');
        }
    }
    return new Promise((resolve, reject) => {
        let resultReceived = false;
        const cleanup = () => {
            window.removeEventListener('message', messageHandler);
            if (checkClosed) {
                clearInterval(checkClosed);
            }
        };
        const messageHandler = async (event) => {
            try {
                const data = event.data;
                if (data.type === 'ready') {
                    popup.postMessage({
                        type: config.sendMessageType,
                        data: config.sendData
                    }, config.walletUrl);
                }
                else if (data.type === config.successMessageType && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    popup.close();
                    try {
                        resolve(await config.onSuccess(data));
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                else if (data.type === 'error' && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    popup.close();
                    if (config.isUserRejection?.(data.message)) {
                        resolve(null);
                    }
                    else {
                        reject(new Error(data.message || 'Operation failed'));
                    }
                }
            }
            catch (error) {
                // Ignore JSON parse errors from other messages
            }
        };
        window.addEventListener('message', messageHandler);
        const checkClosed = setInterval(() => {
            if (popup.closed && !resultReceived) {
                cleanup();
                if (!resultReceived) {
                    resolve(null);
                }
            }
        }, 100);
    });
}
/**
 * Handles the native app flow using WebSocket bridge and intear:// URLs
 * @param config - Configuration for the wallet flow
 * @returns A promise that resolves with the response, or null if user rejected/closed
 * @throws Error if WebSocket connection fails or wallet returns an error
 */
async function openNativeAppFlow(config) {
    const bridgeUrl = config.logoutBridgeUrl;
    const wsUrl = `${bridgeUrl}/api/session/create`;
    return new Promise((resolve, reject) => {
        let resultReceived = false;
        let ws = null;
        const cleanup = () => {
            if (ws) {
                ws.close();
                ws = null;
            }
        };
        try {
            ws = new WebSocket(wsUrl);
        }
        catch (error) {
            reject(new Error(`Failed to connect to logout bridge: ${error}`));
            return;
        }
        ws.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.session_id && !resultReceived) {
                    const sessionId = data.session_id;
                    ws.send(JSON.stringify({
                        type: config.sendMessageType,
                        data: config.sendData
                    }));
                    const intearUrl = `${INTEAR_NATIVE_WALLET_URL}${config.method}?session_id=${encodeURIComponent(sessionId)}`;
                    await window.selector.ui.whenApprove({ title: `App asks you to ${config.description}`, button: config.button });
                    const result = await window.selector.openNativeApp(intearUrl);
                }
                else if (data.type === config.successMessageType && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    try {
                        resolve(await config.onSuccess(data));
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                else if (data.type === 'error' && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    if (config.isUserRejection?.(data.message)) {
                        resolve(null);
                    }
                    else {
                        reject(new Error(data.message || 'Operation failed'));
                    }
                }
            }
            catch (error) {
                // Ignore JSON parse errors
            }
        };
        ws.onerror = (error) => {
            if (!resultReceived) {
                cleanup();
                reject(new Error('WebSocket connection error to logout bridge'));
            }
        };
        ws.onclose = () => {
            if (!resultReceived) {
                // Likely timed out without user responding in the app
                resolve(null);
            }
        };
    });
}
/**
 * Opens the wallet flow using either popup (web) or native app (intear://) transport
 * @param config - Configuration for the wallet flow
 * @returns A promise that resolves with the response, or null if user rejected/closed
 * @throws Error if the flow fails
 */
async function openWalletFlow(config) {
    if (config.walletUrl === INTEAR_NATIVE_WALLET_URL) {
        return openNativeAppFlow(config);
    }
    else {
        return openPopupFlow(config);
    }
}
/**
 * ConnectedAccount - A connected Intear Wallet account and its data
 */
class ConnectedAccount {
    accountId;
    disconnected;
    #connector;
    /**
     * @deprecated Don't use this constructor directly, this class should only be instantiated by the connector
     */
    constructor(accountId, connector) {
        this.accountId = accountId;
        this.#connector = connector;
        this.disconnected = false;
    }
    /**
     * Disconnects the account from the connector
     */
    disconnect() {
        this.#connector.disconnect();
    }
    /**
     * Signs a message using NEP-413 standard via wallet popup
     * @param messageToSign - The NEP-413 message payload to sign
     * @returns A promise that resolves with the signed message, or null if user rejected
     * @throws Error if not connected, nonce is not 32 bytes, or signing fails
     */
    async signMessage(messageToSign) {
        if (this.disconnected) {
            throw new Error('Account is disconnected');
        }
        if (messageToSign.nonce.length !== 32) {
            throw new Error('Nonce must be 32 bytes');
        }
        if (!this.#connector.walletUrl || !this.#connector.logoutBridgeUrl) {
            throw new Error('Wallet URL not available');
        }
        const privateKeyJwk = await this.#connector.storage.get(STORAGE_KEY_APP_PRIVATE_KEY);
        if (!privateKeyJwk) {
            throw new Error('Private key not found in storage');
        }
        const privateKey = await crypto.subtle.importKey('jwk', privateKeyJwk, { name: 'Ed25519' }, true, ['sign']);
        const publicKeyBytes = base64Decode(privateKeyJwk.x);
        const publicKeyBase58 = base58Encode(publicKeyBytes);
        const publicKey = `ed25519:${publicKeyBase58}`;
        const nep413Payload = JSON.stringify({
            message: messageToSign.message,
            nonce: Array.from(messageToSign.nonce),
            recipient: messageToSign.recipient,
            callback_url: messageToSign.callbackUrl ?? null,
            state: messageToSign.state ?? null
        });
        const nonce = Date.now();
        const messageToHash = `${nonce}|${nep413Payload}`;
        const hashedMessage = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(messageToHash));
        const signatureBuffer = await crypto.subtle.sign({ name: 'Ed25519' }, privateKey, hashedMessage);
        const signatureBytes = new Uint8Array(signatureBuffer);
        const signatureBase58 = base58Encode(signatureBytes);
        const signature = `ed25519:${signatureBase58}`;
        const signMessageData = {
            message: nep413Payload,
            accountId: this.accountId,
            publicKey,
            nonce,
            signature
        };
        const walletUrl = this.#connector.walletUrl;
        const logoutBridgeUrl = this.#connector.logoutBridgeUrl;
        return openWalletFlow({
            method: 'sign-message',
            walletUrl,
            logoutBridgeUrl,
            sendMessageType: 'signMessage',
            sendData: signMessageData,
            successMessageType: 'signed',
            onSuccess: async (data) => {
                return {
                    accountId: data.signature.accountId,
                    publicKey: data.signature.publicKey,
                    signature: data.signature.signature,
                    state: data.signature.state
                };
            },
            isUserRejection: (msg) => msg === "User rejected the signature",
            description: "sign a message",
            button: "Open Wallet"
        });
    }
    /**
     * Sends transactions to be signed and executed via wallet popup
     * @param transactions - Array of transactions to send. Each transaction specifies signerId, receiverId, and actions.
     * @returns A promise that resolves with the execution outcomes (or signed delegate actions if onlySignDelegate is true), or null if user rejected
     * @throws Error if not connected or sending fails
     */
    async sendTransactions(transactions, onlySignDelegate = false) {
        if (this.disconnected) {
            throw new Error('Account is disconnected');
        }
        if (!this.#connector.walletUrl || !this.#connector.logoutBridgeUrl) {
            throw new Error('Wallet URL not available');
        }
        const privateKeyJwk = await this.#connector.storage.get(STORAGE_KEY_APP_PRIVATE_KEY);
        if (!privateKeyJwk) {
            throw new Error('Private key not found in storage');
        }
        const privateKey = await crypto.subtle.importKey('jwk', privateKeyJwk, { name: 'Ed25519' }, true, ['sign']);
        const publicKeyBytes = base64Decode(privateKeyJwk.x);
        const publicKeyBase58 = base58Encode(publicKeyBytes);
        const publicKey = `ed25519:${publicKeyBase58}`;
        const serializableTransactions = transactions.map(tx => ({
            signerId: tx.signerId,
            receiverId: tx.receiverId,
            actions: tx.actions,
        }));
        const transactionsJson = JSON.stringify(serializableTransactions);
        const nonce = Date.now();
        const messageToHash = `${nonce}|${transactionsJson}`;
        const hashedMessage = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(messageToHash));
        const signatureBuffer = await crypto.subtle.sign({ name: 'Ed25519' }, privateKey, hashedMessage);
        const signatureBytes = new Uint8Array(signatureBuffer);
        const signatureBase58 = base58Encode(signatureBytes);
        const signature = `ed25519:${signatureBase58}`;
        const sendTransactionsData = {
            accountId: this.accountId,
            publicKey,
            nonce,
            signature,
            transactions: transactionsJson,
            mode: onlySignDelegate ? 'SignDelegateActions' : 'Send'
        };
        const walletUrl = this.#connector.walletUrl;
        const logoutBridgeUrl = this.#connector.logoutBridgeUrl;
        return openWalletFlow({
            method: 'send-transactions',
            walletUrl,
            logoutBridgeUrl,
            sendMessageType: 'signAndSendTransactions',
            sendData: sendTransactionsData,
            successMessageType: 'sent',
            onSuccess: async (data) => {
                if (data.outcomes) {
                    return {
                        outcomes: data.outcomes
                    };
                }
                if (data.signedDelegateActions) {
                    return {
                        signedDelegateActions: data.signedDelegateActions
                    };
                }
                throw new Error('No outcomes or signedDelegateActions returned from wallet, this should never happen, a bug on wallet side');
            },
            isUserRejection: (msg) => msg === "User rejected the transactions",
            description: "send a transaction",
            button: "Open Wallet"
        });
    }
}
const STORAGE_KEY_ACCOUNT_ID = 'accountId';
const STORAGE_KEY_APP_PRIVATE_KEY = 'appPrivateKey';
const STORAGE_KEY_WALLET_URL = 'walletUrl';
const STORAGE_KEY_LOGOUT_BRIDGE_URL = 'logoutBridgeUrl';
/**
 * IntearWalletConnector - A lightweight connector for Intear Wallet
 */
export class IntearWalletConnector {
    #connectedAccount;
    walletUrl;
    logoutBridgeUrl;
    storage;
    /**
     * Creates a new IntearWalletConnector instance
     * @param storage - The storage to load the connected account from
     * @returns A promise that resolves with the IntearWalletConnector instance
     */
    static async loadFrom(storage) {
        if (!storage) {
            throw new Error('loadFrom: Invalid arguments');
        }
        const accountId = await storage.get(STORAGE_KEY_ACCOUNT_ID);
        const walletUrl = await storage.get(STORAGE_KEY_WALLET_URL);
        const logoutBridgeUrl = await storage.get(STORAGE_KEY_LOGOUT_BRIDGE_URL);
        const connector = new IntearWalletConnector(storage, null, walletUrl, logoutBridgeUrl);
        const connectedAccount = accountId ? new ConnectedAccount(accountId, connector) : null;
        connector.#connectedAccount = connectedAccount;
        return connector;
    }
    constructor(storage, connectedAccount, walletUrl, logoutBridgeUrl) {
        this.storage = storage;
        this.#connectedAccount = connectedAccount;
        this.walletUrl = walletUrl;
        this.logoutBridgeUrl = logoutBridgeUrl;
    }
    /**
     * Gets the currently connected account
     * @returns The connected account object or null if not connected
     */
    get connectedAccount() {
        return this.#connectedAccount;
    }
    /**
     * Requests a connection to the Intear Wallet
     * @param options - Connection options including networkId, walletUrl, and optional messageToSign
     * @returns A promise that resolves with the connection result, or null if user has rejected the connection
     * @throws Error If the failed to open the wallet popup or already connected
     */
    async requestConnection(options = {}) {
        if (this.#connectedAccount !== null) {
            throw new Error('Already connected');
        }
        const { networkId = 'mainnet', walletUrl = 'iframe:https://wallet.intear.tech', logoutBridgeUrl = "wss://logout-bridge-service.intear.tech", messageToSign: nep413MessageToSign, relayerId = null, } = options;
        if (nep413MessageToSign && nep413MessageToSign.nonce.length !== 32) {
            throw new Error('Nonce must be 32 bytes');
        }
        const keyPair = await crypto.subtle.generateKey({
            name: 'Ed25519'
        }, true, // extractable
            ['sign']);
        const publicKeyRaw = await crypto.subtle.exportKey('raw', keyPair.publicKey);
        const publicKeyBytes = new Uint8Array(publicKeyRaw);
        const publicKeyBase58 = base58Encode(publicKeyBytes);
        const publicKey = `ed25519:${publicKeyBase58}`;
        let messagePayload;
        if (nep413MessageToSign) {
            const nep413Payload = JSON.stringify({
                message: nep413MessageToSign.message,
                nonce: Array.from(nep413MessageToSign.nonce),
                recipient: nep413MessageToSign.recipient,
                callback_url: nep413MessageToSign.callbackUrl ?? null,
                state: nep413MessageToSign.state ?? null
            });
            messagePayload = { messageToSign: nep413Payload };
        }
        else {
            messagePayload = {};
        }
        const message = JSON.stringify(messagePayload);
        const nonce = Date.now();
        const messageToHash = `${nonce}|${message}`;
        const hashedMessage = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(messageToHash));
        const signatureBuffer = await crypto.subtle.sign({
            name: 'Ed25519'
        }, keyPair.privateKey, hashedMessage);
        const signatureBytes = new Uint8Array(signatureBuffer);
        const signatureBase58 = base58Encode(signatureBytes);
        const signature = `ed25519:${signatureBase58}`;
        if (walletUrl.startsWith("iframe:")) {
            const hotConnectorOrigin = new Promise((resolve) => {
                let origin = null;
                const interval = setInterval(() => {
                    if (origin) {
                        clearInterval(interval);
                        resolve(origin);
                    }
                }, 100);
                const listener = (event) => {
                    // Could be a wrong origin, but there's no way to know if it's the right one
                    if (event.data.origin) {
                        origin = event.data.origin;
                        window.removeEventListener("message", listener);
                    }
                };
                window.addEventListener("message", listener);
            });
            const iframeOriginUrl = walletUrl.substring("iframe:".length);
            const iframe = document.createElement("iframe");
            iframe.src = `${iframeOriginUrl}/hot-wallet-connector-iframe.html`; // for hot connector
            iframe.style.position = "fixed";
            iframe.style.inset = "0";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.border = "none";
            iframe.style.zIndex = "100000";
            // for hot connector
            iframe.onload = () => {
                window.selector.ui.showIframe();
                hotConnectorOrigin.then((origin) => {
                    iframe.contentWindow?.postMessage(
                        {
                            type: "hotConnectorData",
                            origin,
                            location: window.selector.location,
                        },
                        "*"
                    );
                });
            };
            document.body.appendChild(iframe);
            return new Promise((resolve, reject) => {
                let response = {};
                const listener = async (event) => {
                    if (event.data.status) {
                        // Probably a hot connector result
                        iframe.contentWindow?.postMessage(
                            event.data,
                            "*"
                        );
                        return;
                    }
                    switch (event.data.type) {
                        case "ready":
                            const signInData = {
                                publicKey,
                                networkId,
                                nonce,
                                message,
                                signature,
                                version: 'V3',
                                relayerId,
                            };
                            iframe.contentWindow?.postMessage({
                                type: "signIn",
                                data: signInData,
                            }, "*");
                            break;
                        case "connected":
                            const accountId = event.data.accountId;
                            const responseWalletUrl = walletUrl === event.data.useBridge ? INTEAR_NATIVE_WALLET_URL : event.data.walletUrl;
                            this.walletUrl = responseWalletUrl;
                            this.logoutBridgeUrl = logoutBridgeUrl;
                            const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
                            response = {
                                privateKeyJwk: privateKeyJwk,
                                walletUrl: responseWalletUrl,
                                logoutBridgeUrl: logoutBridgeUrl,
                                accountId: accountId,
                                signedMessage: event.data.signedMessage,
                            };
                            iframe.contentWindow?.postMessage({
                                type: "close",
                            }, "*");
                            break;
                        case "error":
                            iframe.contentWindow?.postMessage({
                                type: "close",
                                message: event.data.message,
                            }, "*");
                            break;
                        case "close":
                            console.log("Closing with", response);
                            iframe.remove();
                            window.removeEventListener("message", listener);
                            if (event.data.message) {
                                if (event.data.message == "User closed the modal" || event.data.message == "User rejected the connection") {
                                    resolve(null);
                                }
                                else {
                                    reject(new Error(event.data.message));
                                }
                            } else {
                                this.#connectedAccount = new ConnectedAccount(response.accountId, this);
                                await this.storage.set(STORAGE_KEY_APP_PRIVATE_KEY, response.privateKeyJwk);
                                await this.storage.set(STORAGE_KEY_WALLET_URL, response.walletUrl);
                                await this.storage.set(STORAGE_KEY_LOGOUT_BRIDGE_URL, response.logoutBridgeUrl);
                                await this.storage.set(STORAGE_KEY_ACCOUNT_ID, response.accountId);
                                const result = { account: this.#connectedAccount };
                                if (nep413MessageToSign) {
                                    if (!event.data.signedMessage) {
                                        throw new Error('No signed message returned from wallet, this should never happen, a bug on wallet side');
                                    }
                                    result.signedMessage = {
                                        accountId: response.signedMessage.accountId,
                                        publicKey: response.signedMessage.publicKey,
                                        signature: response.signedMessage.signature,
                                        state: response.signedMessage.state
                                    };
                                }
                                resolve(result);
                            }
                            break;
                    }
                };
                window.addEventListener("message", listener);
            });
        }
        else {
            return openWalletFlow({
                method: 'connect',
                walletUrl,
                logoutBridgeUrl,
                sendMessageType: 'signIn',
                sendData: signInData,
                successMessageType: 'connected',
                onSuccess: async (data) => {
                    const accountId = data.accountId;
                    this.#connectedAccount = new ConnectedAccount(accountId, this);
                    const responseWalletUrl = walletUrl === data.useBridge ? INTEAR_NATIVE_WALLET_URL : data.walletUrl;
                    this.walletUrl = responseWalletUrl;
                    this.logoutBridgeUrl = logoutBridgeUrl;
                    const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
                    await this.storage.set(STORAGE_KEY_APP_PRIVATE_KEY, privateKeyJwk);
                    await this.storage.set(STORAGE_KEY_WALLET_URL, responseWalletUrl);
                    await this.storage.set(STORAGE_KEY_LOGOUT_BRIDGE_URL, logoutBridgeUrl);
                    await this.storage.set(STORAGE_KEY_ACCOUNT_ID, accountId);
                    const result = { account: this.#connectedAccount };
                    if (nep413MessageToSign) {
                        if (!data.signedMessage) {
                            throw new Error('No signed message returned from wallet, this should never happen, a bug on wallet side');
                        }
                        result.signedMessage = {
                            accountId: data.signedMessage.accountId,
                            publicKey: data.signedMessage.publicKey,
                            signature: data.signedMessage.signature,
                            state: data.signedMessage.state
                        };
                    }
                    return result;
                },
                isUserRejection: (msg) => msg === "User rejected the connection",
                description: "sign in with Intear Wallet",
                button: "Open Wallet"
            });
        }
    }
    /**
     * Disconnects from the Intear Wallet
     * @throws Error If the account is not connected
     */
    async disconnect() {
        if (this.#connectedAccount !== null) {
            this.#connectedAccount.disconnected = true;
            this.#connectedAccount = null;
            this.walletUrl = undefined;
            this.logoutBridgeUrl = undefined;
            await this.storage.remove(STORAGE_KEY_ACCOUNT_ID);
            await this.storage.remove(STORAGE_KEY_APP_PRIVATE_KEY);
            await this.storage.remove(STORAGE_KEY_WALLET_URL);
            await this.storage.remove(STORAGE_KEY_LOGOUT_BRIDGE_URL);
        }
        else {
            throw new Error('Account is not connected');
        }
    }
}
/**
 * InMemoryStorage - An in-memory storage implementation that is not persisted
 */
export class InMemoryStorage {
    data;
    /**
     * Creates a new, empty InMemoryStorage instance
     */
    constructor() {
        this.data = new Map();
    }
    /**
     * Gets the data stored in the storage
     * @returns The data stored in the storage
     */
    getData() {
        return this.data;
    }
    /**
     * Clones the storage
     * @returns A new InMemoryStorage instance with the same data. Modifying
     * the clone will not affect the original storage, and vice versa.
     */
    clone() {
        const clone = new InMemoryStorage();
        clone.data = new Map(this.data);
        return clone;
    }
    async get(key) {
        const value = this.data.get(key);
        return value !== undefined ? value : null;
    }
    async set(key, value) {
        const previousValue = await this.get(key);
        this.data.set(key, value);
        return previousValue;
    }
    async remove(key) {
        const previousValue = await this.get(key);
        this.data.delete(key);
        return previousValue;
    }
}
/**
 * LocalStorageStorage - A localStorage-backed storage implementation
 */
export class LocalStorageStorage {
    prefix;
    storage;
    /**
     * Creates a new LocalStorageStorage instance
     * @param prefix - The prefix to apply to all keys
     * @param storage - The storage to use for storing the data. You can pass
     * your own localStorage-compatible object, like sessionStorage.
     * @throws Error If localStorage is not available
     */
    constructor(prefix, storage = window.localStorage) {
        this.prefix = prefix;
        this.storage = storage;
    }
    /**
     * Prefixes the key and returns the key that corresponds to localStorage
     */
    _getPrefixedKey(key) {
        return this.prefix + key;
    }
    async get(key) {
        const prefixedKey = this._getPrefixedKey(key);
        const item = this.storage.getItem(prefixedKey);
        return item === null ? null : JSON.parse(item);
    }
    async set(key, value) {
        const previousValue = await this.get(key);
        const prefixedKey = this._getPrefixedKey(key);
        this.storage.setItem(prefixedKey, JSON.stringify(value));
        return previousValue;
    }
    async remove(key) {
        const previousValue = await this.get(key);
        const prefixedKey = this._getPrefixedKey(key);
        this.storage.removeItem(prefixedKey);
        return previousValue;
    }
}
export default IntearWalletConnector;
