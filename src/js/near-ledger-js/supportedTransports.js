import { default as LedgerTransportWebUsb } from '@ledgerhq/hw-transport-webusb';
import { default as LedgerTransportWebHid } from '@ledgerhq/hw-transport-webhid';
import { default as LedgerTransportWebBle } from '@ledgerhq/hw-transport-web-ble';
import { default as LedgerTransportWebAuthn } from '@ledgerhq/hw-transport-webauthn';

let ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => {
    ENABLE_DEBUG_LOGGING && console.log(...args)
};

async function isWebHidSupported() {
    try {
        const isSupported = await LedgerTransportWebHid.isSupported();
        return isSupported;
    } catch (e) {
        return false;
    }
}

async function isWebUsbSupported() {
    try {
        const isSupported = await LedgerTransportWebUsb.isSupported();
        return isSupported;
    } catch (e) {
        return false;
    }
}

async function isWebBleSupported() {
    try {
        const isSupported = await LedgerTransportWebBle.isSupported();
        return isSupported;
    } catch (e) {
        return false;
    }
}

async function isWebAuthnSupported() {
    try {
        const isSupported = await LedgerTransportWebAuthn.isSupported();
        return isSupported;
    } catch (e) {
        return false;
    }
}

async function createSupportedTransport() {
    const [
        supportWebHid,
        supportWebUsb,
        supportWebBle,
        supportWebAuthn,
    ] = await Promise.all([
        isWebHidSupported(),
        isWebUsbSupported(),
        isWebBleSupported(),
        isWebAuthnSupported()
    ]);

    debugLog("Transports supported:", { supportWebHid, supportWebUsb, supportWebBle, supportWebAuthn });

    if (!supportWebHid && !supportWebUsb && !supportWebBle && !supportWebAuthn) {
        const err = new Error('No transports appear to be supported.');
        err.name = 'NoTransportSupported';
        throw err;
    }

    // Sometimes transports return true for `isSupported()`, but are proven broken when attempting to `create()` them.
    // We will try each transport we think is supported in the current environment, in order of this array
    const supportedTransports = [
        ...(supportWebHid ? [{ name: 'WebHID', createTransport: () => LedgerTransportWebHid.create() }] : []),
        ...(supportWebUsb ? [{ name: 'WebUSB', createTransport: () => LedgerTransportWebUsb.create() }] : []),
        ...(supportWebBle ? [{ name: 'WebBLE', createTransport: () => LedgerTransportWebBle.create() }] : []),
        ...(supportWebAuthn ? [{ name: 'WebAuthn', createTransport: () => LedgerTransportWebAuthn.create() }] : []),
    ]

    let transport = null;
    let errors = [];

    for (let i = 0; i < supportedTransports.length && !transport; i += 1) {
        const { name, createTransport } = supportedTransports[i];
        debugLog(`Creating ${name} transport`)
        try {
            transport = await createTransport();
            if (transport) {
                break;
            }
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
