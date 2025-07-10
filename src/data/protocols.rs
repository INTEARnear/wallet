use futures_util::future::join_all;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

lazy_static! {
    static ref PROTOCOLS_CACHE: Mutex<Option<Vec<Protocol>>> = Mutex::new(None);
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Protocol {
    pub name: String,
    pub image_url: String,
    pub url: String,
    pub description: String,
    pub category: ProtocolCategory,
    pub size: ProtocolSize,
    pub is_sponsored: bool,
    pub project_id: String,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub enum ProtocolCategory {
    DeFi,
    Memecoin,
    Launchpad,
    ChainAbstraction,
    Ai,
    Explorer,
    LiquidStaking,
    Bot,
    Game,
    Nft,
    Social,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub enum ProtocolSize {
    Small,
    Large,
}

#[derive(Deserialize)]
struct NEARCatalogResponse {
    profile: NEARCatalogProfile,
}

#[derive(Deserialize)]
struct NEARCatalogProfile {
    name: String,
    image: NEARCatalogImage,
    dapp: String,
    linktree: NEARCatalogLinktree,
}

#[derive(Deserialize)]
struct NEARCatalogLinktree {
    website: String,
}

#[derive(Deserialize)]
struct NEARCatalogImage {
    url: String,
}

#[derive(Debug)]
pub struct ProtocolDefinition {
    pub project_id: &'static str,
    pub category: ProtocolCategory,
    pub is_sponsored: bool,
    pub size: ProtocolSize,
    pub name_override: Option<&'static str>,
    pub description: &'static str,
    pub url_override: Option<&'static str>,
    pub image_override: Option<&'static str>,
}

impl Protocol {
    pub async fn from_definition(def: &ProtocolDefinition) -> Result<Self, String> {
        let url = format!("https://api.nearcatalog.org/project?pid={}", def.project_id);
        let response = reqwest::get(&url)
            .await
            .map_err(|e| e.to_string())?
            .json::<NEARCatalogResponse>()
            .await
            .map_err(|e| e.to_string())?;

        Ok(Self {
            name: def
                .name_override
                .unwrap_or(&response.profile.name)
                .to_string(),
            image_url: def
                .image_override
                .unwrap_or(&response.profile.image.url)
                .to_string(),
            category: def.category.clone(),
            size: def.size.clone(),
            url: def
                .url_override
                .unwrap_or(if response.profile.dapp.is_empty() {
                    &response.profile.linktree.website
                } else {
                    &response.profile.dapp
                })
                .to_string(),
            is_sponsored: def.is_sponsored,
            project_id: def.project_id.to_string(),
            description: def.description.to_string(),
        })
    }
}

pub async fn get_protocols() -> Vec<Protocol> {
    // Check if we have cached protocols
    if let Some(cached_protocols) = PROTOCOLS_CACHE.lock().unwrap().clone() {
        return cached_protocols;
    }

    static PROTOCOLS: &[ProtocolDefinition] = &[
        // DeFi
        ProtocolDefinition {
            project_id: "ref-finance",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "The largest DEX on NEAR",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "burrow",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: Some("Rhea Lending"),
            description: "Lending protocol",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "namesky",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Sell NEAR accounts as NFTs",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "meta-pool",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Liquid staking",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "linear-protocol",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Liquid staking",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "jump-defi",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "NFT staking, launchpad, DEX",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "delta-bot",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Trading bots",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "veax",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "DEX",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "surge-swap",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Cross-chain swap",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "near-intents",
            category: ProtocolCategory::DeFi,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Cross-chain DEX / bridge",
            url_override: None,
            image_override: None,
        },
        // NFTs
        ProtocolDefinition {
            project_id: "defishards",
            category: ProtocolCategory::Nft,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "NFTs backed by tokens",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "sharddog",
            category: ProtocolCategory::Nft,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Free collectible NFT drops",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "tradeport",
            category: ProtocolCategory::Nft,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "NFT marketplace",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "hot-craft-nft-marketplace",
            category: ProtocolCategory::Nft,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Chain abstracted NFT marketplace",
            url_override: None,
            image_override: None,
        },
        // Chain Abstraction
        ProtocolDefinition {
            project_id: "near-intents",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "Cross-chain DEX / bridge",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "sweat",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Move-to-earn app",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "bitte-wallet",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "NEAR and EVM wallet",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "hot-near-wallet-telegram",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: Some("HOT Protocol"),
            description: "Multi-chain wallet and chain abstraction",
            url_override: Some("https://hot-labs.org/"),
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "bigfat-bitcoin-pump",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: Some("BigFat"),
            description: "Bitcoin / NEAR pump",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "surge-swap",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Cross-chain swap",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "hot-craft-nft-marketplace",
            category: ProtocolCategory::ChainAbstraction,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Chain abstracted NFT marketplace",
            url_override: None,
            image_override: None,
        },
        // Memecoins
        ProtocolDefinition {
            project_id: "black-dragon",
            category: ProtocolCategory::Memecoin,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "Second generation meme coin on NEAR",
            url_override: Some("https://blackdragon.meme/"),
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "shitzu",
            category: ProtocolCategory::Memecoin,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "The original meme coin of Aurora",
            url_override: Some("https://shitzuapes.xyz/"),
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "neko",
            category: ProtocolCategory::Memecoin,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Meme coin and creator empowerment token",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "juicy-lucy",
            category: ProtocolCategory::Memecoin,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Flirt, connect, and earn with Juicy Lucy",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "rin",
            category: ProtocolCategory::Memecoin,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Ethereal muse & crypto kitten",
            url_override: None,
            image_override: None,
        },
        // Launchpad
        ProtocolDefinition {
            project_id: "meme-cooking",
            category: ProtocolCategory::Launchpad,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "Largest memecoin launchpad",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "aidols",
            category: ProtocolCategory::Launchpad,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "AI agent launchpad",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "bigfat-bitcoin-pump",
            category: ProtocolCategory::Launchpad,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: Some("BigFat"),
            description: "Bitcoin / NEAR pump",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "grafun",
            category: ProtocolCategory::Launchpad,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Memecoin launchpad",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "pitchtalk",
            category: ProtocolCategory::Launchpad,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Launchpad and fundraising",
            url_override: None,
            image_override: None,
        },
        // AI
        ProtocolDefinition {
            project_id: "bitte",
            category: ProtocolCategory::Ai,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "AI wallet and agent hub",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "near-ai",
            category: ProtocolCategory::Ai,
            is_sponsored: false,
            size: ProtocolSize::Large,
            name_override: None,
            description: "AI agent framework and hub",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "rin",
            category: ProtocolCategory::Ai,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "AI agent and VTuber",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "intear",
            category: ProtocolCategory::Ai,
            is_sponsored: true,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Telegram AI Moderator, agents, oracles",
            url_override: Some("https://intear.tech"),
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "juicy-lucy",
            category: ProtocolCategory::Ai,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Simp-to-earn AI agent",
            url_override: None,
            image_override: None,
        },
        // Explorer
        ProtocolDefinition {
            project_id: "near-blocks",
            category: ProtocolCategory::Explorer,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Blockchain explorer like Etherscan",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "pikespeak",
            category: ProtocolCategory::Explorer,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Explorer with high-level DeFi info",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "dex-screener",
            category: ProtocolCategory::Explorer,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Token charts and trades",
            url_override: None,
            image_override: None,
        },
        // Bots
        ProtocolDefinition {
            project_id: "bettear-bot",
            category: ProtocolCategory::Bot,
            is_sponsored: true,
            size: ProtocolSize::Large,
            name_override: None,
            description: "Telegram trading bot, buy bot, and more",
            url_override: Some("https://t.me/BettearBot?start=smile-trade"),
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "delta-bot",
            category: ProtocolCategory::Bot,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Trading bots",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "bazooka",
            category: ProtocolCategory::Bot,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Telegram trading bot",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "near-validator-watcher-bot",
            category: ProtocolCategory::Bot,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Monitor your NEAR validator in Telegram",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "dragon-tech-bot",
            category: ProtocolCategory::Bot,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Buy bot, captcha, welcome messages, tip bot in Telegram",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "lnc-watch-bot",
            category: ProtocolCategory::Bot,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Type NEAR account and get notified about TXs",
            url_override: Some("https://t.me/nearwatchbot"),
            image_override: None,
        },
        // Game
        ProtocolDefinition {
            project_id: "pumpopoly",
            category: ProtocolCategory::Game,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: Some("Pumpopoly"),
            description: "Virtual real estate game",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "spear-on-near",
            category: ProtocolCategory::Game,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Game with spears",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "harvest-moon",
            category: ProtocolCategory::Game,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Idle tap game in Meteor Wallet",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "text-royale",
            category: ProtocolCategory::Game,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Text-based Telegram battle royale",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "yupland-nft-sender",
            category: ProtocolCategory::Game,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: Some("Yupland"),
            description: "Telegram mini-app game",
            url_override: Some("https://t.me/YupLand_bot"),
            image_override: None,
        },
        // Social
        ProtocolDefinition {
            project_id: "near-social",
            category: ProtocolCategory::Social,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "On-chain social platform",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "learn-near-club",
            category: ProtocolCategory::Social,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "(L)Earn about NEAR projects",
            url_override: None,
            image_override: None,
        },
        ProtocolDefinition {
            project_id: "open-crosspost",
            category: ProtocolCategory::Social,
            is_sponsored: false,
            size: ProtocolSize::Small,
            name_override: None,
            description: "Post once, forward to different socials",
            url_override: None,
            image_override: None,
        },
    ];

    let futures = PROTOCOLS.iter().map(Protocol::from_definition);

    let protocols = join_all(futures)
        .await
        .into_iter()
        .filter_map(Result::ok)
        .collect::<Vec<_>>();

    *PROTOCOLS_CACHE.lock().unwrap() = Some(protocols.clone());

    protocols
}
