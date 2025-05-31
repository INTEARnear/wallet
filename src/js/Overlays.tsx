import React from "react";
import { Suspense } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

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

export default function Overlays() {
    const [ethereumSignatureRequest, setEthereumSignatureRequest] = useState<EthereumSignatureRequest | null>(null);
    const [ethereumConnectionRequest, setEthereumConnectionRequest] = useState<EthereumConnectionRequest | null>(null);

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

    useEffect(() => {
        window.addEventListener("message", (event) => {
            let data = event.data;
            try {
                data = Object.fromEntries(data);
            } catch {
            }
            switch (data.type) {
                case "request-ethereum-wallet-signature":
                    setEthereumSignatureRequest(data);
                    break;
                case "request-ethereum-wallet-connection":
                    setEthereumConnectionRequest(data);
                    break;
                default:
                    break;
            }
        });
    }, []);

    const EthereumWallet = React.lazy(() => import("./EthereumConnector"));

    return <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none">
        {(ethereumSignatureRequest || ethereumConnectionRequest) && <Suspense>
            <EthereumWallet messageToSign={ethereumSignatureRequest?.messageToSign} onSignature={onEthereumWalletSignature} onConnection={onEthereumWalletConnection} needsSignIn={!!ethereumConnectionRequest} />
        </Suspense>}
    </div>;
}
