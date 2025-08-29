import "./near-selector-globals.js";
import * as near from "fastintear/packages/api";

function toObject(obj) {
    return obj instanceof Map ? Object.fromEntries(
        Array.from(obj, ([key, value]) => [
            key,
            value instanceof Map ? toObject(value) :
                Array.isArray(value) ? value.map(v => v instanceof Map ? toObject(v) : v) :
                    value
        ])
    ) : obj;
}

async function initialize() {
    return {
        async signIn({ network, contractId, methodNames, successUrl, failureUrl }) {
            near.config({ networkId: network });
            window.selector.ui.showIframe();
            await near.requestSignIn();
            if (near.accountId() && near.publicKey()) {
                return [{
                    accountId: near.accountId(),
                    publicKey: near.publicKey(),
                }]
            } else {
                throw new Error("Connection failed");
            }
        },
        async signOut({ network }) {
            console.log("signOut");
            if (near.config().networkId !== network) {
                // Do nothing
                return;
            }
            near.signOut();
        },
        async getAccounts({ network }) {
            console.log("getAccounts");
            if (near.config().networkId && near.config().networkId !== network) {
                throw new Error("Network mismatch");
            }
            if (near.accountId() && near.publicKey()) {
                return [{
                    accountId: near.accountId(),
                    publicKey: near.publicKey(),
                }]
            } else {
                return [];
            }
        },
        async signMessage({ network, message, nonce, recipient }) {
            console.log("signMessage");
            if (near.config().networkId !== network) {
                throw new Error("Network mismatch");
            }
            return await near.signMessage({ message, nonce, recipient });
        },
        async signAndSendTransaction({ network, signerId, receiverId, actions }) {
            console.log("signAndSendTransaction");
            if (near.config().networkId !== network) {
                throw new Error("Network mismatch");
            }
            signerId = signerId ?? near.accountId();
            const result = await near.state._adapter.sendTransactions({ transactions: [{ signerId, receiverId, actions }] });
            return toObject(result.outcomes[0]);
        },
        async signAndSendTransactions({ network, transactions }) {
            console.log("signAndSendTransactions");
            if (near.config().networkId !== network) {
                throw new Error("Network mismatch");
            }
            transactions = transactions.map(t => ({
                signerId: t.signerId ?? near.accountId(),
                receiverId: t.receiverId,
                actions: t.actions,
            }));
            const result = await near.state._adapter.sendTransactions({ transactions });
            return result.outcomes.map(toObject);
        },
    };
};

initialize().then(wallet => {
    window.selector.ready(wallet);
});
