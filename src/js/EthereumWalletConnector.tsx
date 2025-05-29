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
    icons: ['https://assets.reown.com/reown-profile-pic.png']
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
    }
})

function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

function EthereumSigner({ messageToSign, onSignature }: { messageToSign: string, onSignature: (signature: string | null) => void }) {
    const eip155Account = useAppKitAccount({ namespace: "eip155" });
    const { open } = useAppKit();
    const { signMessage, data: signature, error, isPending } = useSignMessage();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (signature) {
            onSignature(signature);
            // Disconnect wallet after signature is received
            disconnect();
        }
    }, [signature, onSignature, disconnect]);

    useEffect(() => {
        if (error) {
            console.error('Signing error:', error);
            onSignature(null);
        }
    }, [error, onSignature]);

    const handleSign = async () => {
        try {
            await signMessage({ message: messageToSign });
        } catch (err) {
            console.error('Failed to sign message:', err);
            onSignature(null);
        }
    };

    useEffect(() => {
        if (eip155Account.isConnected && messageToSign) {
            handleSign();
        }
        if (!eip155Account.isConnected && messageToSign) {
            // Open wallet connection modal
            open({
                view: 'Connect',
                namespace: 'eip155'
            });
            return;
        }
    }, [eip155Account.isConnected, messageToSign]);

    return (
        <>
            {/* Everything is handled by AppKit */}
        </>
    );
}

export default function EthereumWalletConnector({ messageToSign, onSignature }: { messageToSign: string, onSignature: (signature: string | null) => void }) {
    return <AppKitProvider>
        <EthereumSigner messageToSign={messageToSign} onSignature={onSignature} />
    </AppKitProvider>
}
