import React from "react";
import { Suspense } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { toObject } from "./utils";

type EthereumSignatureRequest = {
    type: "request-ethereum-wallet-signature";
    messageToSign: string;
}

type EthereumSignatureResponse = {
    type: "ethereum-wallet-signature";
    signature: string;
}

type EthereumConnectionRequest = {
    type: "request-ethereum-wallet-connection";
}

type EthereumConnectionResponse = {
    type: "ethereum-wallet-connection";
    address: string | null;
}

type SolanaSignatureRequest = {
    type: "request-solana-wallet-signature";
    messageToSign: string;
}

type SolanaSignatureResponse = {
    type: "solana-wallet-signature";
    signature: number[] | null;
    message: string;
    address: string | null;
}

type SolanaConnectionRequest = {
    type: "request-solana-wallet-connection";
}

type SolanaConnectionResponse = {
    type: "solana-wallet-connection";
    address: string | null;
}

export default function Overlays() {
    const [ethereumSignatureRequest, setEthereumSignatureRequest] = useState<EthereumSignatureRequest | null>(null);
    const [ethereumConnectionRequest, setEthereumConnectionRequest] = useState<EthereumConnectionRequest | null>(null);
    const [solanaSignatureRequest, setSolanaSignatureRequest] = useState<SolanaSignatureRequest | null>(null);
    const [solanaConnectionRequest, setSolanaConnectionRequest] = useState<SolanaConnectionRequest | null>(null);

    const onEthereumWalletSignature = useCallback((signature: string | null, message: string) => {
        window.postMessage({
            type: "ethereum-wallet-signature",
            signature,
            message,
        } as EthereumSignatureResponse, window.location.origin);
        setEthereumSignatureRequest(null);
    }, []);

    const onEthereumWalletConnection = useCallback((address: string | null) => {
        window.postMessage({
            type: "ethereum-wallet-connection",
            address,
        } as EthereumConnectionResponse, window.location.origin);
        setEthereumConnectionRequest(null);
    }, []);

    const onSolanaWalletSignature = useCallback((signature: Uint8Array | null, message: string, address: string | null) => {
        window.postMessage({
            type: "solana-wallet-signature",
            signature: signature ? Array.from(signature) : null,
            message,
            address,
        } as SolanaSignatureResponse, window.location.origin);
        setSolanaSignatureRequest(null);
    }, []);

    const onSolanaWalletConnection = useCallback((address: string | null) => {
        window.postMessage({
            type: "solana-wallet-connection",
            address,
        } as SolanaConnectionResponse, window.location.origin);
        setSolanaConnectionRequest(null);
    }, []);

    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            let data = event.data;
            try {
                data = toObject(data);
            } catch {
            }
            switch (data.type) {
                case "request-ethereum-wallet-signature":
                    setEthereumSignatureRequest(data);
                    break;
                case "request-ethereum-wallet-connection":
                    setEthereumConnectionRequest(data);
                    break;
                case "request-solana-wallet-signature":
                    setSolanaSignatureRequest(data);
                    break;
                case "request-solana-wallet-connection":
                    setSolanaConnectionRequest(data);
                    break;
                default:
                    break;
            }
        });
    }, []);

    const EthereumWallet = React.lazy(() => import("./EthereumConnector"));
    const SolanaWallet = React.lazy(() => import("./SolanaConnector"));

    return <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none">
        {(ethereumSignatureRequest || ethereumConnectionRequest) && <Suspense>
            <EthereumWallet messageToSign={ethereumSignatureRequest?.messageToSign} onSignature={onEthereumWalletSignature} onConnection={onEthereumWalletConnection} needsSignIn={!!ethereumConnectionRequest} />
        </Suspense>}
        {(solanaSignatureRequest || solanaConnectionRequest) && <Suspense>
            <SolanaWallet messageToSign={solanaSignatureRequest?.messageToSign} onSignature={onSolanaWalletSignature} onConnection={onSolanaWalletConnection} needsSignIn={!!solanaConnectionRequest} />
        </Suspense>}
    </div>;
}
