use std::fmt::Display;

use near_min_api::types::Balance;

pub const USDC_ON_NEAR: &str = "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1";
pub const USDT_ON_NEAR: &str = "usdt.tether-token.near";
pub const WRAPPED_NEAR: &str = "wrap.near";
pub const NBTC_ON_NEAR: &str = "nbtc.bridge.near";
pub const WBTC_ON_NEAR: &str = "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near";
pub const ETH_ON_NEAR: &str = "eth.bridge.near";
pub const ZEC_ON_NEAR: &str = "zec.omft.near";

pub struct BridgeableTokens<'a> {
    pub tokens: &'a [&'a BridgeableToken<'a>],
}

pub struct BridgeableToken<'a> {
    pub chain: &'static ChainInfo<'static>,
    pub defuse_asset_identifier: &'a str,
    pub min_deposit_amount: Balance,
    pub min_withdrawal_amount: Balance,
    pub withdrawal_fee: Balance,
    pub standard: BridgeableTokenStandard<'a>,
    pub decimals: u32,
}

pub enum BridgeableTokenStandard<'a> {
    Nep141 {
        account_id: &'a str,
    },
    Nep245 {
        account_id: &'a str,
        multi_token_id: &'a str,
    },
}

impl Display for BridgeableTokenStandard<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            BridgeableTokenStandard::Nep141 { account_id } => write!(f, "nep141:{account_id}"),
            BridgeableTokenStandard::Nep245 {
                account_id,
                multi_token_id,
            } => write!(f, "nep245:{account_id}:{multi_token_id}"),
        }
    }
}

#[derive(Debug)]
pub struct ChainInfo<'a> {
    pub chain_type: &'a str,
    pub chain_id: &'a str,
    pub display_name: &'a str,
    pub requires_memo: bool,
    pub example_address: &'a str,
}

pub const BRIDGEABLE_TOKENS: &[(&str, &BridgeableTokens)] = &[
    (
        USDC_ON_NEAR,
        &BridgeableTokens {
            tokens: &[
                &BridgeableToken {
                    chain: &SOLANA,
                    defuse_asset_identifier: "sol:mainnet:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 30000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &ETHEREUM,
                    defuse_asset_identifier: "eth:1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 300000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &BASE,
                    defuse_asset_identifier: "eth:8453:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 2400,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &SUI,
                    defuse_asset_identifier: "sui:mainnet:0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 20000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "sui-c1b81ecaf27933252d31a963bc5e9458f13c18ce.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &BNB_CHAIN,
                    defuse_asset_identifier: "eth:56:0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 30000000000000000,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "56_2w93GqMcEmQFDru84j3HZZWt557r",
                    },
                    decimals: 18,
                },
                &BridgeableToken {
                    chain: &POLYGON,
                    defuse_asset_identifier: "eth:137:0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 1000,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "137_qiStmoQJDQPTebaPjgx5VBxZv6L",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &ARBITRUM,
                    defuse_asset_identifier: "eth:42161:0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 5300,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &GNOSIS,
                    defuse_asset_identifier: "eth:100:0x2a22f9c3b484c3629090feed35f17ff8f88f76f0",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 37,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "gnosis-0x2a22f9c3b484c3629090feed35f17ff8f88f76f0.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &OPTIMISM,
                    defuse_asset_identifier: "eth:10:0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "10_A2ewyUyDp6qsue1jqZsGypkCxRJ",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &AVALANCHE,
                    defuse_asset_identifier: "eth:43114:0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "43114_3atVJH3r5c4GqiSYmg9fECvjc47o",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &STELLAR,
                    defuse_asset_identifier: "stellar:mainnet:USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "1100_111bzQBB65GxAPAVoxqmMcgYo5oS3txhqs1Uh1cgahKQUeTUq1TJu",
                    },
                    decimals: 7,
                },
                &BridgeableToken {
                    chain: &X_LAYER,
                    defuse_asset_identifier: "eth:196:0x74b7f16337b8972027f6196a17a631ac6de26d22",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "196_2dK9kLNR7Ekq7su8FxNGiUW3djTw",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &MONAD,
                    defuse_asset_identifier: "eth:143:0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "143_2dmLwYWkCQKyTjeUPAsGJuiVLbFx",
                    },
                    decimals: 6,
                },
            ],
        },
    ),
    (
        USDT_ON_NEAR,
        &BridgeableTokens {
            tokens: &[
                &BridgeableToken {
                    chain: &TRON,
                    defuse_asset_identifier: "tron:mainnet:TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
                    min_deposit_amount: 1000000,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 2300000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "tron-d28a265909efecdcee7c5028585214ea0b96f015.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &SOLANA,
                    defuse_asset_identifier: "sol:mainnet:Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 30000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "sol-c800a4bd850783ccb82c2b2c7e84175443606352.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &ETHEREUM,
                    defuse_asset_identifier: "eth:1:0xdac17f958d2ee523a2206206994597c13d831ec7",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 300000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &TON,
                    defuse_asset_identifier: "ton:mainnet:EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1000000,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "1117_3tsdfyziyc7EJbP2aULWSKU4toBaAcN4FdTgfm5W1mC4ouR",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &BNB_CHAIN,
                    defuse_asset_identifier: "eth:56:0x55d398326f99059ff775485246999027b3197955",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 30000000000000000,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "56_2CMMyVTGZkeyNZTSvS5sarzfir6g",
                    },
                    decimals: 18,
                },
                &BridgeableToken {
                    chain: &GNOSIS,
                    defuse_asset_identifier: "eth:100:0x4ecaba5870353805a9f068101a40e0f32ed605c6",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 37,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "gnosis-0x4ecaba5870353805a9f068101a40e0f32ed605c6.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &ARBITRUM,
                    defuse_asset_identifier: "eth:42161:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 5300,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "arb-0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &POLYGON,
                    defuse_asset_identifier: "eth:137:0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 1000,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "137_3hpYoaLtt8MP1Z2GH1U473DMRKgr",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &APTOS,
                    defuse_asset_identifier: "aptos:mainnet:0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 2500,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "aptos-88cb7619440a914fe6400149a12b443c3ac21d59.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &SUI,
                    defuse_asset_identifier: "sui:mainnet:0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 20000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "sui-349a5b23674603c086ceac1fa9f139c4bbc30cf8.omft.near",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &OPTIMISM,
                    defuse_asset_identifier: "eth:10:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "10_359RPSJVdTxwTJT9TyGssr2rFoWo",
                    },
                    decimals: 6,
                },
                &BridgeableToken {
                    chain: &AVALANCHE,
                    defuse_asset_identifier: "eth:43114:0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "43114_372BeH7ENZieCaabwkbWkBiTTgXp",
                    },
                    decimals: 6,
                },
            ],
        },
    ),
    (
        NBTC_ON_NEAR,
        &BridgeableTokens {
            tokens: &[&BridgeableToken {
                chain: &BITCOIN,
                defuse_asset_identifier: "btc:mainnet:native",
                min_deposit_amount: 10000,
                min_withdrawal_amount: 700,
                withdrawal_fee: 1500,
                standard: BridgeableTokenStandard::Nep141 {
                    account_id: "btc.omft.near",
                },
                decimals: 8,
            }],
        },
    ),
    (
        WBTC_ON_NEAR,
        &BridgeableTokens {
            tokens: &[&BridgeableToken {
                chain: &BITCOIN,
                defuse_asset_identifier: "btc:mainnet:native",
                min_deposit_amount: 10000,
                min_withdrawal_amount: 700,
                withdrawal_fee: 1500,
                standard: BridgeableTokenStandard::Nep141 {
                    account_id: "btc.omft.near",
                },
                decimals: 8,
            }],
        },
    ),
    (
        ETH_ON_NEAR,
        &BridgeableTokens {
            tokens: &[
                &BridgeableToken {
                    chain: &ETHEREUM,
                    defuse_asset_identifier: "eth:1:native",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 35000000000000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "eth.omft.near",
                    },
                    decimals: 18,
                },
                &BridgeableToken {
                    chain: &ARBITRUM,
                    defuse_asset_identifier: "eth:42161:native",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 1200000000000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "arb.omft.near",
                    },
                    decimals: 18,
                },
                &BridgeableToken {
                    chain: &BASE,
                    defuse_asset_identifier: "eth:8453:native",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 0,
                    withdrawal_fee: 560000000000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "base.omft.near",
                    },
                    decimals: 18,
                },
                &BridgeableToken {
                    chain: &OPTIMISM,
                    defuse_asset_identifier: "eth:10:native",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep245 {
                        account_id: "v2_1.omni.hot.tg",
                        multi_token_id: "10_11111111111111111111",
                    },
                    decimals: 18,
                },
            ],
        },
    ),
    (
        ZEC_ON_NEAR,
        &BridgeableTokens {
            tokens: &[
                &BridgeableToken {
                    chain: &ZCASH,
                    defuse_asset_identifier: "zec:mainnet:native",
                    min_deposit_amount: 10000,
                    min_withdrawal_amount: 5000,
                    withdrawal_fee: 47000,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "zec.omft.near",
                    },
                    decimals: 8,
                },
                &BridgeableToken {
                    chain: &SOLANA,
                    defuse_asset_identifier: "sol:mainnet:A7bdiYdS5GjqGFtxf17ppRHtDKPkkRqbKtR27dxvQXaS",
                    min_deposit_amount: 1,
                    min_withdrawal_amount: 1,
                    withdrawal_fee: 0,
                    standard: BridgeableTokenStandard::Nep141 {
                        account_id: "zec.omft.near",
                    },
                    decimals: 8,
                },
            ],
        },
    ),
];

const ETHEREUM: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "1",
    display_name: "Ethereum",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const OPTIMISM: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "10",
    display_name: "Optimism",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const BNB_CHAIN: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "56",
    display_name: "BNB Chain",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const GNOSIS: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "100",
    display_name: "Gnosis",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const POLYGON: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "137",
    display_name: "Polygon",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const MONAD: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "143",
    display_name: "Monad",
    requires_memo: false,
    example_address: "0x233c5370ccfb3cd7409d9a3fb98ab94de94cb4cd",
};

const X_LAYER: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "196",
    display_name: "X Layer",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const BASE: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "8453",
    display_name: "Base",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const ADI_TESTNET: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "36900",
    display_name: "ADI Testnet",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const ARBITRUM: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "42161",
    display_name: "Arbitrum",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const AVALANCHE: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "43114",
    display_name: "Avalanche",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const BERACHAIN: ChainInfo = ChainInfo {
    chain_type: "eth",
    chain_id: "80094",
    display_name: "Berachain",
    requires_memo: false,
    example_address: "0x2CfF890f0378a11913B6129B2E97417a2c302680",
};

const BITCOIN: ChainInfo = ChainInfo {
    chain_type: "btc",
    chain_id: "mainnet",
    display_name: "Bitcoin",
    requires_memo: false,
    example_address: "1C6XJtNXiuXvk4oUAVMkKF57CRpaTrN5Ra",
};

const DOGECOIN: ChainInfo = ChainInfo {
    chain_type: "doge",
    chain_id: "mainnet",
    display_name: "Dogecoin",
    requires_memo: false,
    example_address: "DRmCnxzL9U11EJzLmWkm2ikaZikPFbLuQD",
};

const SOLANA: ChainInfo = ChainInfo {
    chain_type: "sol",
    chain_id: "mainnet",
    display_name: "Solana",
    requires_memo: false,
    example_address: "HWjmoUNYckccg9Qrwi43JTzBcGcM1nbdAtATf9GXmz16",
};

const RIPPLE: ChainInfo = ChainInfo {
    chain_type: "xrp",
    chain_id: "mainnet",
    display_name: "Ripple",
    requires_memo: false,
    example_address: "r9R8jciZBYGq32DxxQrBPi5ysZm67iQitH",
};

const ZCASH: ChainInfo = ChainInfo {
    chain_type: "zec",
    chain_id: "mainnet",
    display_name: "Zcash",
    requires_memo: false,
    example_address: "t1Ku2KLyndDPsR32jwnrTMd3yvi9tfFP8ML",
};

const TRON: ChainInfo = ChainInfo {
    chain_type: "tron",
    chain_id: "mainnet",
    display_name: "Tron",
    requires_memo: false,
    example_address: "TX5XiRXdyz7sdFwF5mnhT1QoGCpbkncpke",
};

const APTOS: ChainInfo = ChainInfo {
    chain_type: "aptos",
    chain_id: "mainnet",
    display_name: "Aptos",
    requires_memo: false,
    example_address: "0xd1a1c1804e91ba85a569c7f018bb7502d2f13d4742d2611953c9c14681af6446",
};

const CARDANO: ChainInfo = ChainInfo {
    chain_type: "cardano",
    chain_id: "mainnet",
    display_name: "Cardano",
    requires_memo: false,
    example_address: "addr1v8wfpcg4qfhmnzprzysj6j9c53u5j56j8rvhyjp08s53s6g07rfjm",
};

const STELLAR: ChainInfo = ChainInfo {
    chain_type: "stellar",
    chain_id: "mainnet",
    display_name: "Stellar",
    requires_memo: true,
    example_address: "GDJ4JZXZELZD737NVFORH4PSSQDWFDZTKW3AIDKHYQG23ZXBPDGGQBJK",
};

const TON: ChainInfo = ChainInfo {
    chain_type: "ton",
    chain_id: "mainnet",
    display_name: "TON",
    requires_memo: false,
    example_address: "UQAfoBd_f0pIvNpUPAkOguUrFWpGWV9TWBeZs_5TXE95_trZ",
};

const SUI: ChainInfo = ChainInfo {
    chain_type: "sui",
    chain_id: "mainnet",
    display_name: "Sui",
    requires_memo: false,
    example_address: "0x00ea18889868519abd2f238966cab9875750bb2859ed3a34debec37781520138",
};

const LITECOIN: ChainInfo = ChainInfo {
    chain_type: "ltc",
    chain_id: "mainnet",
    display_name: "Litecoin",
    requires_memo: false,
    example_address: "LQjEMkuiA2pCwFeUPwsu6ktzUubBVLsahX",
};

const BITCOIN_CASH: ChainInfo = ChainInfo {
    chain_type: "bch",
    chain_id: "mainnet",
    display_name: "Bitcoin Cash",
    requires_memo: false,
    example_address: "",
};

pub const NETWORK_NAMES: &[ChainInfo] = &[
    ETHEREUM,
    OPTIMISM,
    BNB_CHAIN,
    GNOSIS,
    POLYGON,
    MONAD,
    X_LAYER,
    BASE,
    ADI_TESTNET,
    ARBITRUM,
    AVALANCHE,
    BERACHAIN,
    BITCOIN,
    DOGECOIN,
    SOLANA,
    RIPPLE,
    ZCASH,
    TRON,
    APTOS,
    CARDANO,
    STELLAR,
    TON,
    SUI,
    LITECOIN,
    BITCOIN_CASH,
];

pub const NEAR: ChainInfo = ChainInfo {
    chain_type: "near",
    chain_id: "mainnet",
    display_name: "NEAR",
    requires_memo: false,
    example_address: "intents.near",
};
