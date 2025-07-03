import { default as LedgerTransportU2F } from '@ledgerhq/hw-transport-u2f';
import { default as LedgerTransportWebUsb } from '@ledgerhq/hw-transport-webusb';
import { default as LedgerTransportWebHid } from '@ledgerhq/hw-transport-webhid';
import { default as LedgerTransportWebAuthn } from '@ledgerhq/hw-transport-webauthn';
import { default as LedgerTransportWebBle } from '@ledgerhq/hw-transport-web-ble';
import platform from 'platform';

let ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => {
    ENABLE_DEBUG_LOGGING && console.log(...args)
};

// Fallback order inspired by https://github.com/vacuumlabs/adalite
async function isWebUsbSupported() {
    try {
        const isSupported = await LedgerTransportWebUsb.isSupported();
        return isSupported && platform.os.family !== 'Windows' && platform.name !== 'Opera';
    } catch (e) {
        return false;
    }
}

async function isWebHidSupported() {
    return LedgerTransportWebHid.isSupported()
        .catch(() => false);
}

async function isU2fSupported() {
    return LedgerTransportU2F.isSupported()
        .catch(() => false);
}

async function isWebAuthnSupported() {
    return LedgerTransportWebAuthn.isSupported()
        .catch(() => false);
}

async function isWebBleSupported() {
    return LedgerTransportWebBle.isSupported()
        .catch(() => false);
}

async function createSupportedTransport() {
    const [
        supportWebHid,
        supportWebUsb,
        supportU2f,
        supportWebAuthn,
        supportWebBle
    ] = await Promise.all([
        isWebHidSupported(),
        isWebUsbSupported(),
        isU2fSupported(),
        isWebAuthnSupported(),
        isWebBleSupported()
    ]);

    debugLog("Transports supported:", { supportWebHid, supportWebUsb, supportU2f, supportWebAuthn, supportWebBle });

    if (!supportWebHid && !supportWebUsb && !supportU2f && !supportWebAuthn && !supportWebBle) {
        const err = new Error('No transports appear to be supported.');
        err.name = 'NoTransportSupported';
        throw err;
    }

    // Sometimes transports return true for `isSupported()`, but are proven broken when attempting to `create()` them.
    // We will try each transport we think is supported in the current environment, in order of this array
    const supportedTransports = [
        // WebHID is still supported by latest Chrome, so try that first
        ...(supportWebHid ? [{ name: 'WebHID', createTransport: () => LedgerTransportWebHid.create() }] : []),

        ...(supportWebUsb ? [{ name: 'WebUSB', createTransport: () => LedgerTransportWebUsb.create() }] : []),

        // Web Bluetooth for mobile devices and environments where USB/HID isn't available
        ...(supportWebBle ? [{ name: 'WebBLE', createTransport: () => LedgerTransportWebBle.create() }] : []),

        // Firefox/Mozilla intend to not support WebHID or WebUSB
        ...(supportU2f ? [{ name: 'U2F', createTransport: () => LedgerTransportU2F.create() }] : []),

        // Firefox doesn't support U2F anymore, so use WebAuthn as last fallback
        ...(supportWebAuthn ? [{ name: 'WebAuthn', createTransport: () => LedgerTransportWebAuthn.create() }] : []),
    ]

    let transport = null;
    let errors = [];

    for (let i = 0; i < supportedTransports.length && !transport; i += 1) {
        const { name, createTransport } = supportedTransports[i];
        debugLog(`Creating ${name} transport`)
        try {
            transport = await createTransport();
        } catch (err) {
            if (err.name === 'InvalidStateError') {
                throw err;
            }

            console.warn(`Failed to create ${name} transport.`, err);
            errors.push({ name: err.name, message: err.message });
        }
    }

    return [errors, transport];
}

export const setDebugLogging = (value) => ENABLE_DEBUG_LOGGING = value;
export async function getSupportedTransport() {
    const [errors, transport] = await createSupportedTransport();

    if (errors && !transport) {
        console.error('Failed to initialize ledger transport', { errors });
        throw errors[errors.length - 1];
    }

    if (transport) { debugLog('Ledger transport created!', transport); }

    return transport;
}
