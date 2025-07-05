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

Object.defineProperty(window, "localStorage", {
    value: {
        getItem: async (key) => {
            return await window.selector.storage.get(key);
        },
        setItem: async (key, value) => {
            return await window.selector.storage.set(key, value);
        },
        removeItem: async (key) => {
            return await window.selector.storage.remove(key);
        },
        clear: async () => {
            for (const key of await window.selector.storage.keys()) {
                await window.selector.storage.remove(key);
            }
        },
    },
});
Object.defineProperty(window, "open", {
    value: function (url, newTab, options) {
        console.log("open", url);
        return window.selector.open(url, newTab, options);
    },
});

async function initialize() {
    // Fastintear uses window.localStorage, so need to patch it **before** importing
    const near = await import("https://wallet.intear.tech/near-selector-fastintear-modified.js");
    return {
        async signIn({ network, contractId, methodNames, successUrl, failureUrl }) {
            near.config({ networkId: network });
            await window.selector.ui.whenApprove({ title: "Sign in", button: "Open wallet" });
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
            const result = await near.adapter.sendTransactions({ transactions: [{ signerId, receiverId, actions }] });
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
            const result = await near.adapter.sendTransactions({ transactions });
            return result.outcomes.map(toObject);
        },
    };
};

initialize().then(wallet => {
    window.selector.ready(wallet);
});
