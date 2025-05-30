import React from "react";
import { createAppKit, useAppKit, useAppKitAccount } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useEffect } from "react";
import { useSignMessage, useDisconnect } from 'wagmi'

const queryClient = new QueryClient()

const projectId = '939345e3a30974b284f27b6a7918736f'

const metadata = {
    name: 'Intear Wallet',
    description: 'Intear Wallet',
    url: 'https://wallet.intear.tech',
    icons: ['/favicon.svg']
}

const wagmiAdapter = new WagmiAdapter({
    networks: [mainnet],
    projectId,
    ssr: false
});

createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet],
    projectId,
    metadata,
    features: {
        analytics: false,
        socials: false,
    },
    themeMode: 'dark',
})

function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

function EthereumSigner({ messageToSign, onSignature }: { messageToSign: string, onSignature: (signature: string | null, message: string) => void }) {
    const eip155Account = useAppKitAccount({ namespace: "eip155" });
    const { open } = useAppKit();
    const { signMessage, data: signature, error } = useSignMessage();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (signature) {
            onSignature(signature, messageToSign);
            disconnect();
        }
    }, [signature, onSignature, disconnect]);

    useEffect(() => {
        if (error) {
            console.error('Signing error:', error);
            onSignature(null, messageToSign);
            disconnect();
        }
    }, [error, onSignature]);

    const handleSign = async () => {
        try {
            await signMessage({ message: messageToSign });
        } catch (err) {
            console.error('Failed to sign message:', err);
            onSignature(null, messageToSign);
        }
    };

    useEffect(() => {
        if (eip155Account.isConnected && messageToSign) {
            handleSign()
                .catch((err) => {
                    console.error('Failed to sign message:', err);
                    onSignature(null, messageToSign);
                    disconnect();
                });
        }
        if (!eip155Account.isConnected && messageToSign) {
            open({
                view: 'Connect',
                namespace: 'eip155'
            });
            let hasAppeared = false;
            const interval = setInterval(() => {
                const modal = document.getElementsByTagName("w3m-modal")[0];
                const exists = modal && modal.className === 'open';
                if (!exists) {
                    if (hasAppeared) {
                        clearInterval(interval);
                        onSignature(null, messageToSign);
                    }
                } else {
                    hasAppeared = true;
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [eip155Account.isConnected, messageToSign]);

    return (
        <>
            {/* Everything is handled by AppKit */}
        </>
    );
}

export default function EthereumWalletConnector({ messageToSign, onSignature }: { messageToSign: string, onSignature: (signature: string | null, message: string) => void }) {
    return (
        <AppKitProvider>
            <EthereumSigner messageToSign={messageToSign} onSignature={onSignature} />
        </AppKitProvider>
    );
}
