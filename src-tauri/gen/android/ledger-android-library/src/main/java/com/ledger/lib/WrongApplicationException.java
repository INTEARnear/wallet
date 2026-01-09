package com.ledger.lib;

/**
 * \brief Exception returned when an APDU is sent to the wrong device application
 */
public class WrongApplicationException extends LedgerException {

  private String expectedApplication;

  public WrongApplicationException() {
    super(LedgerException.ExceptionReason.APPLICATION_ERROR, "Wrong device application selected");
  }

  public WrongApplicationException(String expectedApplication) {
    super(LedgerException.ExceptionReason.APPLICATION_ERROR, "Wrong device application selected, expected " + expectedApplication);
    this.expectedApplication = expectedApplication;
  }

  public String getExpectedApplication() {
  	return expectedApplication;
  }

}
