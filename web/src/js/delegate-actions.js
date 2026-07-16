export function validateBlockHeightTtl(blockHeightTtl) {
    if (blockHeightTtl === undefined) {
        return undefined;
    }
    if (!Number.isSafeInteger(blockHeightTtl) || blockHeightTtl <= 0) {
        throw new TypeError("blockHeightTtl must be a positive safe integer");
    }
    return blockHeightTtl;
}

export function withBlockHeightTtl(transaction, blockHeightTtl) {
    const validatedTtl = validateBlockHeightTtl(blockHeightTtl);
    if (validatedTtl === undefined) {
        return transaction;
    }
    return {
        ...transaction,
        blockHeightTtl: validatedTtl,
    };
}

export function canonicalizeSignedDelegateActions(signedDelegateActions) {
    if (!Array.isArray(signedDelegateActions)) {
        throw new TypeError("Wallet returned malformed signed delegate actions");
    }
    return signedDelegateActions.map((signedDelegateAction, index) => {
        const borshSerializedBase64 = signedDelegateAction?.borshSerializedBase64;
        if (typeof borshSerializedBase64 !== "string" || borshSerializedBase64.length === 0) {
            throw new TypeError(`Wallet returned a malformed signed delegate action at index ${index}`);
        }
        return { borshSerializedBase64 };
    });
}
