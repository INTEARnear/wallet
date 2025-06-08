import React, { useState } from "react";
import { createAppKit, useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from "react";
import { useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana/react'

const queryClient = new QueryClient()

const solanaWeb3JsAdapter = new SolanaAdapter()

const projectId = '939345e3a30974b284f27b6a7918736f'

const metadata = {
    name: 'Intear Wallet',
    description: 'Intear Wallet',
    url: 'https://wallet.intear.tech',
    icons: ['/favicon.svg']
}

createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solana],
    projectId,
    metadata,
    features: {
        analytics: false,
        socials: false,
        onramp: false,
        swaps: false,
        receive: false,
        send: false,
        email: false,
    },
    themeMode: 'dark',
})

function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

function SolanaSigner({ messageToSign, onSignature }: { messageToSign: string, onSignature: (signature: Uint8Array | null, message: string, address: string | null) => void }) {
    const solanaAccount = useAppKitAccount({ namespace: "solana" });
    const { open, close } = useAppKit();
    const { walletProvider } = useAppKitProvider<Provider>("solana");
    const [isSigning, setIsSigning] = useState(false);

    useEffect(() => {
        const signMessage = async () => {
            if (solanaAccount.isConnected && messageToSign && walletProvider) {
                try {
                    const encodedMessage = new TextEncoder().encode(messageToSign);
                    const signature = await walletProvider.signMessage(encodedMessage);
                    onSignature(signature, messageToSign, solanaAccount.address || null);
                    walletProvider.disconnect();
                    close();
                    setIsSigning(false);
                } catch (error) {
                    console.error('Signing error:', error);
                    onSignature(null, messageToSign, null);
                    walletProvider.disconnect();
                    close();
                    setIsSigning(false);
                }
            }
        };

        if (solanaAccount.isConnected && messageToSign && !isSigning) {
            setIsSigning(true);
            signMessage();
        }
        if (!solanaAccount.isConnected && messageToSign) {
            open({
                view: 'Connect'
            });
            let hasAppeared = false;
            const interval = setInterval(() => {
                const modal = document.getElementsByTagName("w3m-modal")[0];
                const exists = modal && modal.className === 'open';
                if (!exists) {
                    if (hasAppeared) {
                        clearInterval(interval);
                        onSignature(null, messageToSign, null);
                        walletProvider.disconnect();
                        close();
                    }
                } else {
                    hasAppeared = true;
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [solanaAccount.isConnected, messageToSign, walletProvider, onSignature, open, isSigning]);

    return (
        <>
            {/* Everything is handled by AppKit */}
        </>
    );
}

function SolanaConnector({ onConnection }: { onConnection: (address: string | null) => void }) {
    const solanaAccount = useAppKitAccount({ namespace: "solana" });
    const { open, close } = useAppKit();

    useEffect(() => {
        if (solanaAccount.isConnected && solanaAccount.address) {
            const address = solanaAccount.address;
            onConnection(address);
            close();
        }
    }, [solanaAccount.isConnected, solanaAccount.address, onConnection, close]);

    useEffect(() => {
        if (!solanaAccount.isConnected) {
            open({
                view: 'Connect'
            });
            let hasAppeared = false;
            const interval = setInterval(() => {
                const modal = document.getElementsByTagName("w3m-modal")[0];
                const exists = modal && modal.className === 'open';
                if (!exists) {
                    if (hasAppeared) {
                        clearInterval(interval);
                        onConnection(null);
                    }
                } else {
                    hasAppeared = true;
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [solanaAccount.isConnected, onConnection, open]);

    return (
        <>
            {/* Everything is handled by AppKit */}
        </>
    );
}

export default function SolanaWallet({
    messageToSign,
    onSignature,
    needsSignIn,
    onConnection
}: {
    messageToSign: string,
    onSignature: (signature: Uint8Array | null, message: string, address: string | null) => void,
    needsSignIn?: boolean,
    onConnection: (address: string | null) => void
}) {
    return (
        <AppKitProvider>
            {messageToSign && <SolanaSigner messageToSign={messageToSign} onSignature={onSignature} />}
            {needsSignIn && <SolanaConnector onConnection={onConnection} />}
        </AppKitProvider>
    );
} 