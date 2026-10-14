use std::{
    collections::{HashMap, HashSet},
    fmt,
    sync::Arc,
};

use codee::string::FromToStringCodec;
use futures_channel::oneshot;
use leptos::prelude::*;
use leptos_use::{
    ReconnectLimit, UseWebSocketOptions, core::ConnectionReadyState, use_websocket_with_options,
};
use reqwest::Url;
use serde::{Deserialize, de::DeserializeOwned};
use serde_json::{Map, Value};

use super::network_context::{Network, NetworkContext};

#[derive(Deserialize, Clone, Debug)]
pub struct ApiError {
    pub code: String,
    pub message: String,
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} ({})", self.message, self.code)
    }
}

/// Tokens, events and balances as the API sends them.
#[derive(Deserialize, Debug)]
pub struct Table {
    pub columns: Vec<String>,
    pub rows: Vec<Vec<Value>>,
}

impl Table {
    /// Each row, as its values by column
    pub fn into_records(self) -> impl Iterator<Item = Map<String, Value>> {
        let Table { columns, rows } = self;
        rows.into_iter()
            .map(move |row| columns.iter().cloned().zip(row).collect())
    }

    /// Each row, read into `T` by column
    pub fn deserialize<T: DeserializeOwned>(self) -> serde_json::Result<Vec<T>> {
        self.into_records()
            .map(|record| serde_json::from_value(Value::Object(record)))
            .collect()
    }
}

pub fn icon_url(api_url: &Url, icon_hash: &str) -> String {
    let mut url = api_url.clone();
    let scheme = if url.scheme() == "wss" {
        "https"
    } else {
        "http"
    };
    url.set_scheme(scheme).unwrap();
    url.set_path(&format!("/icon/{icon_hash}.webp"));
    url.set_query(None);
    url.into()
}

pub enum SubscriptionMessage {
    Reply(Result<Value, ApiError>),
    /// The whole push, with `sub`, `height` and the rest
    Push(Value),
    /// The server ended it
    End(ApiError),
}

type SubscriptionHandler = Arc<dyn Fn(SubscriptionMessage) + Send + Sync>;

#[derive(Clone)]
struct Connection {
    network: Network,
    ready_state: Signal<ConnectionReadyState>,
    send: Arc<dyn Fn(&String) + Send + Sync>,
}

#[derive(Clone, Copy)]
pub struct PricesContext {
    /// The network the connection is for, or is about to be, with its price API
    api: Memo<(Network, Option<Url>)>,
    connection: ReadSignal<Option<Connection>>,
    last_id: StoredValue<u64>,
    /// Requests waiting for their reply, by id
    pending: StoredValue<HashMap<u64, oneshot::Sender<Result<Value, ApiError>>>>,
    /// Requests made before the connection to their network was open, sent once it is
    queued: StoredValue<Vec<(Network, u64, String)>>,
    /// The connection's subscriptions, by the id of the request that made each
    subscriptions: StoredValue<HashMap<u64, SubscriptionHandler>>,
}

impl PricesContext {
    /// The network whose price API the connection is open to, tracked
    pub fn open_network(&self) -> Option<Network> {
        self.connection.with(|connection| {
            connection
                .as_ref()
                .filter(|connection| connection.ready_state.get() == ConnectionReadyState::Open)
                .map(|connection| connection.network.clone())
        })
    }

    fn next_id(&self) -> u64 {
        self.last_id
            .try_update_value(|id| {
                *id += 1;
                *id
            })
            .expect("the prices context lives as long as the app")
    }

    fn message(&self, id: u64, method: &str, params: Value) -> String {
        serde_json::json!({ "id": id, "method": method, "params": params }).to_string()
    }

    /// `method` of `network`'s price API, with its result read into `T`. Fails unless `network` is
    /// the one the wallet is on, and if the connection closes before the reply.
    pub async fn request<T: DeserializeOwned>(
        self,
        network: &Network,
        method: &str,
        params: Value,
    ) -> Result<T, String> {
        if !self
            .api
            .with_untracked(|(api_network, url)| api_network == network && url.is_some())
        {
            return Err(format!("No price API connection for {method}"));
        }
        let id = self.next_id();
        let (sender, reply) = oneshot::channel();
        self.pending.update_value(|pending| {
            pending.insert(id, sender);
        });
        let message = self.message(id, method, params);
        match self.connection.get_untracked().filter(|connection| {
            connection.network == *network
                && connection.ready_state.get_untracked() == ConnectionReadyState::Open
        }) {
            Some(connection) => (connection.send)(&message),
            // Its connection is opening, or about to be made
            None => self
                .queued
                .update_value(|queued| queued.push((network.clone(), id, message))),
        }
        let result = reply
            .await
            .map_err(|_| format!("The price API connection closed before {method} was answered"))?
            .map_err(|error| format!("{method} failed: {error}"))?;
        serde_json::from_value(result)
            .map_err(|error| format!("Unexpected {method} result: {error}"))
    }

    /// Makes a subscription with `method` over the open connection, `handler` getting each of its
    /// messages. None if the connection isn't open.
    pub fn subscribe(
        &self,
        method: &str,
        params: Value,
        handler: impl Fn(SubscriptionMessage) + Send + Sync + 'static,
    ) -> Option<u64> {
        let connection = self.connection.get_untracked().filter(|connection| {
            connection.ready_state.get_untracked() == ConnectionReadyState::Open
        })?;
        let id = self.next_id();
        self.subscriptions.update_value(|subscriptions| {
            subscriptions.insert(id, Arc::new(handler));
        });
        (connection.send)(&self.message(id, method, params));
        Some(id)
    }

    /// Ends subscription `sub`, whose messages aren't handled from now on.
    pub fn unsubscribe(&self, sub: u64) {
        let subscribed = self
            .subscriptions
            .try_update_value(|subscriptions| subscriptions.remove(&sub))
            .flatten()
            .is_some();
        // Otherwise it ended with the connection, or the server ended it
        if subscribed && let Some(connection) = self.connection.get_untracked() {
            let id = self.next_id();
            (connection.send)(&self.message(id, "unsubscribe", serde_json::json!({ "sub": sub })));
        }
    }

    /// Drops what was asked over a connection that's gone, and what was queued for any other
    /// network than `next`'s connection is to: those requests fail.
    fn forget(&self, next: Option<&Network>) {
        let kept = self
            .queued
            .try_update_value(|queued| {
                queued.retain(|(network, _, _)| Some(network) == next);
                queued.iter().map(|(_, id, _)| *id).collect::<HashSet<_>>()
            })
            .unwrap_or_default();
        self.pending
            .update_value(|pending| pending.retain(|id, _| kept.contains(id)));
        self.subscriptions.set_value(HashMap::new());
    }

    fn handle_message(&self, text: &str) {
        let mut message = match serde_json::from_str::<Map<String, Value>>(text) {
            Ok(message) => message,
            Err(error) => {
                log::error!("Unexpected message from the price API: {error}");
                return;
            }
        };
        let error_of = |error: Value| {
            serde_json::from_value::<ApiError>(error).unwrap_or_else(|error| ApiError {
                code: "unexpected".to_string(),
                message: error.to_string(),
            })
        };
        if let Some(sub) = message.get("sub").and_then(Value::as_u64) {
            // None once it's unsubscribed
            let Some(handler) = self
                .subscriptions
                .with_value(|subscriptions| subscriptions.get(&sub).cloned())
            else {
                return;
            };
            match message.remove("end") {
                Some(end) => {
                    self.subscriptions.update_value(|subscriptions| {
                        subscriptions.remove(&sub);
                    });
                    handler(SubscriptionMessage::End(error_of(end)));
                }
                None => handler(SubscriptionMessage::Push(Value::Object(message))),
            }
        } else if let Some(id) = message.get("id").and_then(Value::as_u64) {
            let reply = match message.remove("error") {
                Some(error) => Err(error_of(error)),
                None => Ok(message.remove("result").unwrap_or_default()),
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
                handler(SubscriptionMessage::Reply(reply));
            }
            // Otherwise it answers an unsubscribe, or a subscription unsubscribed before its reply
        }
        // `hello` and `idle` need nothing
    }
}

pub fn provide_prices_context() {
    let network = expect_context::<NetworkContext>().network;
    let (connection, set_connection) = signal(None::<Connection>);
    // A connection is only made again for another API, not whenever the accounts change
    let api = Memo::new(move |_| {
        let network = network.get();
        let url = network.prices_api_url();
        (network, url)
    });
    let context = PricesContext {
        api,
        connection,
        last_id: StoredValue::new(0),
        pending: StoredValue::new(HashMap::new()),
        queued: StoredValue::new(Vec::new()),
        subscriptions: StoredValue::new(HashMap::new()),
    };

    Effect::new(move |_| {
        let (network, url) = api.get();
        // The last connection's requests won't be answered
        context.forget(url.is_some().then_some(&network));
        set_connection(url.map(|url| {
            let socket = use_websocket_with_options::<String, String, FromToStringCodec, _, _>(
                url.as_str(),
                UseWebSocketOptions::default()
                    .reconnect_limit(ReconnectLimit::Infinite)
                    .reconnect_interval(1000)
                    .on_message(move |message: &String| context.handle_message(message)),
            );
            let ready_state = socket.ready_state;
            let send = socket.send.clone();
            Effect::new(move |was: Option<ConnectionReadyState>| {
                let state = ready_state.get();
                match state {
                    ConnectionReadyState::Open => {
                        let queued = context
                            .queued
                            .try_update_value(std::mem::take)
                            .unwrap_or_default();
                        for (_, _, message) in queued {
                            send(&message);
                        }
                    }
                    // It was opening or open, so what was asked over it won't be answered
                    ConnectionReadyState::Closed
                        if was.is_some_and(|was| was != ConnectionReadyState::Closed) =>
                    {
                        context.forget(None);
                    }
                    _ => {}
                }
                state
            });
            Connection {
                network,
                ready_state,
                send: Arc::new(socket.send),
            }
        }));
    });

    provide_context(context);
}
