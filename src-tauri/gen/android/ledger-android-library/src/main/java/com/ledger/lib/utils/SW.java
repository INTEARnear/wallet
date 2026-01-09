package com.ledger.lib.utils;

/**
 * List of common Status Words
 */
public interface SW {

		public static final int SW_OK = 0x9000;
		public static final int SW_CLA_NOT_SUPPORTED = 0x6e00;
		public static final int SW_INS_NOT_SUPPORTED = 0x6d00;
		public static final int SW_INCORRECT_P1_P2 = 0x6b00;
		public static final int SW_SECURITY_STATUS_NOT_SATISFIED = 0x6982;
		public static final int SW_INVALID_DATA = 0x6a80;
		public static final int SW_CONDITIONS_OF_USE_NOT_SATISFIED = 0x6985;
		public static final int SW_NOT_ENOUGH_MEMORY_SPACE = 0x6a84;
		public static final int SW_PROP_INVALID_TARGET_ID = 0x6484;		

}
