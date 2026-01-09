package com.ledger.lib.utils;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;

import com.ledger.lib.transport.LedgerDevice;
import com.ledger.lib.LedgerException;
import com.ledger.lib.SWException;
import com.ledger.lib.WrongApplicationException;

/**
 * Utility class to exchange APDUs
*/
public class ApduExchange {

	/**
	 * Embed an APDU response and Status Word
	 */
	public static class ApduResponse {

		private byte[] response;
		private int sw;

		ApduResponse(byte[] responseSW) {
			if (responseSW.length < 2) {
				throw new LedgerException(LedgerException.ExceptionReason.INVALID_PARAMETER, "Truncated response");
			}
			sw = ((int)(responseSW[responseSW.length - 2] & 0xff) << 8) |  (int)(responseSW[responseSW.length - 1] & 0xff);			
			response = Arrays.copyOfRange(responseSW, 0, responseSW.length);
		}

		public byte[] getResponse() {
			return response;
		}

		public int getSW() {
			return sw;
		}

		/**
		 * Check a Status Word and returns an exception if not SW_OK
		*/
		public void checkSW() throws LedgerException {
			if (sw != SW.SW_OK) {
				switch(sw) {
					case SW.SW_CLA_NOT_SUPPORTED:
					case SW.SW_INS_NOT_SUPPORTED:
					case SW.SW_INCORRECT_P1_P2:
						throw new WrongApplicationException();
				}
				throw new SWException(sw);
			}
		}

		/**
		 * Check a Status Word against a list and returns an exception if not found
		 * @param acceptedSW list of accepted Status Word
		*/
		public void checkSW(int acceptedSW[]) throws LedgerException {
			for (int SW : acceptedSW) {
				if (sw == SW) {
					return;
				}
			}
			throw new SWException(sw);
		}
	}

	/**
	 * Exchange an APDU with a device and get the response
	 * @param device device to exchange the APDU with
	 * @param apdu APDU to exchange
	 * @returns APDU data and Status Word
	 */
	public static ApduResponse exchangeApdu(LedgerDevice device, byte[] apdu) throws LedgerException {
		 return new ApduResponse(device.exchange(apdu));
	}

	/**
	 * Prepare an APDU having no data, exchange it with a device, return the response data and Status Word
	 * @param device device to exchange the APDU with
	 * @param cla APDU CLA
	 * @param ins APDU INS
	 * @param p1 APDU P1
	 * @param p2 APDU P2
	 * @returns APDU data and Status Word
	 */
	public static ApduResponse exchangeApdu(LedgerDevice device, int cla, int ins, int p1, int p2) throws LedgerException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();		
		out.write(cla);
		out.write(ins);
		out.write(p1);
		out.write(p2);
		out.write(0);
		return exchangeApdu(device, out.toByteArray());
	}

	/**
	 * Prepare an APDU receiving data, exchange it with a device, return the response data and Status Word
	 * @param device device to exchange the APDU with
	 * @param cla APDU CLA
	 * @param ins APDU INS
	 * @param p1 APDU P1
	 * @param p2 APDU P2
	 * @param length length of the data to receive
	 * @returns APDU data
	 */
	public static ApduResponse exchangeApdu(LedgerDevice device, int cla, int ins, int p1, int p2, int length) throws LedgerException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();		
		out.write(cla);
		out.write(ins);
		out.write(p1);
		out.write(p2);
		out.write(length);
		return exchangeApdu(device, out.toByteArray());
	}

	/**
	 * Prepare an APDU sending data, exchange it with a device, return the response data and Status Word
	 * @param device device to exchange the APDU with
	 * @param cla APDU CLA
	 * @param ins APDU INS
	 * @param p1 APDU P1
	 * @param p2 APDU P2
	 * @param data data to exchange
	 * @returns APDU data
	 */
	public static ApduResponse exchangeApdu(LedgerDevice device, int cla, int ins, int p1, int p2, byte[] data) throws LedgerException {
		if (data == null) {
			throw new LedgerException(LedgerException.ExceptionReason.INVALID_PARAMETER, "Data is null");			
		}
		ByteArrayOutputStream out = new ByteArrayOutputStream();		
		out.write(cla);
		out.write(ins);
		out.write(p1);
		out.write(p2);
		out.write(data.length);
		out.write(data, 0, data.length);
		return exchangeApdu(device, out.toByteArray());
	}
}
