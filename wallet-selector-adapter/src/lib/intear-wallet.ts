import type {
  WalletModuleFactory,
  WalletBehaviourFactory,
  BrowserWallet,
  Account,
  Optional,
  Transaction,
  NetworkId,
  InjectedWallet,
} from "@near-wallet-selector/core";
import icon from "./icon";
import * as nearAPI from "near-api-js";
import { KeyType } from "near-api-js/lib/utils/key_pair";
import { AccessKeyView } from "near-api-js/lib/providers/provider";
import { createAction } from "@near-wallet-selector/wallet-utils";
import { LoggerService } from "@near-wallet-selector/core/src/lib/services";

const DEFAULT_WALLET_DOMAIN = "https://wallet.intear.tech";
const DEFAULT_LOGOUT_BRIDGE_SERVICE = "https://logout-bridge-service.intear.tech";
const STORAGE_KEY = "_intear_wallet_connected_account";
const POPUP_FEATURES = "width=400,height=700";

let hasCheckedLogout = false;
let checkingAccountPromise: Promise<Account[]> | null = null;

type WsClientMessage = {
  Auth: {
    network: NetworkId;
    account_id: string;
    app_public_key: string;
    nonce: number;
    signature: string;
  };
};

type WsServerMessage =
  | { Error: { message: string } }
  | { Success: { message: string } }
  | {
      LoggedOut: {
        network: NetworkId;
        account_id: string;
        app_public_key: string;
        logout_info: {
          nonce: number;
          signature: string;
          caused_by: "User" | "App";
        };
      };
    };

class LogoutWebSocket {
  private static instance: LogoutWebSocket | null = null;
  private ws: WebSocket | null = null;
  private accountId: string;
  private appKey: nearAPI.utils.KeyPair;
  private logoutKey: nearAPI.utils.PublicKey;
  private logoutBridgeService: string;
  private network: NetworkId;
  private intentionallyClosed: boolean = false;
  private logger: LoggerService;

  private constructor(
    network: NetworkId,
    accountId: string,
    appKey: nearAPI.utils.KeyPair,
    logoutKey: nearAPI.utils.PublicKey,
    logoutBridgeService: string,
    logger: LoggerService
  ) {
    this.accountId = accountId;
    this.appKey = appKey;
    this.logoutKey = logoutKey;
    this.logoutBridgeService = logoutBridgeService;
    this.network = network;
    this.logger = logger;
    this.connect();
  }

  private async connect() {
    const wsUrl = this.logoutBridgeService
      .replace("https://", "wss://")
      .replace("http://", "ws://");
    this.ws = new WebSocket(`${wsUrl}/api/subscribe`);

    this.ws.onopen = async () => {
      if (!this.ws) return;

      const nonce = Date.now();
      const message = `subscribe|${nonce}`;

      const { signature, publicKey } = this.appKey.sign(new TextEncoder().encode(message));

      let signatureString: string;
      switch (publicKey.keyType) {
        case KeyType.ED25519:
          signatureString = `ed25519:${nearAPI.utils.serialize.base_encode(signature)}`;
          break;
        case KeyType.SECP256K1:
          signatureString = `secp256k1:${nearAPI.utils.serialize.base_encode(signature)}`;
          break;
        default:
          throw new Error("Unsupported key type");
      }

      const authMessage: WsClientMessage = {
        Auth: {
          network: this.network,
          account_id: this.accountId,
          app_public_key: this.appKey.getPublicKey().toString(),
          nonce,
          signature: signatureString,
        },
      };

      this.ws.send(JSON.stringify(authMessage));
    };

    this.ws.onmessage = async (event) => {
      const message = JSON.parse(event.data) as WsServerMessage;

      if ("Success" in message) {
        this.logger.log("WebSocket:", message.Success.message);
      } else if ("Error" in message) {
        this.logger.error("WebSocket error:", message.Error.message);
      } else if ("LoggedOut" in message) {
        const { logout_info } = message.LoggedOut;
        this.logger.log("Received logout notification:", logout_info);

        if (logout_info.nonce > Date.now() || logout_info.nonce < Date.now() - 1000 * 60 * 5) {
          this.logger.error("Invalid logout nonce:", logout_info.nonce);
          return;
        }

        const verifyMessage = `logout|${logout_info.nonce}|${this.accountId}|${this.appKey.getPublicKey()}`;
        const sigData = logout_info.signature.split(":")[1];
        const signature = nearAPI.utils.serialize.base_decode(sigData);

        let verifyKey: nearAPI.utils.PublicKey;
        if (logout_info.caused_by === "User") {
          verifyKey = this.logoutKey;
        } else if (logout_info.caused_by === "App") {
          verifyKey = this.appKey.getPublicKey();
        } else {
          this.logger.error("Unknown logout cause:", logout_info.caused_by);
          return;
        }

        const isValid = verifyKey.verify(new TextEncoder().encode(verifyMessage), signature);

        if (!isValid) {
          this.logger.error("Invalid logout signature");
          return;
        }

        this.logger.log(
          "Valid logout message received from logout bridge WebSocket, clearing storage and refreshing page"
        );
        window.localStorage.removeItem(STORAGE_KEY);
        this.intentionallyClosed = true;
        this.close();
        window.location.reload();
      }
    };

    this.ws.onclose = () => {
      this.logger.log("Logout WebSocket connection closed");
      if (!this.intentionallyClosed) {
        this.logger.log("Attempting to reconnect in 500ms...");
        setTimeout(() => this.connect(), 500);
      } else {
        LogoutWebSocket.instance = null;
      }
    };

    this.ws.onerror = (error) => {
      this.logger.error("Logout WebSocket error:", error);
      if (!this.intentionallyClosed) {
        this.logger.log("Attempting to reconnect in 500ms...");
        setTimeout(() => this.connect(), 500);
      } else {
        LogoutWebSocket.instance = null;
      }
    };
  }

  public static initialize(
    network: NetworkId,
    accountId: string,
    appKey: nearAPI.utils.KeyPair,
    logoutKey: nearAPI.utils.PublicKey,
    logoutBridgeService: string,
    logger: LoggerService
  ): LogoutWebSocket {
    if (!LogoutWebSocket.instance) {
      LogoutWebSocket.instance = new LogoutWebSocket(
        network,
        accountId,
        appKey,
        logoutKey,
        logoutBridgeService,
        logger
      );
    }
    return LogoutWebSocket.instance;
  }

  public static getInstance(): LogoutWebSocket | null {
    return LogoutWebSocket.instance;
  }

  public close() {
    if (this.ws) {
      this.intentionallyClosed = true;
      this.ws.close();
    }
    LogoutWebSocket.instance = null;
  }
}

type LogoutInfo = {
  nonce: number;
  signature: string;
  caused_by: "User" | "App";
};

type SessionStatus = "Active" | { LoggedOut: LogoutInfo };

export interface IntearWalletParams {
  walletUrl?: string;
  logoutBridgeService?: string;
  iconUrl?: string;
  deprecated?: boolean;
}

type SavedData = {
  accounts: [Account, ...Account[]];
  key: nearAPI.utils.KeyPairString;
  contractId: string;
  methodNames: string[];
  logoutKey: string; // there's no PublicKeyString type
};

type IntearWalletOptions = {
  logoutBridgeService: string;
  walletUrl: string;
};

const IntearWallet: WalletBehaviourFactory<InjectedWallet, IntearWalletOptions> = ({
  metadata,
  options,
  logoutBridgeService,
  logger,
  walletUrl,
}) => {
  return Promise.resolve({
    async signIn({ contractId, methodNames }) {
      return new Promise((resolve, reject) => {
        // This key is used not only as a function call key, but also as an authorization
        // key for the wallet, which can be revoked by the user in the wallet which will
        // automatically log out the user from the app.
        let key = nearAPI.KeyPair.fromRandom("ed25519");
        logger.log("signIn", { contractId, methodNames, key: key.getPublicKey().toString() });
        let popup = window.open(`${walletUrl}/connect`, "_blank", POPUP_FEATURES);
        if (!popup) {
          reject(new Error("Popup was blocked"));
          return;
        }
        let done = false;
        let listener = async (event: MessageEvent) => {
          logger.log("Message from connect popup", event);
          switch (event.data.type) {
            case "ready":
              let message = JSON.stringify({ origin: location.origin });
              let nonce = Date.now();
              let signatureString = await generateAuthSignature(key, message, nonce);
              popup.postMessage(
                {
                  type: "signIn",
                  data: {
                    contractId: contractId,
                    methodNames: methodNames,
                    publicKey: key.getPublicKey().toString(),
                    networkId: options.network.networkId,
                    nonce,
                    message,
                    signature: signatureString,
                  },
                },
                walletUrl
              );
              break;
            case "connected":
              done = true;
              popup.close();
              let accounts = event.data.accounts;
              if (accounts.length !== 0) {
                accounts = accounts.map((account: Account, index: number) => ({
                  ...account,
                  active: index === 0,
                }));
              }
              let functionCallKeyAdded = event.data.functionCallKeyAdded;
              let logoutKey = nearAPI.utils.PublicKey.fromString(event.data.logoutKey);
              let dataToSave: SavedData = {
                accounts,
                key: key.toString(),
                contractId: functionCallKeyAdded ? contractId : "",
                methodNames: functionCallKeyAdded ? (methodNames ?? []) : [],
                logoutKey: logoutKey.toString(),
              };
              window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
              resolve(accounts);

              LogoutWebSocket.initialize(
                options.network.networkId as NetworkId,
                accounts[0].accountId,
                key,
                nearAPI.utils.PublicKey.fromString(dataToSave.logoutKey),
                logoutBridgeService,
                logger
              );
              break;
            case "error":
              done = true;
              popup.close();
              reject(new Error(event.data.message));
              break;
          }
        };
        window.addEventListener("message", listener);
        const checkPopupClosed = setInterval(() => {
          if (popup.closed) {
            window.removeEventListener("message", listener);
            clearInterval(checkPopupClosed);
            if (!done) {
              reject(new Error("Popup closed"));
            }
          }
        }, 100);
      });
    },

    async signOut() {
      logger.log("signOut");
      const savedData = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || "null"
      ) as SavedData | null;
      if (!savedData || savedData.accounts.length === 0) {
        return;
      }

      LogoutWebSocket.getInstance()?.close();

      try {
        const account = savedData.accounts[0];
        const network = options.network.networkId.toLowerCase();
        const key = nearAPI.KeyPair.fromString(savedData.key);
        const nonce = Date.now();
        const message = `logout|${nonce}|${account.accountId}|${key.getPublicKey()}`;

        const { signature, publicKey } = key.sign(new TextEncoder().encode(message));

        let signatureString: string;
        switch (publicKey.keyType) {
          case KeyType.ED25519:
            signatureString = `ed25519:${nearAPI.utils.serialize.base_encode(signature)}`;
            break;
          case KeyType.SECP256K1:
            signatureString = `secp256k1:${nearAPI.utils.serialize.base_encode(signature)}`;
            break;
          default:
            throw new Error("Unsupported key type");
        }

        const response = await fetch(`${logoutBridgeService}/api/logout_app/${network}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_id: account.accountId,
            app_public_key: key.getPublicKey().toString(),
            nonce,
            signature: signatureString,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          logger.error("Failed to notify bridge service of logout:", error);
        } else {
          logger.log("Successfully notified bridge service of logout");
        }
      } catch (error) {
        logger.error("Error during bridge service logout:", error);
      } finally {
        // Always remove from local storage even if bridge service call fails
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },

    async getAccounts() {
      logger.log("getAccounts");
      let savedData = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || "null"
      ) as SavedData | null;

      if (savedData && !hasCheckedLogout) {
        if (checkingAccountPromise) {
          return await checkingAccountPromise;
        }
        checkingAccountPromise = new Promise<Account[]>(async (resolve) => {
          try {
            const account = savedData.accounts[0];
            const network = options.network.networkId.toLowerCase();
            let key = nearAPI.KeyPair.fromString(savedData.key);

            LogoutWebSocket.initialize(
              network as NetworkId,
              account.accountId,
              key,
              nearAPI.utils.PublicKey.fromString(savedData.logoutKey),
              logoutBridgeService,
              logger
            );

            const nonce = Date.now();
            const message = `check|${nonce}`;
            const { signature, publicKey } = key.sign(new TextEncoder().encode(message));

            let signatureString: string;
            switch (publicKey.keyType) {
              case KeyType.ED25519:
                signatureString = `ed25519:${nearAPI.utils.serialize.base_encode(signature)}`;
                break;
              case KeyType.SECP256K1:
                signatureString = `secp256k1:${nearAPI.utils.serialize.base_encode(signature)}`;
                break;
              default:
                throw new Error("Unsupported key type");
            }

            const response = await fetch(
              `${logoutBridgeService}/api/check_logout/${network}/${account.accountId}/${key.getPublicKey()}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nonce,
                  signature: signatureString,
                }),
              }
            );

            if (!response.ok) {
              logger.error("Failed to check logout status:", await response.text());
              resolve(savedData.accounts);
              return;
            }

            const status = (await response.json()) as SessionStatus;
            logger.log("Logout check response:", status);

            if (status !== "Active") {
              const logoutInfo = status.LoggedOut;
              logger.log("User was logged out:", logoutInfo);

              // Verify the logout signature
              const message = `logout|${logoutInfo.nonce}|${account.accountId}|${key.getPublicKey()}`;
              const sigData = logoutInfo.signature.split(":")[1];
              const signature = nearAPI.utils.serialize.base_decode(sigData);

              let verifyKey: nearAPI.utils.PublicKey;
              if (logoutInfo.caused_by === "User") {
                verifyKey = nearAPI.utils.PublicKey.fromString(savedData.logoutKey);
              } else if (logoutInfo.caused_by === "App") {
                // No idea how the user can be signed out by the app and the app doesn't
                // know that, but whatever, handle this anyway
                verifyKey = key.getPublicKey();
              } else {
                logger.error("Unknown logout cause:", logoutInfo.caused_by);
                resolve(savedData.accounts);
                return;
              }

              const isValid = verifyKey.verify(new TextEncoder().encode(message), signature);

              if (!isValid) {
                logger.error("Invalid logout signature");
                resolve(savedData.accounts);
                return;
              }

              // Only clear storage if signature is valid
              logger.log("Signed out on the wallet side");
              window.localStorage.removeItem(STORAGE_KEY);
              LogoutWebSocket.getInstance()?.close();
              resolve([]);
            } else {
              resolve(savedData.accounts);
            }
          } catch (error) {
            logger.error("Failed to check logout status:", error);
            // Continue with saved data if we can't check logout status
            resolve(savedData.accounts);
          }
        }).finally(() => {
          checkingAccountPromise = null;
          hasCheckedLogout = true;
        });
        return await checkingAccountPromise;
      }

      logger.log("Accounts:", savedData?.accounts ?? []);
      return savedData?.accounts ?? [];
    },

    async verifyOwner() {
      throw new Error(`Method not supported by ${metadata.name}`);
    },

    async signMessage({ message, nonce, recipient, callbackUrl, state }) {
      logger.log("sign message", { message, nonce, recipient, callbackUrl, state });
      let savedData = assertLoggedIn();
      return new Promise((resolve, reject) => {
        let popup = window.open(`${walletUrl}/sign-message`, "_blank", POPUP_FEATURES);
        if (!popup) {
          throw new Error("Popup was blocked");
        }
        let done = false;
        let listener = async (event: MessageEvent) => {
          logger.log("Message from sign-message popup", event);
          switch (event.data.type) {
            case "ready": {
              let signMessageString = JSON.stringify({
                message,
                recipient,
                nonce: Array.from(nonce),
                callbackUrl,
                state,
              });
              let authNonce = Date.now();
              let signatureString = await generateAuthSignature(
                nearAPI.KeyPair.fromString(savedData.key),
                signMessageString,
                authNonce
              );
              popup.postMessage(
                {
                  type: "signMessage",
                  data: {
                    message: signMessageString,
                    accountId: savedData.accounts[0].accountId,
                    publicKey: nearAPI.KeyPair.fromString(savedData.key).getPublicKey().toString(),
                    nonce: authNonce,
                    signature: signatureString,
                  },
                },
                walletUrl
              );
              break;
            }
            case "signed": {
              done = true;
              popup.close();
              let signature = event.data.signature;
              resolve({
                ...signature,
                signature: btoa(
                  Array.from(
                    nearAPI.utils.serialize.base_decode(signature.signature.split(":")[1]),
                    (byte) => String.fromCharCode(byte)
                  ).join("")
                ),
              });
              break;
            }
            case "error": {
              done = true;
              popup.close();
              reject(new Error(event.data.message));
              break;
            }
          }
        };
        window.addEventListener("message", listener);
        const checkPopupClosed = setInterval(() => {
          if (popup.closed) {
            window.removeEventListener("message", listener);
            clearInterval(checkPopupClosed);
            if (!done) {
              reject(new Error("Popup closed"));
            }
          }
        }, 100);
      });
    },

    async signAndSendTransaction({ signerId, receiverId, actions }) {
      logger.log("signAndSendTransaction", {
        signerId,
        receiverId,
        actions,
      });
      let savedData = assertLoggedIn();
      return await signAndSendTransactions(
        [
          {
            signerId,
            receiverId: receiverId ?? savedData.contractId,
            actions,
          },
        ],
        walletUrl,
        new nearAPI.providers.JsonRpcProvider({ url: options.network.nodeUrl }),
        logger
      ).then((outcomes) => outcomes[0]);
    },

    async signAndSendTransactions({ transactions }) {
      return (await signAndSendTransactions(
        transactions,
        walletUrl,
        new nearAPI.providers.JsonRpcProvider({ url: options.network.nodeUrl }),
        logger
      ));
    },

    buildImportAccountsUrl() {
      return `${walletUrl}/import`;
    },
  });
};

async function signAndSendTransactions(
  incomplete_transactions: Array<Optional<Transaction, "signerId">>,
  walletUrl: string,
  provider: nearAPI.providers.Provider,
  logger: LoggerService
): Promise<Array<nearAPI.providers.FinalExecutionOutcome>> {
  let savedData = assertLoggedIn();
  let transactions: Transaction[] = incomplete_transactions.map((transaction) => ({
    ...transaction,
    signerId: transaction.signerId ?? savedData.accounts[0].accountId,
  }));
  logger.log("signAndSendTransactions", { transactions });
  return new Promise(async (resolve, reject) => {
    let canSignLocally = transactions.every(
      (transaction) => transaction.receiverId === savedData.contractId
    );
    if (canSignLocally) {
      try {
        let keyPair = nearAPI.KeyPair.fromString(savedData.key);

        let accessKey: AccessKeyView = await provider.query({
          request_type: "view_access_key",
          account_id: savedData.accounts[0].accountId,
          public_key: keyPair.getPublicKey().toString(),
          finality: "optimistic",
        });
        let nonce = BigInt(accessKey.nonce.toString());
        let recentBlock = await provider.block({ finality: "final" });
        let recentBlockHash = recentBlock.header.hash;

        let najTransactions = transactions.map(
          (transaction, i) =>
            new nearAPI.transactions.Transaction({
              signerId: transaction.signerId,
              publicKey: keyPair.getPublicKey(),
              nonce: nonce + BigInt(i + 1),
              receiverId: transaction.receiverId,
              actions: transaction.actions.map((action) => createAction(action)),
              blockHash: nearAPI.utils.serialize.base_decode(recentBlockHash),
            })
        );
        let keyStore = new nearAPI.keyStores.InMemoryKeyStore();
        keyStore.setKey("dontcare", savedData.accounts[0].accountId, keyPair);
        let signer = new nearAPI.InMemorySigner(keyStore);
        let signedTransactions = await Promise.all(
          najTransactions.map(
            async (transaction) =>
              new nearAPI.transactions.SignedTransaction({
                transaction,
                signature: new nearAPI.transactions.Signature({
                  data: (
                    await signer.signMessage(
                      nearAPI.transactions.encodeTransaction(transaction),
                      savedData.accounts[0].accountId,
                      "dontcare"
                    )
                  ).signature,
                  keyType: keyPair.getPublicKey().keyType,
                }),
              })
          )
        );

        let outcomes = [];
        for (let i = 0; i < signedTransactions.length; i++) {
          let outcome = await provider.sendTransactionUntil(
            signedTransactions[i],
            "EXECUTED_OPTIMISTIC"
          );
          outcomes.push(outcome);
        }
        resolve(outcomes);
        return;
      } catch (error) {
        logger.error("Error signing and sending transactions locally", error);
        logger.log("Signing and sending transactions in wallet interface");
      }
    }

    let popup = window.open(`${walletUrl}/send-transactions`, "_blank", POPUP_FEATURES);
    if (!popup) {
      throw new Error("Popup was blocked");
    }
    let done = false;
    let listener = async (event: MessageEvent) => {
      logger.log("Message from send-transactions popup", event);
      switch (event.data.type) {
        case "ready": {
          let transactionsString = JSON.stringify(transactions);
          let nonce = Date.now();
          let signatureString = await generateAuthSignature(
            nearAPI.KeyPair.fromString(savedData.key),
            transactionsString,
            nonce
          );
          popup.postMessage(
            {
              type: "signAndSendTransactions",
              data: {
                transactions: transactionsString,
                accountId: savedData.accounts[0].accountId,
                publicKey: nearAPI.KeyPair.fromString(savedData.key).getPublicKey().toString(),
                nonce: nonce,
                signature: signatureString,
              },
            },
            walletUrl
          );
          break;
        }
        case "sent": {
          done = true;
          popup.close();
          resolve(
            event.data.outcomes.map((outcome: Map<string, any>) => Object.fromEntries(outcome))
          );
          break;
        }
        case "error": {
          done = true;
          popup.close();
          reject(new Error(event.data.message));
          break;
        }
      }
    };
    window.addEventListener("message", listener);
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        window.removeEventListener("message", listener);
        clearInterval(checkPopupClosed);
        if (!done) {
          reject(new Error("Popup closed"));
        }
      }
    }, 100);
  });
}

async function generateAuthSignature(
  keyPair: nearAPI.utils.KeyPair,
  data: string,
  nonce: number
): Promise<string> {
  let keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  keyStore.setKey("dontcare", "dontcare", keyPair);
  let signer = new nearAPI.InMemorySigner(keyStore);
  let signature = await signer.signMessage(
    new TextEncoder().encode(nonce.toString() + "|" + data),
    "dontcare",
    "dontcare"
  );

  switch (signature.publicKey.keyType) {
    case KeyType.ED25519:
      return `ed25519:${nearAPI.utils.serialize.base_encode(signature.signature)}`;
    case KeyType.SECP256K1:
      return `secp256k1:${nearAPI.utils.serialize.base_encode(signature.signature)}`;
    default:
      throw new Error("Unsupported key type");
  }
}

function assertLoggedIn(): SavedData {
  let savedData = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
  if (!savedData || !savedData.accounts || savedData.accounts.length === 0) {
    throw new Error("No account found");
  }
  return savedData;
}

export function setupIntearWallet({
  walletUrl = DEFAULT_WALLET_DOMAIN,
  logoutBridgeService = DEFAULT_LOGOUT_BRIDGE_SERVICE,
  iconUrl = icon,
  deprecated = false,
}: IntearWalletParams = {}): WalletModuleFactory<InjectedWallet> {
  return async () => {
    return {
      id: "intear-wallet",
      type: "injected",
      metadata: {
        name: "Intear Wallet",
        description: "A stupid wallet for people who want to cry.",
        iconUrl,
        deprecated,
        available: true,
        downloadUrl: walletUrl,
      },
      init: (options) => IntearWallet({ ...options, logoutBridgeService, walletUrl }),
    };
  };
}
