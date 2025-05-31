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
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

function EthereumSigner({ messageToSign, onSignature }: { messageToSign: string, onSignature: (signature: string | null, message: string) => void }) {
    const eip155Account = useAppKitAccount({ namespace: "eip155" });
    const { open } = useAppKit();
    const { disconnect } = useDisconnect();
    const { signMessage, data: signature, error } = useSignMessage();

    useEffect(() => {
        if (signature) {
            onSignature(signature, messageToSign);
        }
    }, [signature, onSignature]);

    useEffect(() => {
        if (error) {
            console.error('Signing error:', error);
            onSignature(null, messageToSign);
            disconnect();
        }
    }, [error, onSignature, disconnect]);

    useEffect(() => {
        if (eip155Account.isConnected && messageToSign) {
            signMessage({ message: messageToSign });
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

function EthereumConnector({ onConnection }: { onConnection: (address: string | null) => void }) {
    const eip155Account = useAppKitAccount({ namespace: "eip155" });
    const { open, close } = useAppKit();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        disconnect();
    }, []);

    useEffect(() => {
        if (eip155Account.isConnected && eip155Account.address) {
            const address = eip155Account.address;
            console.log(address);
            onConnection(address);
            close();
        }
    }, [eip155Account.isConnected, eip155Account.address, onConnection]);

    useEffect(() => {
        if (!eip155Account.isConnected) {
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
                        onConnection(null);
                    }
                } else {
                    hasAppeared = true;
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [eip155Account.isConnected, onConnection]);

    return (
        <>
            {/* Everything is handled by AppKit */}
        </>
    );
}

export default function EthereumWallet({ 
    messageToSign, 
    onSignature, 
    needsSignIn, 
    onConnection 
}: { 
    messageToSign: string, 
    onSignature: (signature: string | null, message: string) => void,
    needsSignIn?: boolean,
    onConnection: (address: string | null) => void 
}) {
    return (
        <AppKitProvider>
            {messageToSign && <EthereumSigner messageToSign={messageToSign} onSignature={onSignature} />}
            {needsSignIn && <EthereumConnector onConnection={onConnection} />}
        </AppKitProvider>
    );
}
