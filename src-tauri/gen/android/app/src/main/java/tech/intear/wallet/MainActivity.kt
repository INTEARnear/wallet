package tech.intear.wallet

import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.hardware.usb.UsbManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.WindowManager
import androidx.activity.enableEdgeToEdge
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import com.ledger.lib.LedgerException
import com.ledger.lib.transport.GattCallback
import com.ledger.lib.transport.LedgerDeviceBLE
import com.ledger.lib.transport.LedgerDeviceUSB
import kotlin.collections.toTypedArray

class MainActivity : TauriActivity() {
  private val PREFS_NAME = "wallet_prefs"
  private val PREFS_KEY_PREVENT_SCREENSHOTS = "prevent_screenshots"

  private val cachedBleDevices = mutableListOf<LedgerDeviceBLE>()
  private val cachedBleDeviceAddresses = mutableSetOf<String>()
  private var isScanning = false
  private var currentScanCallback: ScanCallback? = null
  private var scanHandler: Handler? = null
  private var scanStopRunnable: Runnable? = null

  private val pendingBleConnections = mutableMapOf<String, ForwardingGattCallback>()
  private val connectedBleGatts = mutableMapOf<String, BluetoothGatt>()

  private var currentExchange = CurrentExchange()
  private class CurrentExchange {
    var deviceName = ""
    var requestApdu = ByteArray(0)
    var responseApdu: ByteArray? = null
  }

  private inner class ForwardingGattCallback(
          private var targetCallback: GattCallback?,
          private val deviceAddress: String,
          private val device: BluetoothDevice
  ) : BluetoothGattCallback() {
    private var isConnected = false
    private var gatt: BluetoothGatt? = null

    fun setGatt(gatt: BluetoothGatt) {
      this.gatt = gatt
    }

    fun setTarget(callback: GattCallback) {
      targetCallback = callback
    }

    override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
      Log.d(
              "MainActivity",
              "ForwardingGattCallback.onConnectionStateChange: device=$deviceAddress, status=$status, state=$newState"
      )

      if (newState == BluetoothProfile.STATE_CONNECTED && status == BluetoothGatt.GATT_SUCCESS) {
        isConnected = true
        this.gatt = gatt

        synchronized(cachedBleDevices) {
          if (!cachedBleDeviceAddresses.contains(deviceAddress)) {
            try {
              Log.d("MainActivity", "GATT connected, creating LedgerDeviceBLE for $deviceAddress")
              val ledgerDevice = LedgerDeviceBLE(gatt, device)

              setTarget(ledgerDevice.getGattCallback())

              cachedBleDevices.add(ledgerDevice)
              cachedBleDeviceAddresses.add(deviceAddress)

              pendingBleConnections.remove(deviceAddress)

              Log.d("MainActivity", "Successfully created LedgerDeviceBLE for $deviceAddress")
            } catch (e: Exception) {
              Log.e("MainActivity", "Failed to create LedgerDeviceBLE for $deviceAddress", e)
              pendingBleConnections.remove(deviceAddress)
            }
          }
        }

        targetCallback?.onConnectionStateChange(gatt, status, newState)
      } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
        isConnected = false
        targetCallback?.onConnectionStateChange(gatt, status, newState)

        synchronized(cachedBleDevices) {
          cachedBleDevices.removeAll { it.device.address == deviceAddress }
          cachedBleDeviceAddresses.remove(deviceAddress)
          pendingBleConnections.remove(deviceAddress)
          connectedBleGatts.remove(deviceAddress)
        }
      } else {
        targetCallback?.onConnectionStateChange(gatt, status, newState)
      }
    }

    override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
      Log.d(
              "MainActivity",
              "ForwardingGattCallback.onServicesDiscovered: device=$deviceAddress, status=$status"
      )
      targetCallback?.onServicesDiscovered(gatt, status)
    }

    override fun onCharacteristicRead(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
            status: Int
    ) {
      targetCallback?.onCharacteristicRead(gatt, characteristic, status)
    }

    override fun onCharacteristicWrite(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
            status: Int
    ) {
      targetCallback?.onCharacteristicWrite(gatt, characteristic, status)
    }

    override fun onCharacteristicChanged(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic
    ) {
      targetCallback?.onCharacteristicChanged(gatt, characteristic)
    }

    override fun onDescriptorRead(
            gatt: BluetoothGatt,
            descriptor: BluetoothGattDescriptor,
            status: Int
    ) {
      targetCallback?.onDescriptorRead(gatt, descriptor, status)
    }

    override fun onDescriptorWrite(
            gatt: BluetoothGatt,
            descriptor: BluetoothGattDescriptor,
            status: Int
    ) {
      targetCallback?.onDescriptorWrite(gatt, descriptor, status)
    }

    override fun onMtuChanged(gatt: BluetoothGatt, mtu: Int, status: Int) {
      targetCallback?.onMtuChanged(gatt, mtu, status)
    }
  }

  private fun getSharedPreferences(): SharedPreferences {
    return getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
  }

  private fun updateWindowFlags() {
    val preventScreenshots = getSharedPreferences().getBoolean(PREFS_KEY_PREVENT_SCREENSHOTS, true)

    if (preventScreenshots) {
      window.setFlags(
              WindowManager.LayoutParams.FLAG_SECURE,
              WindowManager.LayoutParams.FLAG_SECURE
      )
    } else {
      window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }
  }

  fun setPreventScreenshots(enabled: Boolean) {
    getSharedPreferences().edit().putBoolean(PREFS_KEY_PREVENT_SCREENSHOTS, enabled).apply()
    runOnUiThread { updateWindowFlags() }
  }

  fun listLedgerDevices(): String {
    val devices =
            listUsbDevices().map { formatUsbDevice(it) } +
                    listBleDevices().map { formatBleDevice(it) }
    val jsonArray = org.json.JSONArray()
    for (device in devices) {
      jsonArray.put(device)
    }
    return jsonArray.toString()
  }

  fun formatUsbDevice(device: LedgerDeviceUSB): String {
    return "USB ${device.device.productName}"
  }

  fun formatBleDevice(device: LedgerDeviceBLE): String {
    return "Bluetooth Nano X ${device.device.name}"
  }

  fun listUsbDevices(): List<LedgerDeviceUSB> {
    val usbManager = getSystemService(Context.USB_SERVICE) as? UsbManager ?: return emptyList()
    val deviceList = usbManager.deviceList

    val ledgerDevices = mutableListOf<LedgerDeviceUSB>()
    for ((_, device) in deviceList) {
      if (device.vendorId == LedgerDeviceUSB.LEDGER_VENDOR) {
        ledgerDevices.add(LedgerDeviceUSB(usbManager, device))
      }
    }

    return ledgerDevices
  }

  fun hasBlePermissions(): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val hasScan =
              ContextCompat.checkSelfPermission(this, android.Manifest.permission.BLUETOOTH_SCAN) ==
                      PackageManager.PERMISSION_GRANTED
      val hasConnect =
              ContextCompat.checkSelfPermission(
                      this,
                      android.Manifest.permission.BLUETOOTH_CONNECT
              ) == PackageManager.PERMISSION_GRANTED
      Log.d(
              "MainActivity",
              "hasBlePermissions() - Android 12+ permissions - SCAN: $hasScan, CONNECT: $hasConnect"
      )
      return hasScan && hasConnect
    } else {
      val hasLocation =
              ContextCompat.checkSelfPermission(
                      this,
                      android.Manifest.permission.ACCESS_FINE_LOCATION
              ) == PackageManager.PERMISSION_GRANTED
      Log.d("MainActivity", "hasBlePermissions() - Android <12 permission - LOCATION: $hasLocation")
      return hasLocation
    }
  }

  fun requestBlePermissions() {
    Log.d("MainActivity", "requestBlePermissions() called")

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val hasScan =
              ContextCompat.checkSelfPermission(this, android.Manifest.permission.BLUETOOTH_SCAN) ==
                      PackageManager.PERMISSION_GRANTED
      val hasConnect =
              ContextCompat.checkSelfPermission(
                      this,
                      android.Manifest.permission.BLUETOOTH_CONNECT
              ) == PackageManager.PERMISSION_GRANTED
      Log.d("MainActivity", "Android 12+ permissions - SCAN: $hasScan, CONNECT: $hasConnect")
      if (!hasScan || !hasConnect) {
        Log.w("MainActivity", "Missing Bluetooth permissions on Android 12+, requesting...")
        val permissionsToRequest = mutableListOf<String>()
        if (!hasScan) {
          permissionsToRequest.add(android.Manifest.permission.BLUETOOTH_SCAN)
        }
        if (!hasConnect) {
          permissionsToRequest.add(android.Manifest.permission.BLUETOOTH_CONNECT)
        }
        runOnUiThread {
          ActivityCompat.requestPermissions(this, permissionsToRequest.toTypedArray(), 1001)
        }
        Log.d("MainActivity", "Permission request initiated for Android 12+")
      } else {
        Log.d("MainActivity", "All Android 12+ permissions already granted")
      }
    } else {
      val hasLocation =
              ContextCompat.checkSelfPermission(
                      this,
                      android.Manifest.permission.ACCESS_FINE_LOCATION
              ) == PackageManager.PERMISSION_GRANTED
      Log.d("MainActivity", "Android <12 permission - LOCATION: $hasLocation")
      if (!hasLocation) {
        Log.w("MainActivity", "Missing location permission for BLE scanning, requesting...")
        runOnUiThread {
          ActivityCompat.requestPermissions(
                  this,
                  arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
                  1002
          )
        }
        Log.d("MainActivity", "Location permission request initiated")
      } else {
        Log.d("MainActivity", "Location permission already granted")
      }
    }
  }

  fun listBleDevices(): List<LedgerDeviceBLE> {
    Log.d(
            "MainActivity",
            "listBleDevices() called, returning ${cachedBleDevices.size} cached device(s)"
    )

    val cached = synchronized(cachedBleDevices) { cachedBleDevices.toList() }

    if (!isScanning) {
      startBleScanning()
    }

    return cached
  }

  fun exchangeApdu(deviceName: String, apduJson: String): String {
    Log.d("MainActivity", "exchangeApdu() called with deviceName: $deviceName, apduJson: $apduJson")

    val apduJsonArray = org.json.JSONArray(apduJson)
    val requestApdu = ByteArray(apduJsonArray.length())
    for (i in 0 until apduJsonArray.length()) {
      requestApdu[i] = (apduJsonArray.getInt(i) and 0xff).toByte()
    }

    synchronized(currentExchange) {
      if (currentExchange.deviceName.equals(deviceName) &&
                      currentExchange.requestApdu.contentEquals(requestApdu)
      ) {
        Log.d(
                "MainActivity",
                "Exchange APDU with same device and request, returning response: ${currentExchange.responseApdu}"
        )
        if (currentExchange.responseApdu != null) {
          Log.d("MainActivity", "Response APDU: ${currentExchange.responseApdu!!.toList()}")
          val resultJsonArray = org.json.JSONArray()
          for (byte in currentExchange.responseApdu!!) {
            resultJsonArray.put(byte.toInt() and 0xff)
          }
          return resultJsonArray.toString()
        } else {
          Log.d("MainActivity", "No response APDU available")
          return ""
        }
      } else {
        Log.d(
                "MainActivity",
                "Exchange APDU with different device or request, resetting current exchange"
        )
        currentExchange.deviceName = deviceName
        currentExchange.requestApdu = requestApdu
        currentExchange.responseApdu = null
      }
    }

    Log.d("MainActivity", "Starting new thread to exchange APDU")
    Thread {
              Log.d("MainActivity", "Thread started")
              val usbDevices = listUsbDevices()
              Log.d("MainActivity", "USB devices: ${usbDevices.map { it.device.productName }}")
              val matchingUsbDevice = usbDevices.firstOrNull { formatUsbDevice(it) == deviceName }
              Log.d("MainActivity", "Matching USB device: ${matchingUsbDevice}")
              if (matchingUsbDevice != null) {
                Log.d(
                        "MainActivity",
                        "Matching USB device found: ${matchingUsbDevice.device.productName}"
                )
                if (!matchingUsbDevice.manager.hasPermission(matchingUsbDevice.device)) {
                  Log.w(
                          "MainActivity",
                          "USB permission not granted for device: $deviceName, requesting..."
                  )
                  val permissionIntent =
                          android.app.PendingIntent.getBroadcast(
                                  this,
                                  0,
                                  Intent("tech.intear.wallet.USB_PERMISSION"),
                                  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                    android.app.PendingIntent.FLAG_IMMUTABLE
                                  } else {
                                    0
                                  }
                          )
                  matchingUsbDevice.manager.requestPermission(
                          matchingUsbDevice.device,
                          permissionIntent
                  )
                  Log.d(
                          "MainActivity",
                          "USB permission not granted. Please grant permission and retry."
                  )
                  synchronized(currentExchange) {
                    if (currentExchange.deviceName.equals(deviceName) &&
                                    currentExchange.requestApdu.contentEquals(requestApdu)
                    ) {
                      currentExchange = CurrentExchange()
                    } else {
                      // do nothing, wrong request
                    }
                  }
                  return@Thread
                }

                Log.d(
                        "MainActivity",
                        "Checking if USB device is opened: ${matchingUsbDevice.isOpened()}"
                )
                if (!matchingUsbDevice.isOpened()) {
                  try {
                    Log.d("MainActivity", "Opening USB device: $deviceName")
                    matchingUsbDevice.open()
                    Log.d("MainActivity", "USB device opened: $deviceName")
                  } catch (e: LedgerException) {
                    Log.e("MainActivity", "Failed to open USB device: $deviceName", e)
                    throw Exception("Failed to open USB device: ${e.message}")
                  }
                }

                try {
                  Log.d("MainActivity", "Exchanging APDU with USB device: $deviceName")
                  val result = matchingUsbDevice.exchange(requestApdu)
                  Log.d("MainActivity", "Exchange result: ${result.toList()}")
                  val resultJsonArray = org.json.JSONArray()
                  for (byte in result) {
                    resultJsonArray.put(byte.toInt() and 0xff)
                  }
                  synchronized(currentExchange) {
                    if (currentExchange.deviceName.equals(deviceName) &&
                                    currentExchange.requestApdu.contentEquals(requestApdu)
                    ) {
                      currentExchange.responseApdu = result
                    } else {
                      // do nothing, wrong request
                    }
                  }
                  return@Thread
                } catch (e: LedgerException) {
                  Log.e("MainActivity", "Failed to exchange APDU with USB device: $deviceName", e)
                  throw Exception("Failed to exchange APDU: ${e.message}")
                }
              }

              val bleDevices = listBleDevices()
              Log.d("MainActivity", "BLE devices: ${bleDevices.map { it.device.name }}")
              val matchingBleDevice = bleDevices.firstOrNull { formatBleDevice(it) == deviceName }
              Log.d("MainActivity", "Matching BLE device: ${matchingBleDevice}")
              if (matchingBleDevice != null) {
                Log.d("MainActivity", "Matching BLE device found: ${matchingBleDevice.device.name}")
                matchingBleDevice.setDebug(true)
                Log.d(
                        "MainActivity",
                        "Checking if BLE device is opened: ${matchingBleDevice.isOpened()}"
                )
                if (!matchingBleDevice.isOpened()) {
                  try {
                    matchingBleDevice.open()
                    Log.d("MainActivity", "BLE device opened: $deviceName")
                  } catch (e: LedgerException) {
                    Log.e("MainActivity", "Failed to open BLE device: $deviceName", e)
                    return@Thread
                  }
                }

                try {
                  Log.d("MainActivity", "Exchanging APDU with BLE device: $deviceName")
                  val result = matchingBleDevice.exchange(requestApdu)
                  Log.d("MainActivity", "Exchange result: ${result.toList()}")
                  val resultJsonArray = org.json.JSONArray()
                  for (byte in result) {
                    resultJsonArray.put(byte.toInt() and 0xff)
                  }
                  synchronized(currentExchange) {
                    if (currentExchange.deviceName.equals(deviceName) &&
                                    currentExchange.requestApdu.contentEquals(requestApdu)
                    ) {
                      currentExchange.responseApdu = result
                    } else {
                      // do nothing, wrong request
                    }
                  }
                  return@Thread
                } catch (e: LedgerException) {
                  Log.e("MainActivity", "Failed to exchange APDU with BLE device: $deviceName", e)
                  throw Exception("Failed to exchange APDU: ${e.message}")
                }
              }

              Log.w("MainActivity", "Device not found: $deviceName")
            }
            .start()
    return ""
  }

  private fun startBleScanning() {
    Log.d("MainActivity", "startBleScanning() called")

    val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
    if (bluetoothManager == null) {
      Log.w("MainActivity", "BluetoothManager is null")
      return
    }

    val bluetoothAdapter = bluetoothManager.adapter
    if (bluetoothAdapter == null) {
      Log.w("MainActivity", "BluetoothAdapter is null")
      return
    }

    if (!packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
      Log.w("MainActivity", "Device does not support BLE")
      return
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val hasScan =
              ContextCompat.checkSelfPermission(this, android.Manifest.permission.BLUETOOTH_SCAN) ==
                      PackageManager.PERMISSION_GRANTED
      val hasConnect =
              ContextCompat.checkSelfPermission(
                      this,
                      android.Manifest.permission.BLUETOOTH_CONNECT
              ) == PackageManager.PERMISSION_GRANTED
      Log.d("MainActivity", "Android 12+ permissions - SCAN: $hasScan, CONNECT: $hasConnect")
      if (!hasScan || !hasConnect) {
        Log.w("MainActivity", "Missing Bluetooth permissions on Android 12+, cannot start scanning")
        return
      }
    } else {
      val hasLocation =
              ContextCompat.checkSelfPermission(
                      this,
                      android.Manifest.permission.ACCESS_FINE_LOCATION
              ) == PackageManager.PERMISSION_GRANTED
      Log.d("MainActivity", "Android <12 permission - LOCATION: $hasLocation")
      if (!hasLocation) {
        Log.w("MainActivity", "Missing location permission for BLE scanning, cannot start scanning")
        return
      }
    }

    if (!bluetoothAdapter.isEnabled) {
      Log.w("MainActivity", "Bluetooth is not enabled")
      return
    }

    val scanner = bluetoothAdapter.bluetoothLeScanner
    if (scanner == null) {
      Log.w("MainActivity", "BluetoothLeScanner is null")
      return
    }

    stopBleScanning()

    isScanning = true
    Log.d("MainActivity", "Starting BLE scan for Ledger devices")

    val ledgerServiceUuid = android.os.ParcelUuid(LedgerDeviceBLE.SERVICE_UUID)
    Log.d("MainActivity", "Looking for Ledger service UUID: ${LedgerDeviceBLE.SERVICE_UUID}")

    val filter = ScanFilter.Builder().setServiceUuid(ledgerServiceUuid).build()
    val settings = ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build()

    val scanCallback =
            object : ScanCallback() {
              override fun onScanResult(callbackType: Int, result: ScanResult) {
                result.device?.let { device ->
                  val deviceName = device.name ?: "Unknown"
                  val deviceAddr = device.address
                  Log.d(
                          "MainActivity",
                          "BLE scan result: $deviceName ($deviceAddr), RSSI: ${result.rssi}"
                  )

                  val scanRecord = result.scanRecord
                  val serviceUuids = scanRecord?.serviceUuids
                  val expectedLedgerServiceUuid =
                          android.os.ParcelUuid(LedgerDeviceBLE.SERVICE_UUID)

                  if (serviceUuids != null) {
                    Log.d(
                            "MainActivity",
                            "  Service UUIDs: ${serviceUuids.map { it.uuid.toString() }}"
                    )
                    if (serviceUuids.contains(expectedLedgerServiceUuid)) {
                      Log.i(
                              "MainActivity",
                              "  *** Found Ledger device: $deviceName ($deviceAddr) ***"
                      )
                      addBleDeviceToCache(device)
                    } else {
                      Log.d("MainActivity", "  Not a Ledger device (service UUID mismatch)")
                    }
                  } else {
                    Log.d("MainActivity", "  No service UUIDs in scan record")
                  }
                }
              }

              override fun onBatchScanResults(batchResults: MutableList<ScanResult>) {
                Log.d("MainActivity", "onBatchScanResults: ${batchResults.size} results")
                for (result in batchResults) {
                  onScanResult(0, result)
                }
              }

              override fun onScanFailed(errorCode: Int) {
                isScanning = false
                val errorMsg =
                        when (errorCode) {
                          SCAN_FAILED_ALREADY_STARTED -> "SCAN_FAILED_ALREADY_STARTED"
                          SCAN_FAILED_APPLICATION_REGISTRATION_FAILED ->
                                  "SCAN_FAILED_APPLICATION_REGISTRATION_FAILED"
                          SCAN_FAILED_FEATURE_UNSUPPORTED -> "SCAN_FAILED_FEATURE_UNSUPPORTED"
                          SCAN_FAILED_INTERNAL_ERROR -> "SCAN_FAILED_INTERNAL_ERROR"
                          else -> "UNKNOWN($errorCode)"
                        }
                Log.e("MainActivity", "BLE scan failed: $errorMsg")
              }
            }

    currentScanCallback = scanCallback
    scanHandler = Handler(Looper.getMainLooper())

    try {
      scanner.startScan(listOf(filter), settings, scanCallback)
      Log.d("MainActivity", "BLE scan started")

      scanStopRunnable = Runnable {
        Log.d("MainActivity", "Scan timeout reached, stopping scan")
        stopBleScanning()
      }
      scanHandler?.postDelayed(scanStopRunnable!!, 10000)
    } catch (e: Exception) {
      Log.e("MainActivity", "Exception starting scan", e)
      isScanning = false
      currentScanCallback = null
      scanHandler = null
    }
  }

  private fun stopBleScanning() {
    if (!isScanning && currentScanCallback == null) {
      return
    }

    Log.d("MainActivity", "stopBleScanning() called")

    scanStopRunnable?.let { scanHandler?.removeCallbacks(it) }
    scanStopRunnable = null

    val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
    val scanner = bluetoothManager?.adapter?.bluetoothLeScanner
    val callback = currentScanCallback

    if (scanner != null && callback != null) {
      try {
        scanner.stopScan(callback)
        Log.d("MainActivity", "BLE scan stopped")
      } catch (e: Exception) {
        Log.e("MainActivity", "Exception stopping scan", e)
      }
    }

    isScanning = false
    currentScanCallback = null
    scanHandler = null
  }

  private fun addBleDeviceToCache(device: BluetoothDevice) {
    synchronized(cachedBleDevices) {
      if (cachedBleDeviceAddresses.contains(device.address)) {
        Log.d("MainActivity", "Device ${device.address} already in cache, skipping")
        return
      }

      if (pendingBleConnections.containsKey(device.address)) {
        Log.d("MainActivity", "Device ${device.address} connection already pending, skipping")
        return
      }

      try {
        val deviceName = device.name ?: "Unknown"
        val deviceAddr = device.address
        Log.d("MainActivity", "Adding device to cache: $deviceName ($deviceAddr)")

        val forwardingCallback = ForwardingGattCallback(null, deviceAddr, device)

        pendingBleConnections[deviceAddr] = forwardingCallback

        val gatt: BluetoothGatt? =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                  device.connectGatt(this, false, forwardingCallback, BluetoothDevice.TRANSPORT_LE)
                } else {
                  @Suppress("DEPRECATION") device.connectGatt(this, false, forwardingCallback)
                }

        if (gatt != null) {
          forwardingCallback.setGatt(gatt)
          connectedBleGatts[deviceAddr] = gatt
          Log.d("MainActivity", "Initiating GATT connection to $deviceName ($deviceAddr)")
        } else {
          Log.w("MainActivity", "Failed to get GATT connection for $deviceName")
          pendingBleConnections.remove(deviceAddr)
        }
      } catch (e: Exception) {
        Log.e("MainActivity", "Exception adding device to cache: ${device.address}", e)
        pendingBleConnections.remove(device.address)
      }
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)

    updateWindowFlags()

    val rootView = findViewById<View>(android.R.id.content)

    ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
      val sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
      view.updatePadding(top = sysBars.top, bottom = sysBars.bottom)
      WindowInsetsCompat.CONSUMED
    }
  }

  override fun onResume() {
    super.onResume()
    updateWindowFlags()
  }

  override fun onPause() {
    super.onPause()
    stopBleScanning()
  }

  fun closeWindow() {
    finish()
  }
}
