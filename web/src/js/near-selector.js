import IntearWalletConnector from "./intearwallet-connect.js";

const selectorStorage = {
    get: async (key) => {
        return JSON.parse(await window.selector.storage.get(key)) ?? null;
    },
    set: async (key, value) => {
        const previousValue = await selectorStorage.get(key);
        await window.selector.storage.set(key, JSON.stringify(value));
        return previousValue;
    },
    remove: async (key) => {
        const previousValue = await selectorStorage.get(key);
        await window.selector.storage.remove(key);
        return previousValue;
    },
}

class IntearWalletAdapter {
    constructor(near) {
        this.near = near;
    }

    async signIn({ network, contractId, methodNames }) {
        if (this.near.connectedAccount) {
            await this.signOut({ network });
        }
        if (contractId || methodNames) {
            console.warn("[Intear Adapter] Contract ID and method names are not supported in near selector afaik. If you believe this is a mistake, or it's already supported, please write to intear wallet support or in telegram and it will be fixed asap.");
        }
        const result = await this.near.requestConnection({ networkId: network })
            .catch(error => {
                console.error("Error in signIn", error);
                return null;
            });
        if (result === null) {
            return [];
        }
        return [{
            accountId: result.account.accountId,
            // TODO: public key?
        }];
    }
    async signOut({ network }) {
        this.near.disconnect();
    }
    async getAccounts({ network }) {
        if (this.near.connectedAccount) {
            return [{
                accountId: this.near.connectedAccount.accountId,
                // TODO: public key?
            }];
        } else {
            return [];
        }
    }
    async signMessage({ network, message, nonce, recipient }) {
        if (!this.near.connectedAccount) {
            throw new Error("Account is not connected");
        }
        return this.near.connectedAccount.signMessage({ message, nonce, recipient })
            .catch(async error => {
                if (error.message === "Popup blocked") {
                    await window.selector.ui.whenApprove({ title: "App asks you to sign a message", button: "Sign" });
                    return await this.near.connectedAccount.signMessage({ message, nonce, recipient });
                } else {
                    throw error;
                }
            });
    }
    async signAndSendTransaction({ network, signerId, receiverId, actions }) {
        if (!this.near.connectedAccount) {
            throw new Error("Account is not connected");
        }
        signerId = signerId ?? this.near.connectedAccount.accountId;

        actions.forEach(fixAction);
        const result = await this.near.connectedAccount.sendTransactions([{ signerId, receiverId, actions }]);
        return result.outcomes[0];
    }
    async signAndSendTransactions({ network, transactions }) {
        if (!this.near.connectedAccount) {
            throw new Error("Account is not connected");
        }
        transactions = transactions.map(t => {
            t.actions.forEach(fixAction);
            return {
                signerId: t.signerId ?? this.near.connectedAccount.accountId,
                receiverId: t.receiverId,
                actions: t.actions,
            };
        });
        const result = await this.near.connectedAccount.sendTransactions(transactions);
        return result.outcomes;
    }
}

async function initialize() {
    return new IntearWalletAdapter(await IntearWalletConnector.loadFrom(selectorStorage));
};

function fixAction(action) {
    if (action.params?.code instanceof Uint8Array) {
        action.params.code = Array.from(action.params.code);
    }
    if (action.deployContract?.code instanceof Uint8Array) {
        action.deployContract.code = Array.from(action.deployContract.code);
    }
    if (action.deployGlobalContract?.code instanceof Uint8Array) {
        action.deployGlobalContract.code = Array.from(action.deployGlobalContract.code);
    }
}

initialize().then(wallet => {
    window.selector.ready(wallet);
});
