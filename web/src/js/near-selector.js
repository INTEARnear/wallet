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
        const result = await this.near.connectedAccount.signMessage({ message, nonce, recipient });
        if (result !== null) {
            return result;
        } else {
            throw new Error("User rejected the message");
        }
    }
    async signAndSendTransaction({ network, signerId, receiverId, actions }) {
        if (!this.near.connectedAccount) {
            throw new Error("Account is not connected");
        }
        signerId = signerId ?? this.near.connectedAccount.accountId;

        actions.forEach(fixAction);
        const result = await this.near.connectedAccount.sendTransactions([{ signerId, receiverId, actions }]);
        if (result !== null) {
            return result.outcomes[0];
        } else {
            throw new Error("User rejected the transaction");
        }
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
        if (result !== null) {
            return result.outcomes;
        } else {
            throw new Error("User rejected the transactions");
        }
    }
    async signDelegateActions({ network, signerId, delegateActions }) {
        if (!this.near.connectedAccount) {
            throw new Error("Account is not connected");
        }
        let transactions = delegateActions.map(da => {
            return {
                signerId,
                receiverId: da.delegateAction.receiverId,
                actions: da.delegateAction.actions,
            };
        });
        transactions = transactions.map(t => {
            t.actions.forEach(fixAction);
            return {
                signerId: t.signerId ?? this.near.connectedAccount.accountId,
                receiverId: t.receiverId,
                actions: t.actions,
            };
        });
        const result = await this.near.connectedAccount.sendTransactions(transactions, true);
        if (result !== null) {
            return {
                signedDelegateActions: result.signedDelegateActions.map(sda => sda.borshSerializedBase64)
            };
        } else {
            throw new Error("User rejected the transactions");
        }
    }
    async signInAndSignMessage({ network, contractId, methodNames, messageParams: { message, recipient, nonce } }) {
        if (this.near.connectedAccount) {
            await this.signOut({ network });
        }
        const result = await this.near.requestConnection({
            networkId: network,
            messageToSign: { message, nonce, recipient },
        }).catch(error => {
            console.error("Error in signIn", error);
            return null;
        });
        if (result === null) {
            return [];
        }
        return [{
            accountId: result.account.accountId,
            signedMessage: result.signedMessage,
            // TODO: public key?
        }];
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
