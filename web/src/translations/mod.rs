use std::{collections::HashMap, sync::Mutex};

use lazy_static::lazy_static;
use leptos::prelude::*;
use serde::{Deserialize, Serialize};
use translation_macros::translation_keys;

use crate::contexts::config_context::ConfigContext;
use crate::contexts::translation_context::Translation;

pub enum TranslationNode {
    Group(TranslationGroup),
    Key(TranslationKey),
}

pub struct TranslationGroup {
    pub name: &'static str,
    pub children: &'static [TranslationNode],
}

translation_keys! {
    languages {
        English("en", "English", ["en"]),
        Ukrainian("uk", "Українська", ["uk"]),
    }

    keys {
        Pages {
            Settings {
                SecurityTab,
                PreferencesTab,
                SupportResources,
                LiveChat,
                Preferences {
                    Title,
                    HeaderLanguage,
                    HeaderOptions,
                    ToggleHideToTray,
                    ToggleAutostart,
                    ToggleRealtimeBalances,
                    ToggleSoundEffects,
                    ToggleRealtimePrices,
                    ToggleHideAmounts,
                    ToggleDisableScreenshots,
                    HeaderLedger,
                    HeaderSlippageTolerance,
                    LedgerCurrent,
                    LedgerNotConnected,
                    LedgerLoading,
                    LedgerSelectConnectionMethod,
                    LedgerEnableBluetooth,
                    SlippageCurrent,
                    SlippageCustomLabel,
                    SlippageAutoPrefixOr,
                    SlippageAutoButton,
                    SlippageDescription,
                    HeaderBackgroundTheme,
                    BackgroundChooseStyle,
                    BackgroundCount,
                    HeaderHiddenNfts,
                    HiddenNftsEmpty,
                    LedgerModeNone,
                    LedgerModeUsb,
                    LedgerModeBluetooth,
                    BackgroundTeardrops,
                    BackgroundBetty,
                    BackgroundTriangles,
                    NumberFormat {
                        Title,
                        PresetShort,
                        PresetFull,
                        PresetCustom,
                        HeaderFormatting,
                        FormattingDescription,
                        LabelMinIntegerDigits,
                        LabelMinFractionDigits,
                        LabelMaxFractionDigits,
                        LabelMinSignificantDigits,
                        LabelMaxSignificantDigits,
                        LabelRoundingPriority,
                        LabelRoundingIncrement,
                        LabelRoundingMode,
                        LabelTrailingZeroDisplay,
                        LabelNotation,
                        LabelGrouping,
                        LabelCompactDisplay,
                        AdvancedNote,
                        Preview,
                        RoundingPriorityAuto,
                        RoundingPriorityMore,
                        RoundingPriorityLess,
                        RoundingModeCeil,
                        RoundingModeFloor,
                        RoundingModeExpand,
                        RoundingModeTrunc,
                        RoundingModeHalfCeil,
                        RoundingModeHalfFloor,
                        RoundingModeHalfExpand,
                        RoundingModeHalfTrunc,
                        RoundingModeHalfEven,
                        TrailingZeroAuto,
                        TrailingZeroStripIfInteger,
                        NotationStandard,
                        NotationScientific,
                        NotationEngineering,
                        NotationCompact,
                        CompactDisplayShort,
                        CompactDisplayLong,
                        GroupingAuto,
                        GroupingAlways,
                        GroupingMin2,
                        GroupingOff,
                    },
                },
                Security {
                    Title,
                    TabAccount,
                    TabConnectedApps,
                    TabSecurityLog,
                    HeaderBiometric,
                    BiometricDescription,
                    ToggleBiometric,
                    HeaderPassword,
                    PasswordDescription,
                    PasswordPlaceholder,
                    PasswordChangeButton,
                    PasswordSetButton,
                    PasswordBenchmarking,
                    PasswordChanging,
                    PasswordSetting,
                    PasswordDone,
                    HeaderRememberPassword,
                    PasswordRemoveButton,
                    PasswordRemoving,
                    PasswordRemoved,
                    HeaderStoragePersistence,
                    PersistenceDescription,
                    PersistenceUsageLabel,
                    PersistenceAvailableLabel,
                    PersistenceSafeFromClearing,
                    PersistenceYes,
                    PersistenceNo,
                    PersistenceApproveButton,
                    PersistenceEnableButton,
                    PersistenceChecking,
                    PersistenceDontShowWarning,
                    PersistenceDeniedTitle,
                    PersistenceDeniedDescription,
                    PersistenceToEnable,
                    PersistenceAddBookmarks,
                    PersistenceInstallPwa,
                    HeaderPagesNotLoading,
                    CacheClearing,
                    CacheResetButton,
                    CacheCleared,
                    RememberNever,
                    Remember5Min,
                    Remember15Min,
                    Remember60Min,
                },
                Developer {
                    Title,
                    TestnetTip,
                    SettingsTab,
                    LanguageEditorLinkLabel,
                    LanguageEditorLinkDescription,
                    TokenFactory {
                        Title,
                        LinkLabel,
                        LinkDescription,
                    },
                    ApiOverrides {
                        Title,
                        DexAggregator,
                        LeaveEmptyDefault,
                        ErrInvalidUrl,
                    },
                    Localnet {
                        Title,
                        Add,
                        NoNetworks,
                        EditNetwork,
                        AddNetwork,
                        NetworkId,
                        RpcUrl,
                        RpcCspNote,
                        Checking,
                        CheckingStatus,
                        Online,
                        Offline,
                        Control,
                        Save,
                        Cancel,
                        Delete,
                        ErrInvalidUrl,
                        ErrRpcRequired,
                        ErrNetworkIdRequired,
                        ErrNetworkIdUnique,
                        ErrNotSandbox,
                        ErrRpcFailed,
                    },
                    Sandbox {
                        Title,
                        NetworkStatus,
                        BlockHeight,
                        CopyBlockHeight,
                        Offline,
                        Loading,
                        FastForwarding,
                        FastForward,
                        SmartContracts,
                        WrappedNearDeployed,
                        WrappedNearNotDeployed,
                        WrappedNearError,
                        WrappedNearChecking,
                        Deploying,
                        Redeploy,
                        Deploy,
                        Accounts,
                        CreateNewAccount,
                        Creating,
                        CreateAnyway,
                        Create,
                        NoAccounts,
                        NetworkLabel,
                        Delete,
                        TokenList,
                        TokenListDescription,
                        AddTokenContract,
                        AddToken,
                        NoTokens,
                        Remove,
                        NetworkNotFound,
                        AccountHelpText,
                        AccountExists,
                        WillCreate,
                        CheckingAccount,
                        InvalidAccountName,
                        EnterTokenAddress,
                        TokenAlreadyInList,
                        ValidatingToken,
                        InvalidContractAddress,
                        LoadingMetadata,
                        TokenMetadata,
                        TokenError,
                        InitWrapContract,
                    },
                    CreateToken {
                        Title,
                        TokenSymbol,
                        TokenSymbolDescription,
                        TokenName,
                        TokenNameDescription,
                        TotalSupply,
                        TotalSupplyDescription,
                        Decimals,
                        DecimalsDescription,
                        RecommendDecimals,
                        RecommendSupply,
                        TokenImage,
                        Optional,
                        UploadImageDescription,
                        Image,
                        Remove,
                        OnChainQuality,
                        Lossless,
                        ImageCost,
                        ChooseLaunchMethod,
                        LaunchIntearLaunch,
                        IntearMainnetOnly,
                        LaunchMemeCooking,
                        MemeCookingMainnet,
                        MemeCookingSymbol,
                        LaunchAidols,
                        AidolsMainnet,
                        AidolsSymbol,
                        CreateWithoutLaunchpad,
                        Cancel,
                        IntearLaunch {
                            Title,
                            Description,
                            ShortCa,
                            CostsOneNear,
                            CaPreview,
                            LoadingPreview,
                            Telegram,
                            X,
                            TokenDescription,
                            DescriptionPlaceholder,
                            FirstBuy,
                            Fees,
                            FeeReceiver,
                            NoFee,
                            ShortIdTaken,
                            ErrTxOutcome,
                            ErrParseFailed,
                            ErrLaunchFailed,
                            ErrUnexpectedStatus,
                            ErrTxFailed,
                            ErrTxCancelled,
                            SuccessDescription,
                            OpenOnIntearLaunch,
                            MustStartWith,
                            MustIncludeHandle,
                            CannotContainSlash,
                            MustBeValidUrl,
                            MaxLengthError,
                            FeeScheduled20,
                            FeeScheduled40,
                            ErrPreviewFailed,
                            CreateButton,
                            TokenDetails,
                            Supply,
                            Decimals,
                            Close,
                            Cancel,
                            ViewTxDetails,
                            LaunchFailed,
                            TokenLaunched,
                            AmountGt0,
                            InvalidNumber,
                            SelectAccountFirst,
                            BuyFirstDescription,
                            Optional,
                            Website,
                            MustStartHttps,
                        },
                        MemeCooking {
                            Title,
                            Description,
                            Duration,
                            SaleDescription,
                            SoftCap,
                            SoftCapDescription,
                            HardCap,
                            HardCapDescription,
                            EnterValidAmount,
                            XLink,
                            TelegramLink,
                            EnableTeamAlloc,
                            AllocationPercent,
                            AllocationPercentDescription,
                            CliffDays,
                            CliffDaysMin,
                            VestingDays,
                            VestingDaysMin,
                            SupplyTooLow,
                            IconTooLarge,
                            SuccessDescription,
                            ViewOnMemeCooking,
                            ErrLaunchFailed,
                            ErrSoftCapRange,
                            ErrHardCapRange,
                            ErrHardCapGeSoftCap,
                            ErrMustStartX,
                            ErrMustStartTelegram,
                            ErrMustStartHttps,
                            ErrAllocationRange,
                            ErrCliffRange,
                            ErrVestingRange,
                            Dur5Min,
                            Dur15Min,
                            Dur30Min,
                            Dur1Hour,
                            Dur2Hours,
                            Dur3Hours,
                            Dur6Hours,
                            Dur12Hours,
                            Dur1Day,
                            Dur2Days,
                            Dur3Days,
                            Dur4Days,
                            Dur5Days,
                            Dur6Days,
                            Dur7Days,
                            DurMinutes,
                            TokenDetails,
                            Supply,
                            Decimals,
                            Close,
                            Cancel,
                            Confirm,
                            ViewTxDetails,
                            LaunchFailed,
                            TokenLaunchedSuccess,
                            InvalidNumber,
                            Optional,
                            Website,
                        },
                        Aidols {
                            Title,
                            Description,
                            ConfirmDescription,
                            InitialBuy,
                            SupplyDecimalsNote,
                            ImageTooLarge,
                            SuccessDescription,
                            ViewOnAidols,
                            ErrLaunchFailed,
                            ErrInsuffBalWithBuy,
                            ErrInsuffBal,
                            TokenDetails,
                            Supply,
                            Decimals,
                            Close,
                            Cancel,
                            Confirm,
                            ViewTxDetails,
                            LaunchFailed,
                            TokenLaunchedSuccess,
                            AmountGt0,
                            InvalidNumber,
                            BuyFirstDescription,
                            Optional,
                        },
                        WithoutLaunchpad {
                            Title,
                            Description,
                            ContractAddress,
                            ContractAddressDescription,
                            DeployWarning,
                            MustBeSubaccount,
                            InvalidAccountId,
                            SubaccountExists,
                            DeployAs,
                            SelectedAccount,
                            NoAccountSelected,
                            DeployerDescription,
                            MintTokensTo,
                            MintTokensToDescription,
                            TokenDeployed,
                            SuccessDescription,
                            View,
                            ErrDeployFailed,
                            TokenDetails,
                            Supply,
                            Decimals,
                            Close,
                            Cancel,
                            Confirm,
                            ViewTxDetails,
                            DeploymentFailed,
                            SelectAccountFirst,
                        },
                    },
                    LanguageEditor {
                        Title,
                        Create,
                        ImportJson,
                        Back,
                        Official,
                        LanguageNamePlaceholder,
                    },
                },
            },
        },
        Misc {
            Transaction {
                StorageDeposit,
                WithdrawFromRhea,
                TerminateOtherSessions,
                RemoveIntentsKeys,
                DisconnectLedger,
                ConnectLedger,
                DeploySmartWallet,
                UpdateSmartWallet,
                LinkBettearBot,
                UnlinkBettearBot,
                Unwrap,
                SwapForGas,
                LaunchMemeCooking,
                LaunchAidols,
                LaunchIntearLaunch,
                DeployTokenContract,
                Bridge,
                ClaimGift,
                SendNear,
                SendTokens,
                DepositStorageStaking,
                ClaimStakingReward,
                WithdrawFromPool,
                Stake,
                Unstake,
                Swap,
                SwapStep,
                RemoveFunctionCallKey,
                CreateAccount,
                SendNft,
                AddFullAccessKey,
                CreateGift,
                AddTokenToGift,
                AddNftToGift,
                CancelGift,
                GrantPermission,
                AppInteraction,
            },
        },
    }
}

#[derive(Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Debug)]
pub enum Language {
    BuiltIn(BuiltInLanguage),
    Custom(String),
}

impl Default for Language {
    fn default() -> Self {
        Self::BuiltIn(BuiltInLanguage::English)
    }
}

impl Language {
    pub fn id(&self) -> String {
        match self {
            Self::BuiltIn(lang) => lang.id().to_string(),
            Self::Custom(name) => format!("custom-{name}"),
        }
    }

    pub fn display_name(&self) -> String {
        match self {
            Self::BuiltIn(lang) => lang.display_name().to_string(),
            Self::Custom(name) => name.clone(),
        }
    }

    pub fn custom_name(&self) -> &str {
        match self {
            Self::Custom(name) => name,
            Self::BuiltIn(_) => panic!("custom_name called on built-in language"),
        }
    }
}

lazy_static! {
    pub static ref CUSTOM_TRANSLATIONS: Mutex<HashMap<Language, HashMap<TranslationKey, String>>> =
        Mutex::new(HashMap::new());
    pub static ref CURRENT_LANGUAGE: Mutex<Language> = Mutex::new(Language::default());
}

pub fn format_template(template: &str, args: &[(&str, &str)]) -> String {
    let arg_map: HashMap<&str, &str> = args.iter().copied().collect();

    let mut expected_names = Vec::new();
    let mut chars = template.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '{' {
            if chars.peek() == Some(&'{') {
                chars.next();
                continue;
            }
            let mut name = String::new();
            for c in chars.by_ref() {
                if c == '}' {
                    break;
                }
                name.push(c);
            }
            if !name.is_empty() {
                expected_names.push(name);
            }
        } else if c == '}' && chars.peek() == Some(&'}') {
            chars.next();
        }
    }

    for name in &expected_names {
        if !arg_map.contains_key(name.as_str()) {
            return "???".to_string();
        }
    }

    let mut result = String::new();
    let mut chars = template.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '{' {
            if chars.peek() == Some(&'{') {
                chars.next();
                result.push('{');
                continue;
            }
            let mut name = String::new();
            for c in chars.by_ref() {
                if c == '}' {
                    break;
                }
                name.push(c);
            }
            if let Some(val) = arg_map.get(name.as_str()) {
                result.push_str(val);
            }
        } else if c == '}' {
            if chars.peek() == Some(&'}') {
                chars.next();
                result.push('}');
            } else {
                result.push(c);
            }
        } else {
            result.push(c);
        }
    }
    result
}

impl TranslationKey {
    pub fn format(self, args: &[(&str, &str)]) -> String {
        let language = use_context::<ConfigContext>()
            .map(|c| c.language.get())
            .unwrap_or_else(|| CURRENT_LANGUAGE.lock().unwrap().clone());
        match &language {
            Language::BuiltIn(b) => b.resolve(self, args),
            Language::Custom(_) => {
                let t = expect_context::<Translation>();
                let translations = t.translations.get();
                match translations.get(&language).and_then(|m| m.get(&self)) {
                    Some(template) => format_template(template, args),
                    None => BuiltInLanguage::default().resolve(self, args),
                }
            }
        }
    }

    pub fn format_view(self, args: Vec<(&str, AnyView)>) -> Vec<AnyView> {
        let language = use_context::<ConfigContext>()
            .map(|c| c.language.get())
            .unwrap_or_else(|| CURRENT_LANGUAGE.lock().unwrap().clone());
        let template = match &language {
            Language::BuiltIn(b) => b.template(self).to_string(),
            Language::Custom(_) => {
                let t = expect_context::<Translation>();
                let translations = t.translations.get();
                translations
                    .get(&language)
                    .and_then(|m| m.get(&self))
                    .cloned()
                    .unwrap_or_else(|| BuiltInLanguage::default().template(self).to_string())
            }
        };
        format_template_view(&template, args)
    }
}

pub fn format_template_view(template: &str, args: Vec<(&str, AnyView)>) -> Vec<AnyView> {
    let mut arg_map: HashMap<&str, AnyView> = args.into_iter().collect();
    let mut fragments: Vec<AnyView> = Vec::new();
    let mut current_text = String::new();

    let mut chars = template.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '{' {
            if chars.peek() == Some(&'{') {
                chars.next();
                current_text.push('{');
                continue;
            }
            if !current_text.is_empty() {
                let text = std::mem::take(&mut current_text);
                fragments.push(text.into_any());
            }
            let mut name = String::new();
            for c in chars.by_ref() {
                if c == '}' {
                    break;
                }
                name.push(c);
            }
            if let Some(view) = arg_map.remove(name.as_str()) {
                fragments.push(view);
            }
        } else if c == '}' {
            if chars.peek() == Some(&'}') {
                chars.next();
                current_text.push('}');
            } else {
                current_text.push(c);
            }
        } else {
            current_text.push(c);
        }
    }
    if !current_text.is_empty() {
        fragments.push(current_text.into_any());
    }
    fragments
}
