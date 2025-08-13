import React from "react";
import { createRoot } from "react-dom/client";
import Overlays from "./Overlays";
import { createClient as createLedgerClient, getSupportedTransport as getSupportedLedgerTransport } from "./near-ledger-js";
import { toObject } from "./utils";

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
            (window as any).$chatwoot.toggle('open')
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
                        (window as any).$chatwoot.setConversationCustomAttributes({ account_id: event.data.accountId })
                        clearInterval(interval)
                    }
                }, 3);
            }
        }
    }
});
