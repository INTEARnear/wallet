import { default as LedgerTransportWebUsb } from '@ledgerhq/hw-transport-webusb';
import { default as LedgerTransportWebHid } from '@ledgerhq/hw-transport-webhid';
import { default as LedgerTransportWebBle } from '@ledgerhq/hw-transport-web-ble';

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

async function createSupportedTransport() {
    const [
        supportWebHid,
        supportWebUsb,
        supportWebBle,
    ] = await Promise.all([
        isWebHidSupported(),
        isWebUsbSupported(),
        isWebBleSupported(),
    ]);

    debugLog("Transports supported:", { supportWebHid, supportWebUsb, supportWebBle });

    if (!supportWebHid && !supportWebUsb && !supportWebBle) {
        const err = new Error('No transports appear to be supported.');
        err.name = 'NoTransportSupported';
        throw err;
    }

    // Sometimes transports return true for `isSupported()`, but are proven broken when attempting to `create()` them.
    // We will try each transport we think is supported in the current environment, in order of this array
    const supportedTransports = [
        ...(supportWebHid ? [{ name: 'WebHID', createTransport: () => LedgerTransportWebHid.create() }] : []),
        ...(supportWebBle ? [{ name: 'WebBLE', createTransport: () => LedgerTransportWebBle.create() }] : []),
        ...(supportWebUsb ? [{ name: 'WebUSB', createTransport: () => LedgerTransportWebUsb.create() }] : []),
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

export async function getSupportedTransport(mode) {
    console.log('Using Ledger mode', mode);
    if (mode === 'Disabled') {
        const err = new Error('Please choose a Ledger connection method.');
        err.name = 'LedgerDisabled';
        throw err;
    }

    debugLog(`Attempting to create specific transport: ${mode}`);

    let transport = null;
    try {
        if (mode === 'WebHID') {
            const isSupported = await isWebHidSupported();
            if (!isSupported) {
                const err = new Error('WebHID is not supported in this browser.');
                err.name = 'WebHIDNotSupported';
                throw err;
            }
            transport = await LedgerTransportWebHid.create();
        } else if (mode === 'WebUSB') {
            const isSupported = await isWebUsbSupported();
            if (!isSupported) {
                const err = new Error('WebUSB is not supported in this browser.');
                err.name = 'WebUSBNotSupported';
                throw err;
            }
            transport = await LedgerTransportWebUsb.create();
        } else if (mode === 'WebBLE') {
            const isSupported = await isWebBleSupported();
            if (!isSupported) {
                const err = new Error('WebBLE is not supported in this browser.');
                err.name = 'WebBLENotSupported';
                throw err;
            }
            transport = await LedgerTransportWebBle.create();
        } else {
            const err = new Error(`Unknown transport mode: ${mode}`);
            err.name = 'UnknownTransportMode';
            throw err;
        }

        if (transport) {
            debugLog(`Successfully created ${mode} transport!`, transport);
            return transport;
        }
    } catch (err) {
        console.error(`Failed to create ${mode} transport:`, err);
        throw err;
    }
}
