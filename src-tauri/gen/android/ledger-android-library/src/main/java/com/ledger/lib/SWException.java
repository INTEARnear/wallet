package com.ledger.lib;

/**
 * \brief Exception returned when the Status Word returned by a device call was not expected
 */
public class SWException extends LedgerException {

  private int sw;

  public SWException(int sw) {
    super(LedgerException.ExceptionReason.APPLICATION_ERROR, "Invalid status " + Integer.toHexString(sw));
    this.sw = sw;
  }

  public int getSW() {
    return sw;
  }

}
