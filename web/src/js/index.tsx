import React from "react";
import { createRoot } from "react-dom/client";
import Overlays from "./Overlays";
import { createClient as createLedgerClient, getSupportedTransport as getSupportedLedgerTransport } from "./near-ledger-js";
import { toObject } from "./utils";
import "./qr-generator.js";

// Analytics

const posthog_api_key = "{{{POSTHOG_API_KEY}}}";
// It's public, but we don't want self-hosted environments to send analytics
if (!posthog_api_key.startsWith("{{{")) {
    const config = localStorage.getItem("wallet_config");
    if (config && !JSON.parse(config).analytics_disabled) {
        const { posthog } = await import("posthog-js");
        posthog.init(posthog_api_key,
            {
                api_host: "https://eu.i.posthog.com",
                person_profiles: "identified_only",
            }
        );
    }
}

// Non-near wallet modals

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);

const root = createRoot(rootElement);
root.render(<Overlays />);

// Ripple effect

let currentRipple: HTMLSpanElement | null = null;

function createRipple(event: TouchEvent, element: HTMLElement) {
    element.querySelectorAll('.ripple-circle').forEach(ripple => ripple.remove());

    const rect = element.getBoundingClientRect();

    const x = (event.touches?.[0] || event).clientX - rect.left;
    const y = (event.touches?.[0] || event).clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-circle';

    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.appendChild(ripple);

    currentRipple = ripple;
}

function handleTouchStart(event) {
    const element = event.target?.closest('a:not(.no-mobile-ripple), button:not(.no-mobile-ripple):not(:disabled), .mobile-ripple');
    if (!element) return;
    if (currentRipple) {
        currentRipple.remove();
        currentRipple = null;
    }
    createRipple(event, element);
}

function handleContextMenu(event) {
    const element = event.target.closest('a:not(.no-mobile-ripple), button:not(.no-mobile-ripple):not(:disabled), .mobile-ripple');
    if (!element) return;

    const activeRipple = element.querySelector('.ripple-circle');
    if (activeRipple) {
        event.preventDefault();
        event.stopPropagation();
    }
}

function handleTouchEnd() {
    if (currentRipple) {
        const ripple = currentRipple;
        currentRipple = null;
        ripple.style.opacity = '0';
        setTimeout(() => {
            ripple.remove();
        }, 5000);
    }
}

document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('contextmenu', handleContextMenu, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

// Ledger bindings

function getLedgerClient() {
    return (globalThis as any).ledgerClient;
}

function setLedgerClient(ledgerClient: any) {
    (globalThis as any).ledgerClient = ledgerClient;
}

async function connectLedger() {
    const transport = await getSupportedLedgerTransport()
        .catch(error => {
            console.error('Error getting supported ledger transport: ', JSON.stringify(error))
            throw error.name;
        });
    if (transport === null) {
        return;
    }
    (transport as any).setScrambleKey?.("NEAR")
    const ledgerClient = await createLedgerClient(transport)
        .catch(error => {
            console.error('Error connecting to Ledger device: ', JSON.stringify(error))
            throw error.statusCode ?? error.name;
        });
    if (ledgerClient === null) {
        return;
    }
    setLedgerClient(ledgerClient);
    return ledgerClient;
}

window.addEventListener('message', async (event) => {
    if (event.origin !== window.location.origin) {
        return;
    }
    let data = event.data;
    try {
        data = toObject(data);
    } catch {
    }
    if (data.type === 'ledger-connect') {
        const localLedgerClient = await connectLedger()
            .catch(error => {
                window.postMessage({ type: 'ledger-connect-error', error }, window.location.origin);
                return null;
            });
        if (!localLedgerClient) {
            setLedgerClient(null);
            return;
        }
        setLedgerClient(localLedgerClient);
        window.postMessage({ type: 'ledger-connected' }, window.location.origin)
    } else if (data.type === 'ledger-get-public-key') {
        let localLedgerClient = getLedgerClient();
        if (!localLedgerClient) {
            localLedgerClient = await connectLedger()
                .catch(error => {
                    window.postMessage({ type: 'ledger-get-public-key-error', error: error }, window.location.origin);
                    return null;
                });
        }
        if (!localLedgerClient) {
            console.error('Ledger client not found')
            return;
        }

        const { path } = data;
        const key = await localLedgerClient.getPublicKey(path)
            .catch(error => {
                console.error('Error getting public key: ', JSON.stringify(error))
                window.postMessage({ type: 'ledger-get-public-key-error', error: error.statusCode ?? error.name }, window.location.origin);
                localLedgerClient.transport.close();
                setLedgerClient(null);
                return null;
            });
        if (key === null) {
            return;
        }
        window.postMessage({
            type: 'ledger-public-key',
            path,
            key: [...key],
        }, window.location.origin)
    } else if (data.type === 'ledger-sign') {
        let localLedgerClient = getLedgerClient();
        if (!localLedgerClient) {
            localLedgerClient = await connectLedger()
                .catch(error => {
                    window.postMessage({ type: 'ledger-sign-error', error: error }, window.location.origin);
                    return null;
                });
        }
        if (!localLedgerClient) {
            console.error('Ledger client not found')
            return;
        }

        const { path, messageToSign, id } = data;
        const signature = await localLedgerClient.sign(messageToSign, path)
            .catch(error => {
                console.error('Error signing message: ', JSON.stringify(error))
                window.postMessage({ type: 'ledger-sign-error', error: error.statusCode ?? error.name }, window.location.origin);
                localLedgerClient.transport.close();
                setLedgerClient(null);
                return null;
            });
        if (signature === null) {
            return;
        }
        window.postMessage({
            type: 'ledger-signature',
            path,
            signature: [...signature],
            id,
        }, window.location.origin)
    }
});

window.addEventListener("message", (event) => {
    if (event.data.type === "chatwoot-open") {
        if ((window as any).$chatwoot) {
            (window as any).$chatwoot.toggle('open');
            (window as any).$chatwoot.setConversationCustomAttributes({ account_id: event.data.accountId })
        } else {
            const BASE_URL = "https://app.chatwoot.com";
            const script = document.createElement("script");
            const firstScriptInBody = document.getElementsByTagName("script")[0];
            script.src = BASE_URL + "/packs/js/sdk.js";
            script.async = true;
            firstScriptInBody.parentNode?.insertBefore(script, firstScriptInBody);
            script.onload = function () {
                (window as any).chatwootSDK.run({
                    websiteToken: 'eUJ4pSCSbXv2dhMiwvX2rjud',
                    baseUrl: BASE_URL
                })
                let interval = setInterval(() => {
                    if (document.getElementById("cw-bubble-holder")) {
                        (window as any).$chatwoot.toggleBubbleVisibility('hide');
                        (window as any).$chatwoot.toggle('open');
                        (window as any).$chatwoot.setConversationCustomAttributes({ account_id: event.data.accountId });
                        clearInterval(interval)
                    }
                }, 3);
            }
        }
    }
});

// Prevent link dragging
document.addEventListener('dragstart', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
        event.preventDefault();
    }
});

// Tauri event listeners for hide/show screen
if ((window as any).__TAURI__) {
    try {
        const tauri = (window as any).__TAURI__;
        const eventApi = tauri?.event || tauri?.core?.event;

        const overlay = document.createElement('div');
        overlay.id = 'wallet-unlock-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 999999;
        `;

        const button = document.createElement('button');
        button.textContent = 'Unlock Wallet';
        button.style.cssText = `
            padding: 20px 60px;
            font-size: 24px;
            font-weight: bold;
            background-color: #333333;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        button.addEventListener('click', async () => {
            tauri.core.invoke('get_os_encryption_key');
        });

        overlay.appendChild(button);
        document.body.appendChild(overlay);

        if (eventApi && typeof eventApi.listen === 'function') {
            eventApi.listen('hide', () => {
                const contentWrapper = document.getElementById('content-wrapper');
                if (contentWrapper) {
                    contentWrapper.style.visibility = 'hidden';
                }
                overlay.style.display = 'flex';
                overlay.style.visibility = 'visible';
            });

            eventApi.listen('show', () => {
                const contentWrapper = document.getElementById('content-wrapper');
                if (contentWrapper) {
                    contentWrapper.style.visibility = 'visible';
                }
                overlay.style.display = 'none';
            });
        } else {
            console.warn('Tauri event API not available. Screen hide/show events will not work.');
        }
    } catch (err: any) {
        console.error('Failed to set up Tauri event listeners:', err);
    }
}
