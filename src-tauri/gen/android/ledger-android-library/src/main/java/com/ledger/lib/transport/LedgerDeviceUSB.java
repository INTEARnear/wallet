package com.ledger.lib.transport;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;

import android.util.Log;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.hardware.usb.UsbConstants;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbRequest;

import com.ledger.lib.LedgerException;
import com.ledger.lib.utils.Dump;

/**
 * \brief Communication class with a Ledger device connected through an OTG USB cable (Nano S / Nano X)
 *
 * The caller is in charge of detecting the device (either when plugged or while scanning) then handling the permissions to access the device
 *
 * The following devices can be detected :
 *
 * Nano X : Vendor Id 2c97, Product Ids 0004, 4011, 4015
 *
 * Nano S : Vendor Id 2c97, Product Ids 0001, 1011, 1015
 *
 * Blue : Vendor Id 2c97, Product Ids 0000, 0011, 0015
 */
public class LedgerDeviceUSB implements LedgerDevice {

  public static final int LEDGER_VENDOR = 0x2c97;

  private static final int HID_BUFFER_SIZE = 64;
  private static final int LEDGER_DEFAULT_CHANNEL = 1;
  private static final int SW1_DATA_AVAILABLE = 0x61;
  private static final int MAX_FRAGMENT_SIZE = 255;
  private static final String LOG_STRING = "LedgerDeviceUSB";  

  public final UsbManager manager;
  public final UsbDevice device;
  private UsbDeviceConnection connection;
  private UsbInterface dongleInterface;
  private UsbEndpoint in;
  private UsbEndpoint out;
  private byte transferBuffer[];
  private boolean debug;

  /** Class constructor
   * @param manager USBManager obtained from the application
   * @param device USBDevice obtained from the application
   */  
  public LedgerDeviceUSB(UsbManager manager, UsbDevice device) {
    this.manager = manager;
    this.device = device;
    transferBuffer = new byte[HID_BUFFER_SIZE];
  }

  @Override
  public void open() throws LedgerException {    
    connection = null;
    dongleInterface = device.getInterface(0);
    if (dongleInterface == null) {
      throw new LedgerException(LedgerException.ExceptionReason.IO_ERROR, "Failed to retrieve interface");
    }
    in = null;
    out = null;
    for (int i=0; i<dongleInterface.getEndpointCount(); i++) {
      UsbEndpoint tmpEndpoint = dongleInterface.getEndpoint(i);
      if (tmpEndpoint.getDirection() == UsbConstants.USB_DIR_IN) {
        in = tmpEndpoint;
      }
      else {
        out = tmpEndpoint;
      }
    }    
    if ((in == null) || (out == null)) {
      throw new LedgerException(LedgerException.ExceptionReason.IO_ERROR, "Failed to retrieve endpoint"); 
    }
    connection = manager.openDevice(device);
    if (connection == null) {
      throw new LedgerException(LedgerException.ExceptionReason.IO_ERROR, "Failed to open device");
    }
    if (!connection.claimInterface(dongleInterface, true)) {
      close();
      throw new LedgerException(LedgerException.ExceptionReason.IO_ERROR, "Failed to claim interface"); 
    }

  }

  @Override
  public byte[] exchange(byte[] apdu) throws LedgerException {
    ByteArrayOutputStream response = new ByteArrayOutputStream();
    byte[] responseData = null;
    int offset = 0;
    int responseSize;
    int result;
    if (debug) {
      Log.d(LOG_STRING, "=> " + Dump.dump(apdu));
    }
    apdu = LedgerWrapper.wrapCommandAPDU(LEDGER_DEFAULT_CHANNEL, apdu, HID_BUFFER_SIZE);
    UsbRequest request = new UsbRequest();
    request.initialize(connection, out);
    while(offset != apdu.length) {
      int blockSize = (apdu.length - offset > HID_BUFFER_SIZE ? HID_BUFFER_SIZE : apdu.length - offset);
      System.arraycopy(apdu, offset, transferBuffer, 0, blockSize);
      request.queue(ByteBuffer.wrap(transferBuffer), HID_BUFFER_SIZE);
      connection.requestWait();
      offset += blockSize;
    }
    ByteBuffer responseBuffer = ByteBuffer.allocate(HID_BUFFER_SIZE);
    request = new UsbRequest();
    request.initialize(connection, in);   
    while ((responseData = LedgerWrapper.unwrapResponseAPDU(LEDGER_DEFAULT_CHANNEL, response.toByteArray(), HID_BUFFER_SIZE)) == null) {
      responseBuffer.clear();
      request.queue(responseBuffer, HID_BUFFER_SIZE);
      connection.requestWait();
      responseBuffer.rewind();
      responseBuffer.get(transferBuffer, 0, HID_BUFFER_SIZE);
      response.write(transferBuffer, 0, HID_BUFFER_SIZE);       
    }              
    if (debug) {
      Log.d(LOG_STRING, "<= " + Dump.dump(responseData));
    }
    return responseData;  
  }

  @Override
  public void close() throws LedgerException {    
    if (connection != null) {
      if (dongleInterface != null) {
        connection.releaseInterface(dongleInterface);
        dongleInterface = null;
      }
      connection.close();
      connection = null;
    }
  }

  @Override
  public void setDebug(boolean debugFlag) {
    this.debug = debugFlag;
  }

  @Override
  public boolean isOpened() {
    return (connection != null);
  }
}
