use std::{
    collections::{BTreeMap, HashMap},
    fmt,
    sync::Arc,
};

use bigdecimal::BigDecimal;
use codee::string::FromToStringCodec;
use futures_channel::oneshot;
use leptos::prelude::*;
use leptos_use::{
    ReconnectLimit, UseWebSocketOptions, core::ConnectionReadyState, use_websocket_with_options,
};
use near_min_api::types::{AccountId, CryptoHash, U128};
use reqwest::Url;
use serde::{Deserialize, Deserializer, Serialize, Serializer, de::DeserializeOwned};
use serde_json::{Map, Value};

use super::{
    network_context::{Network, NetworkContext},
    tokens_context::TokenScore,
};

#[derive(Deserialize, Clone, Copy, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum ErrorCode {
    BadRequest,
    UnknownMethod,
    UnknownField,
    UnsupportedThreshold,
    NotFound,
    TooMany,
    TooFarBehind,
    UpstreamUnavailable,
    Internal,
    /// The network has no Intear API
    #[serde(skip)]
    NoApi,
    /// The connection closed before the reply came, or the API couldn't be reached
    #[serde(skip)]
    Disconnected,
    /// A reply that isn't what was asked for
    #[serde(other)]
    Unexpected,
}

#[derive(Deserialize, Clone, Debug)]
pub struct ApiError {
    pub code: ErrorCode,
    pub message: String,
}

impl ApiError {
    fn new(code: ErrorCode, message: impl Into<String>) -> Self {
        ApiError {
            code,
            message: message.into(),
        }
    }
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} ({:?})", self.message, self.code)
    }
}

/// A request's id, which also names the subscription it makes
#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[serde(transparent)]
pub struct RequestId(u64);

/// A connection from when it opens until it closes: subscriptions don't outlive it
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Session(u64);

/// A subscription, to end with [`ApiContext::unsubscribe`]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Subscription {
    id: RequestId,
    session: Session,
}

impl Subscription {
    pub fn session(&self) -> Session {
        self.session
    }
}

impl Serialize for Subscription {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        self.id.serialize(serializer)
    }
}

/// A method that answers once
pub trait Request: Serialize {
    const METHOD: &'static str;
    type Result: DeserializeOwned;
}

/// A method that's also served over HTTP, at `PATH`
pub trait HttpRequest: Request {
    const PATH: &'static str;
}

/// A method that subscribes
pub trait Subscribe: Serialize {
    const METHOD: &'static str;
    type Reply: DeserializeOwned;
    type Push: DeserializeOwned;
}

pub enum SubscriptionEvent<S: Subscribe> {
    Reply(Result<S::Reply, ApiError>),
    Push(S::Push),
    /// The server ended it
    End(ApiError),
}

/// A table's rows, each read into `T` by its columns
#[derive(Debug)]
pub struct Rows<T>(pub Vec<T>);

impl<'de, T: DeserializeOwned> Deserialize<'de> for Rows<T> {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        #[derive(Deserialize)]
        struct Table {
            columns: Vec<String>,
            rows: Vec<Vec<Value>>,
        }
        let Table { columns, rows } = Table::deserialize(deserializer)?;
        rows.into_iter()
            .map(|row| {
                serde_json::from_value(Value::Object(columns.iter().cloned().zip(row).collect()))
            })
            .collect::<Result<_, _>>()
            .map(Rows)
            .map_err(serde::de::Error::custom)
    }
}

#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "snake_case")]
pub enum TokenField {
    Name,
    Symbol,
    Decimals,
    IconHash,
    PriceUsd,
    PriceUsdHardcoded,
    PriceUsdRaw,
    #[serde(rename = "price_usd_raw_24h_ago")]
    PriceUsdRaw24hAgo,
    #[serde(rename = "price_change_24h")]
    PriceChange24h,
    #[serde(rename = "volume_usd_24h")]
    VolumeUsd24h,
    LiquidityUsd,
    CirculatingSupply,
    TotalSupply,
    Reputation,
    Deleted,
}

/// How far a value moves before it's sent again
#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum Threshold {
    #[serde(rename = "0.01%")]
    Bp1,
    #[serde(rename = "0.1%")]
    Bp10,
    #[serde(rename = "0.25%")]
    Bp25,
    #[serde(rename = "0.5%")]
    Bp50,
    #[serde(rename = "1%")]
    Bp100,
    #[serde(rename = "2%")]
    Bp200,
    #[serde(rename = "5%")]
    Bp500,
    #[serde(rename = "10%")]
    Bp1000,
}

/// A token's fields as the API sends them: every one asked for in a row, only those that changed
/// in a push
#[derive(Deserialize, Default, Clone, Debug)]
pub struct TokenFields {
    pub name: Option<String>,
    pub symbol: Option<String>,
    pub decimals: Option<u32>,
    #[serde(default, with = "serde_with::rust::double_option")]
    pub icon_hash: Option<Option<String>>,
    pub price_usd: Option<BigDecimal>,
    pub price_usd_hardcoded: Option<BigDecimal>,
    pub price_usd_raw: Option<BigDecimal>,
    pub price_usd_raw_24h_ago: Option<BigDecimal>,
    #[serde(default, with = "serde_with::rust::double_option")]
    pub price_change_24h: Option<Option<f64>>,
    pub volume_usd_24h: Option<f64>,
    pub liquidity_usd: Option<f64>,
    pub circulating_supply: Option<U128>,
    pub total_supply: Option<U128>,
    pub reputation: Option<TokenScore>,
    pub deleted: Option<bool>,
}

#[derive(Deserialize, Debug)]
pub struct TokenRow {
    pub account_id: AccountId,
    #[serde(flatten)]
    pub fields: TokenFields,
}

#[derive(Serialize, Default)]
pub struct TokenFilter {
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub min: BTreeMap<TokenField, f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_reputation: Option<TokenScore>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deleted: Option<bool>,
}

#[derive(Serialize)]
pub struct TokensGet {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ids: Option<Vec<AccountId>>,
    #[serde(rename = "where", skip_serializing_if = "Option::is_none")]
    pub filter: Option<TokenFilter>,
    pub fields: Vec<TokenField>,
}

impl Request for TokensGet {
    const METHOD: &'static str = "tokens.get";
    type Result = Rows<TokenRow>;
}

impl HttpRequest for TokensGet {
    const PATH: &'static str = "/tokens";
}

#[derive(Serialize)]
pub struct TokensSearch {
    pub q: String,
    pub fields: Vec<TokenField>,
    pub limit: usize,
    /// Tokens it holds rank higher
    pub holder: AccountId,
    pub min_reputation: TokenScore,
}

impl Request for TokensSearch {
    const METHOD: &'static str = "tokens.search";
    type Result = Rows<TokenRow>;
}

#[derive(Serialize)]
pub struct TokensSubscribe {
    pub ids: Vec<AccountId>,
    pub fields: Vec<TokenField>,
    pub min_change: BTreeMap<TokenField, Threshold>,
    pub min_interval_ms: u64,
}

#[derive(Deserialize)]
pub struct TokensPush {
    #[serde(default)]
    pub set: HashMap<AccountId, TokenFields>,
}

impl Subscribe for TokensSubscribe {
    const METHOD: &'static str = "tokens.subscribe";
    type Reply = Rows<TokenRow>;
    type Push = TokensPush;
}

/// Changes the tokens a [`TokensSubscribe`] follows, answered with the added ones
#[derive(Serialize)]
pub struct TokensUpdate {
    pub sub: Subscription,
    pub add: Vec<AccountId>,
    pub remove: Vec<AccountId>,
}

impl Request for TokensUpdate {
    const METHOD: &'static str = "tokens.update";
    type Result = Rows<TokenRow>;
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum BalanceSource {
    Direct,
    Native,
    Rhea,
}

/// What a balance is of: native NEAR, which the API calls `near`, or a token
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum HeldToken {
    Near,
    Token(AccountId),
}

impl<'de> Deserialize<'de> for HeldToken {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let id = String::deserialize(deserializer)?;
        if id == "near" {
            return Ok(HeldToken::Near);
        }
        id.parse()
            .map(HeldToken::Token)
            .map_err(serde::de::Error::custom)
    }
}

#[derive(Serialize)]
pub struct BalancesSubscribe {
    pub account: AccountId,
    pub sources: Vec<BalanceSource>,
    /// Native NEAR's are wrap.near's
    pub token_fields: Vec<TokenField>,
    pub token_min_change: BTreeMap<TokenField, Threshold>,
}

#[derive(Deserialize)]
pub struct BalanceRow {
    pub token: HeldToken,
    pub source: BalanceSource,
    pub balance: U128,
}

#[derive(Deserialize)]
pub struct Balances {
    pub balances: Rows<BalanceRow>,
    /// The held tokens' fields, and wrap.near's for native NEAR
    pub tokens: Rows<TokenRow>,
    /// Sources that couldn't be read
    #[serde(default)]
    pub errors: HashMap<BalanceSource, ApiError>,
}

#[derive(Deserialize)]
pub struct BalancesPush {
    /// Direct and native balances that changed
    #[serde(default)]
    pub balances: HashMap<HeldToken, U128>,
    /// Changed fields of held tokens, and every field of tokens held for the first time
    #[serde(default)]
    pub set: HashMap<AccountId, TokenFields>,
}

impl Subscribe for BalancesSubscribe {
    const METHOD: &'static str = "balances.subscribe";
    type Reply = Balances;
    type Push = BalancesPush;
}

/// What the wallet reads of a transfer or transaction an account sent or received
#[derive(Deserialize, Debug)]
pub struct TransferRow {
    pub id: i64,
    pub timestamp_millis: u64,
    pub transaction_id: Option<CryptoHash>,
    /// None for a transaction
    pub token: Option<AccountId>,
    /// None for a mint
    pub sender: Option<AccountId>,
    /// None for a burn
    pub receiver: Option<AccountId>,
}

/// [`TransferRow`]'s fields as asked for, after `id`, which comes first
const TRANSFER_FIELDS: [&str; 5] = [
    "timestamp_millis",
    "transaction_id",
    "token",
    "sender",
    "receiver",
];

/// A page of an account's transfers and transactions, newest first
#[derive(Deserialize)]
pub struct HistoryPage {
    #[serde(flatten)]
    pub rows: Rows<TransferRow>,
    /// Where an older page starts, if there is one
    pub next_cursor: Option<String>,
    /// The newest row id the API had, to pick up after it
    #[serde(default)]
    pub latest_id: Option<i64>,
}

/// The page of an account's history before `cursor`
#[derive(Serialize)]
pub struct HistoryQuery {
    account: AccountId,
    include_transactions: bool,
    fields: [&'static str; 5],
    limit: usize,
    cursor: String,
}

impl HistoryQuery {
    pub fn new(account: AccountId, limit: usize, cursor: String) -> Self {
        HistoryQuery {
            account,
            include_transactions: true,
            fields: TRANSFER_FIELDS,
            limit,
            cursor,
        }
    }
}

impl Request for HistoryQuery {
    const METHOD: &'static str = "transfers.query";
    type Result = HistoryPage;
}

/// An account's history as it happens, from its newest page or after a row it had
#[derive(Serialize)]
pub struct HistorySubscribe {
    account: AccountId,
    include_transactions: bool,
    fields: [&'static str; 5],
    #[serde(skip_serializing_if = "Option::is_none")]
    history: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    after_id: Option<i64>,
}

impl HistorySubscribe {
    pub fn newest(account: AccountId, rows: usize) -> Self {
        HistorySubscribe {
            account,
            include_transactions: true,
            fields: TRANSFER_FIELDS,
            history: Some(rows),
            after_id: None,
        }
    }

    pub fn after(account: AccountId, id: i64) -> Self {
        HistorySubscribe {
            account,
            include_transactions: true,
            fields: TRANSFER_FIELDS,
            history: None,
            after_id: Some(id),
        }
    }
}

/// A block's rows, oldest first, in the columns of the reply
#[derive(Deserialize)]
pub struct HistoryPush {
    #[serde(deserialize_with = "transfer_rows")]
    pub rows: Vec<TransferRow>,
}

fn transfer_rows<'de, D: Deserializer<'de>>(deserializer: D) -> Result<Vec<TransferRow>, D::Error> {
    let columns = ["id"].into_iter().chain(TRANSFER_FIELDS).map(String::from);
    Vec::<Vec<Value>>::deserialize(deserializer)?
        .into_iter()
        .map(|row| serde_json::from_value(Value::Object(columns.clone().zip(row).collect())))
        .collect::<Result<_, _>>()
        .map_err(serde::de::Error::custom)
}

impl Subscribe for HistorySubscribe {
    const METHOD: &'static str = "transfers.subscribe";
    type Reply = HistoryPage;
    type Push = HistoryPush;
}

#[derive(Serialize)]
struct Unsubscribe {
    sub: RequestId,
}

impl Request for Unsubscribe {
    const METHOD: &'static str = "unsubscribe";
    type Result = Value;
}

fn read<T: DeserializeOwned>(method: &str, value: Value) -> Result<T, ApiError> {
    serde_json::from_value(value).map_err(|error| {
        ApiError::new(
            ErrorCode::Unexpected,
            format!("Unexpected {method} reply: {error}"),
        )
    })
}

/// Where the network's API serves `path` over HTTP: on the websocket's host
fn http_url(network: &Network, path: &str) -> Option<Url> {
    let mut url = network.api_url()?;
    let scheme = if url.scheme() == "wss" {
        "https"
    } else {
        "http"
    };
    url.set_scheme(scheme).ok()?;
    url.set_path(path);
    url.set_query(None);
    Some(url)
}

/// The icon `icon_hash` names, a WebP on the network's API
pub fn icon_url(network: &Network, icon_hash: &str) -> Option<String> {
    http_url(network, &format!("/icon/{icon_hash}.webp")).map(String::from)
}

/// URLs longer than this go as a POST, as some proxies refuse them
const MAX_URL_LENGTH: usize = 8_000;

/// `params` in a URL as the API reads them: lists comma-separated, an object's keys dotted, and
/// `tokens.get`'s `where` without it. None when they can't be, like a list item with a comma.
fn query_pairs(method: &str, params: &Map<String, Value>) -> Option<Vec<(String, String)>> {
    fn put(pairs: &mut Vec<(String, String)>, name: String, value: &Value) -> Option<()> {
        let value = match value {
            Value::Null => return Some(()),
            Value::Bool(value) => value.to_string(),
            Value::Number(value) => value.to_string(),
            Value::String(value) => value.clone(),
            Value::Array(items) => items
                .iter()
                .map(|item| match item {
                    Value::String(item) if !item.contains(',') => Some(item.clone()),
                    Value::Number(item) => Some(item.to_string()),
                    _ => None,
                })
                .collect::<Option<Vec<_>>>()?
                .join(","),
            Value::Object(_) => return None,
        };
        pairs.push((name, value));
        Some(())
    }
    fn put_dotted(pairs: &mut Vec<(String, String)>, name: &str, value: &Value) -> Option<()> {
        match value {
            Value::Object(object) => object
                .iter()
                .try_for_each(|(key, value)| put(pairs, format!("{name}.{key}"), value)),
            value => put(pairs, name.to_string(), value),
        }
    }
    let mut pairs = Vec::new();
    for (name, value) in params {
        match (name.as_str(), value) {
            ("where", Value::Object(filter)) if method == "tokens.get" => {
                for (name, value) in filter {
                    put_dotted(&mut pairs, name, value)?;
                }
            }
            (name, value) => put_dotted(&mut pairs, name, value)?,
        }
    }
    Some(pairs)
}

/// `request` of `network`'s API over HTTP, as a GET that caches can keep unless its params don't
/// fit in a URL: for what's read once, with no wait for the websocket, and for any network
pub async fn fetch<R: HttpRequest>(network: &Network, request: &R) -> Result<R::Result, ApiError> {
    let mut url = http_url(network, R::PATH)
        .ok_or_else(|| ApiError::new(ErrorCode::NoApi, format!("{network:?} has no Intear API")))?;
    let params = match serde_json::to_value(request) {
        Ok(Value::Object(params)) => params,
        _ => unreachable!("a request's params are an object"),
    };
    let client = reqwest::Client::new();
    let pairs = query_pairs(R::METHOD, &params);
    if let Some(pairs) = &pairs {
        url.query_pairs_mut().extend_pairs(pairs);
    }
    let response = if pairs.is_some() && url.as_str().len() <= MAX_URL_LENGTH {
        client.get(url).send().await
    } else {
        url.set_query(None);
        client.post(url).json(&params).send().await
    }
    .map_err(|error| ApiError::new(ErrorCode::Disconnected, error.to_string()))?;
    let ok = response.status().is_success();
    let body = response
        .json::<Value>()
        .await
        .map_err(|error| ApiError::new(ErrorCode::Unexpected, error.to_string()))?;
    if !ok {
        #[derive(Deserialize)]
        struct Failed {
            error: ApiError,
        }
        return Err(read::<Failed>(R::METHOD, body)?.error);
    }
    read(R::METHOD, body)
}

/// What the server sends for a subscription
enum Incoming {
    Reply(Result<Value, ApiError>),
    Push(Value),
    End(ApiError),
}

type Handler = Arc<dyn Fn(Incoming) + Send + Sync>;
type SendFn = Arc<dyn Fn(&String) + Send + Sync>;

/// The websocket to the network's API, with what was asked over it. Made again for every network,
/// and dropped with everything it holds when the network changes.
#[derive(Clone, Copy)]
struct Connection {
    /// Set while it's open
    session: RwSignal<Option<Session>>,
    send: StoredValue<SendFn>,
    /// Requests made while it wasn't open, sent once it is
    queued: StoredValue<Vec<String>>,
    pending: StoredValue<HashMap<RequestId, oneshot::Sender<Result<Value, ApiError>>>>,
    subscriptions: StoredValue<HashMap<RequestId, Handler>>,
}

impl Connection {
    fn send(&self, message: String) {
        if self.session.get_untracked().is_some() {
            self.send.with_value(|send| send(&message));
        } else {
            self.queued.update_value(|queued| queued.push(message));
        }
    }

    fn handle(&self, text: &str) {
        #[derive(Deserialize)]
        struct Message {
            id: Option<RequestId>,
            sub: Option<RequestId>,
            result: Option<Value>,
            error: Option<ApiError>,
            end: Option<ApiError>,
        }
        let value = match serde_json::from_str::<Value>(text) {
            Ok(value) => value,
            Err(error) => {
                log::error!("Unexpected message from the Intear API: {error}");
                return;
            }
        };
        let message = match serde_json::from_value::<Message>(value.clone()) {
            Ok(message) => message,
            Err(error) => {
                log::error!("Unexpected message from the Intear API: {error}");
                return;
            }
        };
        if let Some(sub) = message.sub {
            // None once it's unsubscribed
            let Some(handler) = self
                .subscriptions
                .with_value(|subscriptions| subscriptions.get(&sub).cloned())
            else {
                return;
            };
            match message.end {
                Some(error) => {
                    self.subscriptions.update_value(|subscriptions| {
                        subscriptions.remove(&sub);
                    });
                    handler(Incoming::End(error));
                }
                None => handler(Incoming::Push(value)),
            }
        } else if let Some(id) = message.id {
            let reply = match message.error {
                Some(error) => Err(error),
                None => Ok(message.result.unwrap_or_default()),
            };
            if let Some(sender) = self
                .pending
                .try_update_value(|pending| pending.remove(&id))
                .flatten()
            {
                // Its caller may be gone
                let _ = sender.send(reply);
            } else if let Some(handler) = self
                .subscriptions
                .with_value(|subscriptions| subscriptions.get(&id).cloned())
            {
                if reply.is_err() {
                    // It was never made
                    self.subscriptions.update_value(|subscriptions| {
                        subscriptions.remove(&id);
                    });
                }
                handler(Incoming::Reply(reply));
            }
            // Otherwise it answers an unsubscribe, or a subscription ended before its reply
        }
        // `hello` and `idle` need nothing
    }
}

/// The current network's Intear API
#[derive(Clone, Copy)]
pub struct ApiContext {
    connection: ReadSignal<Option<Connection>>,
    last_id: StoredValue<u64>,
}

impl ApiContext {
    /// The open connection's session, tracked: a new one every time it opens, and None while it
    /// isn't or the network has no API. Subscriptions are made again for each.
    pub fn session(&self) -> Option<Session> {
        self.connection
            .with(|connection| connection.and_then(|connection| connection.session.get()))
    }

    fn next_id(&self) -> RequestId {
        RequestId(
            self.last_id
                .try_update_value(|id| {
                    *id += 1;
                    *id
                })
                .expect("the API context lives as long as the app"),
        )
    }

    fn message(id: RequestId, method: &str, params: &impl Serialize) -> String {
        serde_json::json!({ "id": id, "method": method, "params": params }).to_string()
    }

    /// `request` over the websocket, sent once it's open. Fails if it closes, or the network
    /// changes, before the reply.
    pub async fn request<R: Request>(self, request: R) -> Result<R::Result, ApiError> {
        let Some(connection) = self.connection.get_untracked() else {
            return Err(ApiError::new(
                ErrorCode::NoApi,
                "the network has no Intear API",
            ));
        };
        let id = self.next_id();
        let (sender, reply) = oneshot::channel();
        connection.pending.update_value(|pending| {
            pending.insert(id, sender);
        });
        connection.send(Self::message(id, R::METHOD, &request));
        let result = reply.await.map_err(|_| {
            ApiError::new(
                ErrorCode::Disconnected,
                format!("the connection closed before {} was answered", R::METHOD),
            )
        })??;
        read(R::METHOD, result)
    }

    /// Subscribes over the open connection, `on_event` getting its reply, pushes and end. None if
    /// the connection isn't open.
    pub fn subscribe<S: Subscribe + 'static>(
        &self,
        params: S,
        on_event: impl Fn(SubscriptionEvent<S>) + Send + Sync + 'static,
    ) -> Option<Subscription> {
        let connection = self.connection.get_untracked()?;
        let session = connection.session.get_untracked()?;
        let id = self.next_id();
        let handler: Handler = Arc::new(move |incoming| {
            on_event(match incoming {
                Incoming::Reply(reply) => {
                    SubscriptionEvent::Reply(reply.and_then(|result| read(S::METHOD, result)))
                }
                Incoming::Push(push) => match read(S::METHOD, push) {
                    Ok(push) => SubscriptionEvent::Push(push),
                    Err(error) => {
                        log::error!("{error}");
                        return;
                    }
                },
                Incoming::End(error) => SubscriptionEvent::End(error),
            })
        });
        connection.subscriptions.update_value(|subscriptions| {
            subscriptions.insert(id, handler);
        });
        connection.send(Self::message(id, S::METHOD, &params));
        Some(Subscription { id, session })
    }

    /// Ends `subscription`, unless it ended with its session already
    pub fn unsubscribe(&self, subscription: Subscription) {
        let Some(connection) = self.connection.get_untracked() else {
            return;
        };
        if connection.session.get_untracked() != Some(subscription.session) {
            return;
        }
        let subscribed = connection
            .subscriptions
            .try_update_value(|subscriptions| subscriptions.remove(&subscription.id))
            .flatten()
            .is_some();
        if subscribed {
            let request = Unsubscribe {
                sub: subscription.id,
            };
            connection.send(Self::message(self.next_id(), Unsubscribe::METHOD, &request));
        }
    }
}

pub fn provide_api_context() {
    let network = expect_context::<NetworkContext>().network;
    let (connection, set_connection) = signal(None::<Connection>);
    let sessions = StoredValue::new(0);

    Effect::new(move |_| {
        let Some(url) = network.with(Network::api_url) else {
            set_connection(None);
            return;
        };
        let connection = Connection {
            session: RwSignal::new(None),
            send: StoredValue::new(Arc::new(|_: &String| {}) as SendFn),
            queued: StoredValue::new(Vec::new()),
            pending: StoredValue::new(HashMap::new()),
            subscriptions: StoredValue::new(HashMap::new()),
        };
        let socket = use_websocket_with_options::<String, String, FromToStringCodec, _, _>(
            url.as_str(),
            UseWebSocketOptions::default()
                .reconnect_limit(ReconnectLimit::Infinite)
                .reconnect_interval(1000)
                .on_message(move |message: &String| connection.handle(message)),
        );
        connection.send.set_value(Arc::new(socket.send.clone()));
        let ready_state = socket.ready_state;
        Effect::new(move |was: Option<ConnectionReadyState>| {
            let state = ready_state.get();
            match state {
                ConnectionReadyState::Open => {
                    let session = sessions
                        .try_update_value(|sessions| {
                            *sessions += 1;
                            Session(*sessions)
                        })
                        .expect("the API context lives as long as the app");
                    connection.session.set(Some(session));
                    for message in connection
                        .queued
                        .try_update_value(std::mem::take)
                        .unwrap_or_default()
                    {
                        connection.send(message);
                    }
                }
                // Nothing asked over it will be answered
                _ if was == Some(ConnectionReadyState::Open) => {
                    connection.session.set(None);
                    connection.pending.set_value(HashMap::new());
                    connection.subscriptions.set_value(HashMap::new());
                }
                _ => {}
            }
            state
        });
        set_connection(Some(connection));
    });

    provide_context(ApiContext {
        connection,
        last_id: StoredValue::new(0),
    });
}
