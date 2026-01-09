import { default as LedgerTransportWebUsb } from '@ledgerhq/hw-transport-webusb';
import { default as LedgerTransportWebHid } from '@ledgerhq/hw-transport-webhid';
import { default as LedgerTransportWebBle } from '@ledgerhq/hw-transport-web-ble';
import { default as LedgerTransport } from '@ledgerhq/hw-transport';

// TODO: remove after fixing https://github.com/LedgerHQ/ledgerjs/issues/352#issuecomment-615917351
class LedgerTransportWebBleAndroidFix extends LedgerTransportWebBle {
    static async open(device, ...args) {
        if (!navigator.userAgent.includes('Mobi')) return super.open(device, ...args);
        const getPrimaryServicesOrig = device.gatt?.getPrimaryServices;
        if (getPrimaryServicesOrig == null) return super.open(device, ...args);
        device.gatt.getPrimaryServices = async () => {
            const [service] = await getPrimaryServicesOrig.call(device.gatt);
            const getCharacteristicOrig = service.getCharacteristic;
            service.getCharacteristic = async (id) => {
                const characteristic = await getCharacteristicOrig.call(service, id);
                if (id === '13d63400-2c97-0004-0002-4c6564676572') {
                    const writeValueOrig = characteristic.writeValue;
                    let delayed = false;
                    characteristic.writeValue = async (data) => {
                        if (!delayed) {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            delayed = true;
                        }
                        return writeValueOrig.call(characteristic, data);
                    };
                }
                return characteristic;
            };
            return [service];
        };
        return super.open(device, ...args);
    }
}

class LedgerTransportTauri extends LedgerTransport {
    constructor(deviceName) {
        super();
        this.deviceName = deviceName;
    }

    static async open(deviceName) {
        return new LedgerTransportTauri(deviceName);
    }

    async exchange(apdu) {
        const response = await window.__TAURI__.core.invoke('send_ledger_command', {
            ledgerDeviceName: this.deviceName,
            command: Array.from(apdu),
        });
        return Buffer.from(response);
    }
}

let ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => {
    ENABLE_DEBUG_LOGGING && console.log(...args)
};

function isIOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
}

function isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function isSafari() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium');
}

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
        const isSupported = await LedgerTransportWebBleAndroidFix.isSupported();
        return isSupported;
    } catch (e) {
        return false;
    }
}

export const setDebugLogging = (value) => ENABLE_DEBUG_LOGGING = value;

export async function getSupportedTransport(mode) {
    console.log('Using Ledger mode', JSON.stringify(mode));
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
                let err;
                if (isIOS()) {
                    err = new Error('WebUSB is not supported on iOS devices.');
                    err.name = 'WebUSBNotSupportedIOS';
                } else if (isFirefox()) {
                    err = new Error('WebUSB is not supported in Firefox.');
                    err.name = 'WebUSBNotSupportedFirefox';
                } else if (isSafari()) {
                    err = new Error('WebUSB is not supported in Safari.');
                    err.name = 'WebUSBNotSupportedSafari';
                } else {
                    err = new Error('WebUSB is not supported in this browser.');
                    err.name = 'WebUSBNotSupported';
                }
                throw err;
            }
            transport = await LedgerTransportWebUsb.create();
        } else if (mode === 'WebBLE') {
            const isSupported = await isWebBleSupported();
            if (!isSupported) {
                let err;
                if (isIOS()) {
                    err = new Error('WebBLE is not supported on iOS devices.');
                    err.name = 'WebBLENotSupportedIOS';
                } else if (isFirefox()) {
                    err = new Error('WebBLE is not supported in Firefox.');
                    err.name = 'WebBLENotSupportedFirefox';
                } else if (isSafari()) {
                    err = new Error('WebBLE is not supported in Safari.');
                    err.name = 'WebBLENotSupportedSafari';
                } else {
                    err = new Error('WebBLE is not supported in this browser.');
                    err.name = 'WebBLENotSupported';
                }
                throw err;
            }
            transport = await LedgerTransportWebBleAndroidFix.create();
        } else if (mode instanceof Object && mode.TauriDevice) {
            transport = await LedgerTransportTauri.open(mode.TauriDevice);
        } else {
            const err = new Error("Unknown transport mode: " + JSON.stringify(mode));
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
