import { getSupportedTransport, setDebugLogging } from './supportedTransports.js';

export { getSupportedTransport, setDebugLogging };

function bip32PathToBytes(path) {
    const parts = path.split('/');
    return Buffer.concat(
        parts
            .map(part => part.endsWith(`'`)
                ? Math.abs(parseInt(part.slice(0, -1))) | 0x80000000
                : Math.abs(parseInt(part)))
            .map(i32 => Buffer.from([
                (i32 >> 24) & 0xFF,
                (i32 >> 16) & 0xFF,
                (i32 >> 8) & 0xFF,
                i32 & 0xFF,
            ])));
}

const networkId = 'W'.charCodeAt(0);

const SIGN_TRANSACTION = 2;
const SIGN_MESSAGE = 7;

const DEFAULT_PATH = "44'/397'/0'/0'/1'";
export async function createClient(transport) {
    return {
        transport,
        async getVersion() {
            const response = await this.transport.send(0x80, 6, 0, 0);
            const [major, minor, patch] = Array.from(response);
            return `${major}.${minor}.${patch}`;
        },
        async getPublicKey(path) {
            // NOTE: getVersion call allows to reset state to avoid starting from partially filled buffer
            await this.getVersion();

            path = path || DEFAULT_PATH;
            const response = await this.transport.send(0x80, 4, 0, networkId, bip32PathToBytes(path));
            return Buffer.from(response.subarray(0, -2));
        },
        async sign(transactionData, path) {
            const isMessage = transactionData.length >= 4 &&
                transactionData[0] === 0x9D &&
                transactionData[1] === 0x01 &&
                transactionData[2] === 0x00 &&
                transactionData[3] === 0x80;
            if (isMessage) {
                transactionData.splice(0, 4);
            }
            console.log("isMessage", isMessage)

            // NOTE: getVersion call allows to reset state to avoid starting from partially filled buffer
            const version = await this.getVersion();
            console.info('Ledger app version:', version);
            // TODO: Assert compatible versions

            path = path || DEFAULT_PATH;
            transactionData = Buffer.from(transactionData);
            // 128 - 5 service bytes
            const CHUNK_SIZE = 123
            const allData = Buffer.concat([bip32PathToBytes(path), transactionData]);
            for (let offset = 0; offset < allData.length; offset += CHUNK_SIZE) {
                const chunk = Buffer.from(allData.subarray(offset, offset + CHUNK_SIZE));
                const isLastChunk = offset + CHUNK_SIZE >= allData.length;
                const response = await this.transport.send(0x80, isMessage ? SIGN_MESSAGE : SIGN_TRANSACTION, isLastChunk ? 0x80 : 0, networkId, chunk);
                if (isLastChunk) {
                    return Buffer.from(response.subarray(0, -2));
                }
            }
        },
    }
}
