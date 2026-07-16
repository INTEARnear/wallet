import assert from "node:assert/strict";
import test from "node:test";

import {
    canonicalizeSignedDelegateActions,
    validateBlockHeightTtl,
    withBlockHeightTtl,
} from "./delegate-actions.js";

test("forwards a positive safe block height TTL", () => {
    assert.deepEqual(
        withBlockHeightTtl({ receiverId: "wrap.testnet" }, 300),
        { receiverId: "wrap.testnet", blockHeightTtl: 300 },
    );
});

test("omits the TTL for legacy delegate requests", () => {
    const transaction = { receiverId: "wrap.testnet" };
    assert.equal(withBlockHeightTtl(transaction, undefined), transaction);
});

test("rejects invalid block height TTL values", () => {
    for (const value of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1, "300", null]) {
        assert.throws(
            () => validateBlockHeightTtl(value),
            /blockHeightTtl must be a positive safe integer/,
        );
    }
});

test("returns canonical signed delegate action objects", () => {
    assert.deepEqual(
        canonicalizeSignedDelegateActions([
            {
                borshSerializedBase64: "c2lnbmVkLWRlbGVnYXRl",
                delegateAction: { maxBlockHeight: 1_300 },
            },
        ]),
        [{ borshSerializedBase64: "c2lnbmVkLWRlbGVnYXRl" }],
    );
});

test("rejects malformed signed delegate action results", () => {
    assert.throws(
        () => canonicalizeSignedDelegateActions(undefined),
        /malformed signed delegate actions/,
    );
    assert.throws(
        () => canonicalizeSignedDelegateActions([{}]),
        /malformed signed delegate action at index 0/,
    );
});
