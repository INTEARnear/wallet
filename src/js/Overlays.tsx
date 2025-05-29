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

export default function Overlays() {
    const [showEthereumWalletConnector, setShowEthereumWalletConnector] = useState<EthereumSignatureRequest | null>(null);
    const onEthereumWalletSignature = useCallback((signature: string | null) => {
        window.postMessage({
            type: "ethereum-wallet-signature",
            signature,
        } as EthereumSignatureResponse, window.location.origin);
        setShowEthereumWalletConnector(null);
    }, []);

    useEffect(() => {
        window.addEventListener("message", (event) => {
            switch (event.data.type) {
                case "request-ethereum-wallet-signature":
                    setShowEthereumWalletConnector(event.data);
                    break;
                default:
                    break;
            }
        });
    }, []);

    const EthereumWalletConnector = React.lazy(() => import("./EthereumWalletConnector"));

    return <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none">
        {showEthereumWalletConnector && <Suspense>
            <EthereumWalletConnector messageToSign={showEthereumWalletConnector.messageToSign} onSignature={onEthereumWalletSignature} />
        </Suspense>}
    </div>;
}
