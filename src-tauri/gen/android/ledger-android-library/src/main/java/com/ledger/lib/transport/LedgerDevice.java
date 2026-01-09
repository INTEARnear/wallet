package com.ledger.lib.transport;

import com.ledger.lib.LedgerException;

/**
 * \brief Interface implemented by a Ledger device communication class responding to APDU commands sent by the host.
 */
public interface LedgerDevice {

	/** 
	 * Open the communication channel to the device
	 * @throw LedgerException if a communication error occurs
	 */
	public void open() throws LedgerException;

  /**
   * Exchange an APDU with the device. This method is blocking until the answer is received or an exception is thrown
   * @param apdu APDU to send to the device
   * @return response to the APDU including the Status Word
   * @throw LedgerException if a communication error occurs
   */
	public byte[] exchange(byte[] apdu) throws LedgerException;

  /**
   * Close the commmunication to the device
   * @throw LedgerException if a communication error occurs (can be safely ignored)
   */
	public void close() throws LedgerException;

	/**
	 * Set the debug flag, enabling to log exchanges with the device
	 */
	public void setDebug(boolean debugFlag);

	/**
	 * Check if the communication channel has already been opened
	 */
	public boolean isOpened();
}
