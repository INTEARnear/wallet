/**
 * The native wallet URL for Intear Wallet desktop/mobile apps.
 * Use this as the walletUrl option to connect via the native app instead of web popup.
 */
export const INTEAR_NATIVE_WALLET_URL = "intear://" as const;

declare const __NEARCONNECT__: boolean;

/**
 * Use a selector iframe to let the user choose which way to connect. This is the
 * preferred way for most dapps, since the user can be using staging or native app,
 * so you don"t have to implement the selector yourself.
 * @param walletUrl - Origin of the iframe (where the iframe .html is loaded from).
 * @returns The valid walletUrl parameter that you can use in requestConnection call.
 */
export function iframe(walletUrl: string = "https://wallet.intear.tech"): string {
    return `iframe:${walletUrl}`;
}

/**
 * Decodes a base64url string to byte array
 * @param str - The base64 or base64url encoded string
 * @returns The decoded byte array
 */
export function base64Decode(str: string): Uint8Array {
    const binaryString = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(binaryString, char => char.charCodeAt(0));
}

/**
 * Encodes a byte array to base64 string
 * @param bytes - The byte array to encode
 * @returns The base64 encoded string
 */
export function base64Encode(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
}

/**
 * Encodes a byte array to base58 string
 * @param bytes - The byte array to encode
 * @returns The base58 encoded string
 */
export function base58Encode(bytes: Uint8Array | Iterable<number>): string {
    const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

    let bytesArray: Uint8Array;
    if (!(bytes instanceof Uint8Array)) {
        bytesArray = Uint8Array.from(bytes);
    } else {
        bytesArray = bytes;
    }

    let zeroCount = 0;
    while (zeroCount < bytesArray.length && bytesArray[zeroCount] === 0) {
        zeroCount++;
    }

    const digits: number[] = [];
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
export function base58Decode(str: string): Uint8Array {
    const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const ALPHABET_MAP: { [key: string]: number } = {};
    for (let i = 0; i < ALPHABET.length; i++) {
        ALPHABET_MAP[ALPHABET[i]] = i;
    }

    let zeroCount = 0;
    while (zeroCount < str.length && str[zeroCount] === ALPHABET[0]) {
        zeroCount++;
    }

    const bytes: number[] = [];
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
 * Configuration for wallet flow (popup or native app)
 */
interface WalletFlowConfig<TResponse> {
    /** Method to call on the wallet, which is used as either wallet.intear.tech/<method> or intear://<method>?session_id=<session_id> */
    method: string;
    /** Wallet base URL */
    walletUrl: typeof INTEAR_NATIVE_WALLET_URL | string;
    /** Logout bridge WebSocket URL for native app communication */
    logoutBridgeUrl: string;
    /** Message type to send when popup is ready */
    sendMessageType: string;
    /** Data to send to the popup */
    sendData: any;
    /** Message type indicating success */
    successMessageType: string;
    /** Transform successful response data (can be async) */
    onSuccess: (data: any) => Promise<TResponse>;
    /** Optional: handle user rejection errors, return value to resolve with */
    isUserRejection?: (errorMessage: string) => boolean;
    /** Description of the action to be displayed if an action requires user interaction context */
    description: string;
    /** Button text to be displayed if an action requires user interaction context */
    button: string;
}

/**
 * Opens a popup and handles the message flow with the wallet (web popup flow)
 * @param config - Configuration for the popup flow
 * @returns A promise that resolves with the response, or null if user rejected/closed
 * @throws Error if popup fails to open or wallet returns an error
 */
async function openPopupFlow<TResponse>(config: WalletFlowConfig<TResponse>): Promise<TResponse | null> {
    let popup: Window | null = null;

    if (__NEARCONNECT__) {
        // @ts-ignore
        popup = window.selector.open(
            `${config.walletUrl}/${config.method}`,
            "dontcare",
            "width=400,height=700,scrollbars=yes,resizable=yes"
        );

        // @ts-ignore
        if (await popup.id() === null || popup.closed) {
            // @ts-ignore
            await window.selector.ui.whenApprove({
                title: `App asks you to ${config.description}`,
                button: config.button
            });
            // @ts-ignore
            popup = window.selector.open(
                `${config.walletUrl}/${config.method}`,
                "dontcare",
                "width=400,height=700,scrollbars=yes,resizable=yes"
            );
            // @ts-ignore
            if (await popup.id() === null || popup.closed) {
                throw new Error("Popup blocked");
            }
        }
    } else {
        popup = window.open(
            `${config.walletUrl}/${config.method}`,
            "_blank",
            "width=400,height=700,scrollbars=yes,resizable=yes"
        );
    }

    if (!popup) {
        throw new Error("Failed to open wallet popup.");
    }

    return new Promise<TResponse | null>((resolve, reject) => {
        let resultReceived = false;

        const cleanup = () => {
            window.removeEventListener("message", messageHandler);
            if (checkClosed) {
                clearInterval(checkClosed);
            }
        };

        const messageHandler = async (event: MessageEvent) => {
            if (!__NEARCONNECT__ && event.origin !== config.walletUrl) {
                return;
            }

            try {
                const data = event.data;

                if (data.type === "ready") {
                    popup.postMessage(
                        {
                            type: config.sendMessageType,
                            data: config.sendData
                        },
                        config.walletUrl
                    );
                } else if (data.type === config.successMessageType && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    popup.close();
                    try {
                        resolve(await config.onSuccess(data));
                    } catch (err) {
                        reject(err);
                    }
                } else if (data.type === "error" && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    popup.close();
                    if (config.isUserRejection?.(data.message)) {
                        resolve(null);
                    } else {
                        reject(new Error(data.message || "Operation failed"));
                    }
                }
            } catch (error) {
                // Ignore JSON parse errors from other messages
            }
        };

        window.addEventListener("message", messageHandler);

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
async function openNativeAppFlow<TResponse>(config: WalletFlowConfig<TResponse>): Promise<TResponse | null> {
    const bridgeUrl = config.logoutBridgeUrl;
    const wsUrl = `${bridgeUrl}/api/session/create`;

    return new Promise<TResponse | null>((resolve, reject) => {
        let resultReceived = false;
        let ws: WebSocket | null = null;

        const cleanup = () => {
            if (ws) {
                ws.close();
                ws = null;
            }
        };

        try {
            ws = new WebSocket(wsUrl);
        } catch (error) {
            reject(new Error(`Failed to connect to logout bridge: ${error}`));
            return;
        }

        ws.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.session_id && !resultReceived) {
                    const sessionId = data.session_id;

                    ws!.send(JSON.stringify({
                        type: config.sendMessageType,
                        data: config.sendData
                    }));

                    const intearUrl = `${INTEAR_NATIVE_WALLET_URL}${config.method}?session_id=${encodeURIComponent(sessionId)}`;
                    if (__NEARCONNECT__) {
                        // @ts-ignore
                        await window.selector.ui.whenApprove({
                            title: `App asks you to ${config.description}`,
                            button: config.button
                        });
                        // @ts-ignore
                        const result = await window.selector.openNativeApp(intearUrl);
                    } else {
                        const iframe = document.createElement("iframe");
                        iframe.style.display = "none";
                        iframe.src = intearUrl;
                        document.body.appendChild(iframe);
                        setTimeout(() => iframe.remove(), 1000);
                    }
                } else if (data.type === config.successMessageType && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    try {
                        resolve(await config.onSuccess(data));
                    } catch (err) {
                        reject(err);
                    }
                } else if (data.type === "error" && !resultReceived) {
                    resultReceived = true;
                    cleanup();
                    if (config.isUserRejection?.(data.message)) {
                        resolve(null);
                    } else {
                        reject(new Error(data.message || "Operation failed"));
                    }
                }
            } catch (error) {
                // Ignore JSON parse errors
            }
        };

        ws.onerror = (error) => {
            if (!resultReceived) {
                cleanup();
                reject(new Error("WebSocket connection error to logout bridge"));
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
async function openWalletFlow<TResponse>(config: WalletFlowConfig<TResponse>): Promise<TResponse | null> {
    if (config.walletUrl === INTEAR_NATIVE_WALLET_URL) {
        return openNativeAppFlow(config);
    } else {
        return openPopupFlow(config);
    }
}

/**
 * Storage - A storage interface that is used by the connector to store its internal data
 */
export interface Storage {
    /**
     * Gets the data stored in the storage
     * @param key - The key to get the data for
     * @returns The data stored in the storage
     */
    get(key: string): Promise<any | null>;
    /**
     * Sets the data in the storage
     * @param key - The key to set the data for
     * @param value - The data to set
     * @returns The previous value stored in the storage, or null if
     * there was no previous value with this key
     */
    set(key: string, value: any): Promise<any | null>;
    /**
     * Removes the data from the storage
     * @param key - The key to remove the data for
     * @returns The previous value stored in the storage, or null if
     * there was no value stored with this key
     */
    remove(key: string): Promise<any | null>;
}

/**
 * NEP-413 message payload for signing
 */
export interface Nep413Payload {
    /**
     * The message to sign, usually a human-readable string that is displayed in the wallet,
     * or sometimes a JSON representation of Near Intents, that has a special handling for
     * displaying intents in the wallet.
     */
    message: string;
    /**
     * The nonce of the message, 32 bytes
     */
    nonce: Uint8Array;
    /**
     * The recipient of the message, usually account ID of a smart contract or a web app domain
     */
    recipient: string;
    /**
     * Ignored by the wallet, but required by NEP-413
     */
    callbackUrl?: string | null;
    /**
     * State that will be returned in the signed message payload. Useless (you can just
     * create a variable and use it after `await`ing the promise), but required by NEP-413
     */
    state?: string | null;
}

/**
 * Signed message response from the wallet, as per NEP-413
 */
export interface SignedMessage {
    /**
     * The account ID that signed the message. Guaranteed to be the same as the connected account
     */
    accountId: string;
    /**
     * The public key that was used to sign the message.
     */
    publicKey: string;
    /**
     * Base64 encoded signature of the message.
     */
    signature: string;
    /**
     * Same as in Nep413Payload.state
     */
    state?: string | null;
}

/**
 * Result of sending transactions to the wallet.
 * Contains the execution outcomes for each transaction.
 */
export interface SendTransactionsResult {
    /**
     * Array of execution outcomes for each transaction, in the same order as the transactions were sent.
     * Each outcome is the FinalExecutionOutcomeViewEnum as returned by NEAR RPC.
     */
    outcomes: object[];
}

/**
 * Options for requesting a connection to the Intear Wallet
 */
export interface ConnectionOptions {
    /**
     * The network ID to connect to (defaults to "mainnet")
     */
    networkId?: string;
    /**
     * The URL of the wallet to connect to (defaults to "https://wallet.intear.tech").
     * Use INTEAR_NATIVE_WALLET_URL ("intear://") to connect via the native desktop/mobile app.
     */
    walletUrl?: typeof INTEAR_NATIVE_WALLET_URL | string;
    /**
     * The logout bridge WebSocket URL for native app communication.
     * Only used when walletUrl is INTEAR_NATIVE_WALLET_URL.
     * Defaults to "wss://logout-bridge-service.intear.tech".
     */
    logoutBridgeUrl?: string;
    /**
     * Optional NEP-413 message to sign during connection
     */
    messageToSign?: Nep413Payload;
    /**
     * The relayer ID to use for new account onboarding, which allows users to create
     * branded subaccounts, like user123.intears.near. You can get your relayer ID on
     * https://rainy.intea.rs
     */
    relayerId?: string;
    /**
     * Request adding a function call key when connecting to the account.
     */
    functionCallKey?: {
        /**
         * The public key to add, in ed25519:... format
         */
        publicKey: string;
        /**
         * The contract ID that the function call key can all.
         */
        contractId: string;
        /**
         * The method names that the function call key can call.
         */
        methodNames: "any" | [string, ...string[]];
        /**
         * The gas allowance for the function call key, in yoctoNEAR. Default is 0.25 NEAR.
         */
        gasAllowance?: "unlimited" | string;
    }
}

/**
 * Result of a successful connection to the Intear Wallet
 */
export interface ConnectionResult {
    /**
     * The connected account
     */
    account: ConnectedAccount;
    /**
     * The signed message, if messageToSign was provided in ConnectionOptions
     */
    signedMessage?: SignedMessage;
}

/**
 * ConnectedAccount - A connected Intear Wallet account and its data
 */
class ConnectedAccount {
    accountId: string;
    disconnected: boolean;
    #connector: IntearWalletConnector;

    /**
     * @deprecated Don"t use this constructor directly, this class should only be instantiated by the connector
     */
    constructor(accountId: string, connector: IntearWalletConnector) {
        this.accountId = accountId;
        this.#connector = connector;
        this.disconnected = false;
    }

    /**
     * Disconnects the account from the connector
     */
    disconnect(): void {
        this.#connector.disconnect();
    }

    /**
     * Signs a message using NEP-413 standard via wallet popup
     * @param messageToSign - The NEP-413 message payload to sign
     * @returns A promise that resolves with the signed message, or null if user rejected
     * @throws Error if not connected, nonce is not 32 bytes, or signing fails
     */
    async signMessage(messageToSign: Nep413Payload): Promise<SignedMessage | null> {
        if (this.disconnected) {
            throw new Error("Account is disconnected");
        }
        if (messageToSign.nonce.length !== 32) {
            throw new Error("Nonce must be 32 bytes");
        }

        if (!this.#connector.walletUrl || !this.#connector.logoutBridgeUrl) {
            throw new Error("Wallet URL not available");
        }

        const privateKeyJwk = await this.#connector.storage.get(STORAGE_KEY_APP_PRIVATE_KEY);
        if (!privateKeyJwk) {
            throw new Error("Private key not found in storage");
        }

        const privateKey = await crypto.subtle.importKey(
            "jwk",
            privateKeyJwk,
            { name: "Ed25519" },
            true,
            ["sign"]
        );
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
        const hashedMessage = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(messageToHash));

        const signatureBuffer = await crypto.subtle.sign(
            { name: "Ed25519" },
            privateKey,
            hashedMessage
        );

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

        return openWalletFlow<SignedMessage>({
            method: "sign-message",
            walletUrl,
            logoutBridgeUrl,
            sendMessageType: "signMessage",
            sendData: signMessageData,
            successMessageType: "signed",
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
    async sendTransactions(transactions: Transaction[], onlySignDelegate: boolean = false): Promise<SendTransactionsResult | SignDelegateActionsResult | null> {
        if (this.disconnected) {
            throw new Error("Account is disconnected");
        }

        if (!this.#connector.walletUrl || !this.#connector.logoutBridgeUrl) {
            throw new Error("Wallet URL not available");
        }

        const privateKeyJwk = await this.#connector.storage.get(STORAGE_KEY_APP_PRIVATE_KEY);
        if (!privateKeyJwk) {
            throw new Error("Private key not found in storage");
        }

        const privateKey = await crypto.subtle.importKey(
            "jwk",
            privateKeyJwk,
            { name: "Ed25519" },
            true,
            ["sign"]
        );
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
        const hashedMessage = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(messageToHash));

        const signatureBuffer = await crypto.subtle.sign(
            { name: "Ed25519" },
            privateKey,
            hashedMessage
        );

        const signatureBytes = new Uint8Array(signatureBuffer);
        const signatureBase58 = base58Encode(signatureBytes);
        const signature = `ed25519:${signatureBase58}`;

        const sendTransactionsData = {
            accountId: this.accountId,
            publicKey,
            nonce,
            signature,
            transactions: transactionsJson,
            mode: onlySignDelegate ? "SignDelegateActions" : "Send"
        };

        const walletUrl = this.#connector.walletUrl;
        const logoutBridgeUrl = this.#connector.logoutBridgeUrl;

        return openWalletFlow<SendTransactionsResult | SignDelegateActionsResult>({
            method: "send-transactions",
            walletUrl,
            logoutBridgeUrl,
            sendMessageType: "signAndSendTransactions",
            sendData: sendTransactionsData,
            successMessageType: "sent",
            onSuccess: async (data) => {
                if (data.outcomes) {
                    return {
                        outcomes: data.outcomes
                    } as SendTransactionsResult;
                }
                if (data.signedDelegateActions) {
                    return {
                        signedDelegateActions: data.signedDelegateActions
                    } as SignDelegateActionsResult;
                }
                throw new Error("No outcomes or signedDelegateActions returned from wallet, this should never happen, a bug on wallet side");
            },
            isUserRejection: (msg) => msg === "User rejected the transactions",
            description: "send a transaction",
            button: "Open Wallet"
        });
    }
}

const STORAGE_KEY_ACCOUNT_ID = "accountId";
const STORAGE_KEY_APP_PRIVATE_KEY = "appPrivateKey";
const STORAGE_KEY_WALLET_URL = "walletUrl";
const STORAGE_KEY_LOGOUT_BRIDGE_URL = "logoutBridgeUrl";

/**
 * IntearWalletConnector - A lightweight connector for Intear Wallet
 */
export class IntearWalletConnector {
    #connectedAccount: ConnectedAccount | null;
    walletUrl?: typeof INTEAR_NATIVE_WALLET_URL | string;
    logoutBridgeUrl?: string;
    storage: Storage;

    /**
     * Creates a new IntearWalletConnector instance
     * @param storage - The storage to load the connected account from
     * @returns A promise that resolves with the IntearWalletConnector instance
     */
    static async loadFrom(storage: Storage): Promise<IntearWalletConnector> {
        if (!storage) {
            throw new Error("loadFrom: Invalid arguments");
        }
        const accountId = await storage.get(STORAGE_KEY_ACCOUNT_ID);
        const walletUrl = await storage.get(STORAGE_KEY_WALLET_URL);
        const logoutBridgeUrl = await storage.get(STORAGE_KEY_LOGOUT_BRIDGE_URL);
        const connector = new IntearWalletConnector(storage, null, walletUrl, logoutBridgeUrl);
        const connectedAccount = accountId ? new ConnectedAccount(accountId, connector) : null;
        connector.#connectedAccount = connectedAccount;
        return connector;
    }

    private constructor(storage: Storage, connectedAccount: ConnectedAccount | null, walletUrl: typeof INTEAR_NATIVE_WALLET_URL | string, logoutBridgeUrl?: string) {
        this.storage = storage;
        this.#connectedAccount = connectedAccount;
        this.walletUrl = walletUrl;
        this.logoutBridgeUrl = logoutBridgeUrl;
    }

    /**
     * Gets the currently connected account
     * @returns The connected account object or null if not connected
     */
    get connectedAccount(): ConnectedAccount | null {
        return this.#connectedAccount;
    }

    /**
     * Requests a connection to the Intear Wallet
     * @param options - Connection options including networkId, walletUrl, and optional messageToSign
     * @returns A promise that resolves with the connection result, or null if user has rejected the connection
     * @throws Error If the failed to open the wallet popup or already connected
     */
    async requestConnection(options: ConnectionOptions = {}): Promise<ConnectionResult | null> {
        if (this.#connectedAccount !== null) {
            throw new Error("Already connected");
        }

        const {
            networkId = "mainnet",
            walletUrl = "iframe:https://wallet.intear.tech",
            logoutBridgeUrl = "wss://logout-bridge-service.intear.tech",
            messageToSign: nep413MessageToSign,
            relayerId = null,
            functionCallKey,
        } = options;

        if (nep413MessageToSign && nep413MessageToSign.nonce.length !== 32) {
            throw new Error("Nonce must be 32 bytes");
        }

        const keyPair = await crypto.subtle.generateKey(
            {
                name: "Ed25519"
            },
            true, // extractable
            ["sign"]
        );

        const publicKeyRaw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
        const publicKeyBytes = new Uint8Array(publicKeyRaw);
        const publicKeyBase58 = base58Encode(publicKeyBytes);
        const publicKey = `ed25519:${publicKeyBase58}`;

        let messagePayload: { messageToSign?: string, functionCallPublicKey?: string } = {};
        if (nep413MessageToSign) {
            const nep413Payload = JSON.stringify({
                message: nep413MessageToSign.message,
                nonce: Array.from(nep413MessageToSign.nonce),
                recipient: nep413MessageToSign.recipient,
                callback_url: nep413MessageToSign.callbackUrl ?? null,
                state: nep413MessageToSign.state ?? null
            });
            messagePayload.messageToSign = nep413Payload;
        }
        if (functionCallKey) {
            messagePayload.functionCallPublicKey = functionCallKey.publicKey;
        }
        const message = JSON.stringify(messagePayload);

        const nonce = Date.now();

        const messageToHash = `${nonce}|${message}`;
        const hashedMessage = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(messageToHash));

        const signatureBuffer = await crypto.subtle.sign(
            {
                name: "Ed25519"
            },
            keyPair.privateKey,
            hashedMessage
        );

        const signatureBytes = new Uint8Array(signatureBuffer);
        const signatureBase58 = base58Encode(signatureBytes);
        const signature = `ed25519:${signatureBase58}`;

        const signInData = __NEARCONNECT__ ? {
            publicKey,
            networkId,
            nonce,
            message,
            signature,
            version: "V3",
            relayerId,
            contractId: functionCallKey?.contractId,
            methodNames: functionCallKey ? (functionCallKey.methodNames === "any" ? undefined : functionCallKey.methodNames) : undefined,
            gasAllowance: functionCallKey ? (functionCallKey.gasAllowance === "unlimited" ? "Unlimited" : { Amount: functionCallKey.gasAllowance }) : undefined,
        } : {
            publicKey,
            networkId,
            nonce,
            message,
            signature,
            version: "V3",
            actualOrigin: window.location.origin,
            relayerId,
            contractId: functionCallKey?.contractId,
            methodNames: functionCallKey ? (functionCallKey.methodNames === "any" ? undefined : functionCallKey.methodNames) : undefined,
            gasAllowance: functionCallKey ? (functionCallKey.gasAllowance === "unlimited" ? "Unlimited" : { Amount: functionCallKey.gasAllowance }) : undefined,
        };

        if (walletUrl.startsWith("iframe:")) {
            const iframeOriginUrl = walletUrl.substring("iframe:".length);
            const hotConnectorOrigin = __NEARCONNECT__
                ? new Promise((resolve) => {
                    let origin: string | null = null;
                    const interval = setInterval(() => {
                        if (origin) {
                            clearInterval(interval);
                            resolve(origin);
                        }
                    }, 100);

                    const listener = (event: MessageEvent) => {
                        // Could be a wrong origin, but there"s no way to know if it"s the right one
                        if (event.data.origin) {
                            origin = event.data.origin;
                            window.removeEventListener("message", listener);
                        }
                    };

                    window.addEventListener("message", listener);
                })
                : null;
            const iframe = document.createElement("iframe");
            iframe.src = __NEARCONNECT__
                ? `${iframeOriginUrl}/hot-wallet-connector-iframe.html`
                : `${iframeOriginUrl}/wallet-connector-iframe.html`;
            iframe.style.position = "fixed";
            iframe.style.inset = "0";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.border = "none";
            iframe.style.zIndex = "100000";
            if (__NEARCONNECT__) {
                iframe.onload = () => {
                    // @ts-ignore
                    window.selector.ui.showIframe();
                    (hotConnectorOrigin as Promise<string | null>)?.then((origin) => {
                        iframe.contentWindow?.postMessage(
                            {
                                type: "hotConnectorData",
                                origin,
                                // @ts-ignore
                                location: window.selector.location,
                            },
                            "*"
                        );
                    });
                };
            }
            document.body.appendChild(iframe);

            return new Promise((resolve, reject) => {
                let response: any = {};
                const listener = async (event: MessageEvent) => {
                    if (__NEARCONNECT__) {
                        if (event.data.status) {
                            // Probably a hot connector result
                            iframe.contentWindow?.postMessage(
                                event.data,
                                "*"
                            );
                            return;
                        }
                    }

                    switch (event.data.type) {
                        case "ready":
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
                            const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
                            response = {
                                privateKeyJwk: privateKeyJwk,
                                walletUrl: responseWalletUrl,
                                logoutBridgeUrl: logoutBridgeUrl,
                                accountId: accountId,
                                signedMessage: event.data.signedMessage,
                            };
                            iframe.contentWindow?.postMessage(
                                {
                                    type: "close",
                                },
                                "*",
                            );
                            break;
                        case "error":
                            iframe.contentWindow?.postMessage(
                                {
                                    type: "close",
                                    message: event.data.message,
                                },
                                "*",
                            );
                            break;
                        case "close":
                            iframe.remove();
                            window.removeEventListener("message", listener);
                            if (event.data.message) {
                                if (event.data.message == "User closed the modal" || event.data.message == "User rejected the connection") {
                                    resolve(null);
                                } else {
                                    reject(new Error(event.data.message));
                                }
                            } else {
                                this.#connectedAccount = new ConnectedAccount(response.accountId, this);
                                await this.storage.set(STORAGE_KEY_APP_PRIVATE_KEY, response.privateKeyJwk);
                                await this.storage.set(STORAGE_KEY_WALLET_URL, response.walletUrl);
                                await this.storage.set(STORAGE_KEY_LOGOUT_BRIDGE_URL, response.logoutBridgeUrl);
                                await this.storage.set(STORAGE_KEY_ACCOUNT_ID, response.accountId);
                                const result: ConnectionResult = { account: this.#connectedAccount };
                                if (nep413MessageToSign) {
                                    if (!response.signedMessage) {
                                        throw new Error("No signed message returned from wallet, this should never happen, a bug on wallet side");
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
        } else {
            return openWalletFlow<ConnectionResult>({
                method: "connect",
                walletUrl,
                logoutBridgeUrl,
                sendMessageType: "signIn",
                sendData: signInData,
                successMessageType: "connected",
                onSuccess: async (data) => {
                    const accountId = data.accountId;
                    this.#connectedAccount = new ConnectedAccount(accountId, this);
                    const responseWalletUrl = walletUrl === data.useBridge ? INTEAR_NATIVE_WALLET_URL : data.walletUrl;
                    this.walletUrl = responseWalletUrl;
                    this.logoutBridgeUrl = logoutBridgeUrl;
                    const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
                    await this.storage.set(STORAGE_KEY_APP_PRIVATE_KEY, privateKeyJwk);
                    await this.storage.set(STORAGE_KEY_WALLET_URL, responseWalletUrl);
                    await this.storage.set(STORAGE_KEY_LOGOUT_BRIDGE_URL, logoutBridgeUrl);
                    await this.storage.set(STORAGE_KEY_ACCOUNT_ID, accountId);

                    const result: ConnectionResult = { account: this.#connectedAccount };

                    if (nep413MessageToSign) {
                        if (!data.signedMessage) {
                            throw new Error("No signed message returned from wallet, this should never happen, a bug on wallet side");
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
    async disconnect(): Promise<void> {
        if (this.#connectedAccount !== null) {
            this.#connectedAccount.disconnected = true;
            this.#connectedAccount = null;
            this.walletUrl = undefined;
            this.logoutBridgeUrl = undefined;
            await this.storage.remove(STORAGE_KEY_ACCOUNT_ID);
            await this.storage.remove(STORAGE_KEY_APP_PRIVATE_KEY);
            await this.storage.remove(STORAGE_KEY_WALLET_URL);
            await this.storage.remove(STORAGE_KEY_LOGOUT_BRIDGE_URL);
        } else {
            throw new Error("Account is not connected");
        }
    }
}

/**
 * InMemoryStorage - An in-memory storage implementation that is not persisted
 */
export class InMemoryStorage implements Storage {
    private data: Map<string, any>;

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
    getData(): Map<string, any> {
        return this.data;
    }

    /**
     * Clones the storage
     * @returns A new InMemoryStorage instance with the same data. Modifying
     * the clone will not affect the original storage, and vice versa.
     */
    clone(): InMemoryStorage {
        const clone = new InMemoryStorage();
        clone.data = new Map(this.data);
        return clone;
    }

    async get(key: string): Promise<any | null> {
        const value = this.data.get(key);
        return value !== undefined ? value : null;
    }

    async set(key: string, value: any): Promise<any | null> {
        const previousValue = await this.get(key);
        this.data.set(key, value);
        return previousValue;
    }

    async remove(key: string): Promise<any | null> {
        const previousValue = await this.get(key);
        this.data.delete(key);
        return previousValue;
    }
}

/**
 * LocalStorageStorage - A localStorage-backed storage implementation
 */
export class LocalStorageStorage implements Storage {
    private prefix: string;
    private storage: globalThis.Storage;

    /**
     * Creates a new LocalStorageStorage instance
     * @param prefix - The prefix to apply to all keys
     * @param storage - The storage to use for storing the data. You can pass
     * your own localStorage-compatible object, like sessionStorage.
     * @throws Error If localStorage is not available
     */
    constructor(prefix: string, storage: globalThis.Storage = window.localStorage) {
        this.prefix = prefix;
        this.storage = storage;
    }

    /**
     * Prefixes the key and returns the key that corresponds to localStorage
     */
    private _getPrefixedKey(key: string): string {
        return this.prefix + key;
    }

    async get(key: string): Promise<any | null> {
        const prefixedKey = this._getPrefixedKey(key);
        const item = this.storage.getItem(prefixedKey);
        return item === null ? null : JSON.parse(item);
    }

    async set(key: string, value: any): Promise<any | null> {
        const previousValue = await this.get(key);
        const prefixedKey = this._getPrefixedKey(key);
        this.storage.setItem(prefixedKey, JSON.stringify(value));
        return previousValue;
    }

    async remove(key: string): Promise<any | null> {
        const previousValue = await this.get(key);
        const prefixedKey = this._getPrefixedKey(key);
        this.storage.removeItem(prefixedKey);
        return previousValue;
    }
}

export default IntearWalletConnector;

export type Action = LegacySelectorAction | NonDelegateAction;

export interface LegacyCreateAccountAction {
    type: "CreateAccount";
}

export interface LegacyDeployContractAction {
    type: "DeployContract";
    params: {
        code: number[];
    };
}

export interface LegacyFunctionCallAction {
    type: "FunctionCall";
    params: {
        methodName: string;
        args: object;
        gas: string;
        deposit: string;
    };
}

export interface LegacyTransferAction {
    type: "Transfer";
    params: {
        deposit: string;
    };
}

export interface LegacyStakeAction {
    type: "Stake";
    params: {
        stake: string;
        publicKey: string;
    };
}

export type AddKeyPermission =
    | "FullAccess"
    | {
        receiverId: string;
        allowance?: string;
        methodNames?: Array<string>;
    };

export interface LegacyAddKeyAction {
    type: "AddKey";
    params: {
        publicKey: string;
        accessKey: {
            nonce?: number;
            permission: AddKeyPermission;
        };
    };
}

export interface LegacyDeleteKeyAction {
    type: "DeleteKey";
    params: {
        publicKey: string;
    };
}

export interface LegacyDeleteAccountAction {
    type: "DeleteAccount";
    params: {
        beneficiaryId: string;
    };
}

export interface LegacyUseGlobalContractAction {
    type: "UseGlobalContract";
    params: { contractIdentifier: { accountId: string } | { codeHash: string } };
}

export interface LegacyDeployGlobalContractAction {
    type: "DeployGlobalContract";
    params: { code: number[]; deployMode: "CodeHash" | "AccountId" };
}

export type LegacySelectorAction =
    | LegacyCreateAccountAction
    | LegacyDeployContractAction
    | LegacyFunctionCallAction
    | LegacyTransferAction
    | LegacyStakeAction
    | LegacyAddKeyAction
    | LegacyDeleteKeyAction
    | LegacyDeleteAccountAction
    | LegacyUseGlobalContractAction
    | LegacyDeployGlobalContractAction;

export type AccessKeyPermission =
    | "FullAccess"
    | {
        FunctionCall: {
            allowance: string | null;
            receiver_id: string;
            method_names: string[];
        };
    };

export interface AddKeyAction {
    public_key: string;
    access_key: {
        nonce: number;
        permission: AccessKeyPermission;
    };
}

export interface CreateAccountAction { }

export interface DeleteAccountAction {
    beneficiary_id: string;
}

export interface DeleteKeyAction {
    public_key: string;
}

export interface DeployContractAction {
    code: string;
}

export interface DeployGlobalContractAction {
    code: string;
    deploy_mode: "CodeHash" | "AccountId";
}

export type GlobalContractIdentifier =
    | { CodeHash: string }
    | { AccountId: string };

export interface UseGlobalContractAction {
    contract_identifier: GlobalContractIdentifier;
}

export interface FunctionCallAction {
    method_name: string;
    args: string;
    gas: string | number;
    deposit: string;
}

export interface StakeAction {
    stake: string;
    public_key: string;
}

export interface TransferAction {
    deposit: string;
}

export type NearAction =
    | { CreateAccount: CreateAccountAction }
    | { DeployContract: DeployContractAction }
    | { FunctionCall: FunctionCallAction }
    | { Transfer: TransferAction }
    | { Stake: StakeAction }
    | { AddKey: AddKeyAction }
    | { DeleteKey: DeleteKeyAction }
    | { DeleteAccount: DeleteAccountAction }
    | { DeployGlobalContract: DeployGlobalContractAction }
    | { UseGlobalContract: UseGlobalContractAction }
    | { Delegate: DelegateAction };

export type NonDelegateAction = Exclude<NearAction, { Delegate: DelegateAction }>;

export interface SignedDelegateAction {
    delegate_action: DelegateAction;
    // the format is ed25519:<base58>
    signature: string;
    borshSerializedBase64: string;
}

export interface DelegateAction {
    sender_id: string;
    receiver_id: string;
    actions: Array<NonDelegateAction>;
    nonce: number;
    max_block_height: number;
    public_key: string;
}

export interface Transaction {
    signerId: string;
    receiverId: string;
    actions: Array<Action>;
}

/**
 * Result of signing delegate actions in the wallet.
 * Contains the signed delegate actions, ready to send to the RPC.
 */
export interface SignDelegateActionsResult {
    /**
     * Array of execution outcomes for each transaction, in the same order as the transactions were sent.
     * Each outcome is the FinalExecutionOutcomeViewEnum as returned by NEAR RPC.
     */
    signedDelegateActions: SignedDelegateAction[];
}
