package tech.intear.wallet

import android.content.Context
import android.content.SharedPreferences
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding

class MainActivity : TauriActivity() {
  private val PREFS_NAME = "wallet_prefs"
  private val PREFS_KEY_PREVENT_SCREENSHOTS = "prevent_screenshots"

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
    runOnUiThread {
      updateWindowFlags()
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)

    updateWindowFlags()

    val rootView = findViewById<View>(android.R.id.content)

    ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
      val sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
      view.updatePadding(
        top = sysBars.top,
        bottom = sysBars.bottom
      )
      WindowInsetsCompat.CONSUMED
    }
  }

  override fun onResume() {
    super.onResume()
    updateWindowFlags()
  }
}
