use std::{
    cmp::Reverse,
    collections::{HashMap, HashSet},
    sync::Arc,
    time::Duration,
};

use crate::{
    components::tooltip::Tooltip,
    contexts::{
        accounts_context::AccountsContext,
        api_context::{
            ApiContext, ErrorCode, HistoryQuery, HistorySubscribe, Subscription, SubscriptionEvent,
            TransferRow,
        },
        config_context::{ConfigContext, TimestampFormat},
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        tokens_context::{Token, near_metadata},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    translations::TranslationKey,
    utils::{
        EventLogData, FtBurnLog, FtMintLog, FtTransferLog, IntearDexSwapLog,
        NEP141_EVENT_STANDARD_STRING, NftBurnLog, NftMintLog, NftTransferLog, RefDclSwapLog,
        StorageBalance, format_account_id, format_duration, format_token_amount, get_ft_metadata,
        get_nft_collection_metadata,
    },
};
use base64::{self, Engine};
use chrono::{DateTime as ChronoDateTime, Local, NaiveDate, Utc};
use futures_util::{future::join_all, lock::Mutex};
use icondata::{LuArrowRight, LuCalendar, LuClock, LuPackage, LuPackageOpen};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::Icon;
use leptos_use::use_intersection_observer;
use near_min_api::{
    ExperimentalTxDetails, QueryFinality, RpcClient,
    types::{
        AccessKeyPermissionView, AccountId, AccountIdRef, Action, ActionView, Balance, CryptoHash,
        FinalExecutionOutcomeWithReceiptView, FinalExecutionStatus, Finality, FunctionCallAction,
        NearGas, NearToken, ReceiptEnumView, TxExecutionStatus,
    },
};
use serde::Deserialize;

/// Rows in a page of history: transfers and the transactions they're part of, so a few
/// transactions' worth
const PAGE_ROWS: usize = 10;
/// How long a failed page waits before it's asked for again
const RETRY_AFTER: Duration = Duration::from_secs(3);
const TRANSACTION_TIMEOUT: Duration = Duration::from_secs(3);

#[derive(Debug)]
struct HistoryTransaction {
    transaction_id: CryptoHash,
    timestamp_millis: u64,
    other_account_id: AccountId,
    transaction: ExperimentalTxDetails,
}

/// Whoever is on the other side of `row` from `account_id`, or the token for a mint or burn
fn other_account_id(row: &TransferRow, account_id: &AccountId) -> Option<AccountId> {
    let other = if row.sender.as_ref() == Some(account_id) {
        &row.receiver
    } else {
        &row.sender
    };
    other.clone().or_else(|| row.token.clone())
}

lazy_static::lazy_static! {
    /// Details of transactions that are final, by hash, so each is only read once
    static ref FINAL_TRANSACTIONS: Mutex<HashMap<CryptoHash, ExperimentalTxDetails>> =
        Mutex::new(HashMap::new());
}

/// The transaction's details from archival RPC, or None if RPC can't read it, which is logged.
async fn transaction_details(
    rpc_client: &RpcClient,
    transaction_id: CryptoHash,
) -> Option<ExperimentalTxDetails> {
    if let Some(details) = FINAL_TRANSACTIONS.lock().await.get(&transaction_id) {
        return Some(details.clone());
    }
    let details = rpc_client
        .EXPERIMENTAL_tx_status(transaction_id)
        .await
        .inspect_err(|e| log::error!("Failed to fetch {transaction_id}: {e:?}"))
        .ok()?;
    if details.final_execution_status == TxExecutionStatus::Final {
        FINAL_TRANSACTIONS
            .lock()
            .await
            .insert(transaction_id, details.clone());
    }
    Some(details)
}

/// The local day `tx` happened on, which the history is grouped by
fn local_date(tx: &HistoryTransaction) -> NaiveDate {
    ChronoDateTime::from_timestamp_millis(tx.timestamp_millis as i64)
        .unwrap()
        .with_timezone(&Local)
        .date_naive()
}

/// Which page of history to load next
#[derive(Debug, Clone, PartialEq)]
enum NextPage {
    /// The newest, which comes with following the account
    Newest,
    Older(String),
    End,
}

/// The selected account's history from the price API: the newest page and every transaction
/// since as it happens, then older pages as they're scrolled to. Also lets actions rendered inside
/// it scroll it to the top.
#[derive(Clone, Copy)]
struct HistoryFeed {
    /// The account it's the history of, with its network
    account: Memo<Option<(AccountId, Network)>>,
    transactions: RwSignal<Vec<Arc<HistoryTransaction>>>,
    next_page: RwSignal<NextPage>,
    /// Whether an older page is loading
    loading_older: RwSignal<bool>,
    /// Transactions shown or being read, so each is read once
    known: StoredValue<HashSet<CryptoHash>>,
    /// Bumped whenever it starts over for another account, so what was being read is dropped
    generation: StoredValue<u64>,
    root: NodeRef<leptos::html::Div>,
}

impl HistoryFeed {
    fn new(root: NodeRef<leptos::html::Div>) -> Self {
        let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
        let account = Memo::new(move |_| {
            accounts.with(|accounts| {
                let account_id = accounts.selected_account_id.clone()?;
                let account = accounts
                    .accounts
                    .iter()
                    .find(|account| account.account_id == account_id)?;
                Some((account_id, account.network.clone()))
            })
        });
        let feed = Self {
            account,
            transactions: RwSignal::new(Vec::new()),
            next_page: RwSignal::new(NextPage::Newest),
            loading_older: RwSignal::new(false),
            known: StoredValue::new(HashSet::new()),
            generation: StoredValue::new(0),
            root,
        };
        feed.follow(expect_context::<ApiContext>());
        feed
    }

    /// Keeps up with the account: subscribes for its newest page and then every block's rows,
    /// picks up after the last row it had when the connection comes back, and starts over for
    /// another account.
    fn follow(self, api: ApiContext) {
        let api_network = expect_context::<NetworkContext>().network;
        // The account followed, None before the first, the subscription following it, and the
        // newest row it had
        let followed = StoredValue::new(None::<Option<AccountId>>);
        let sub = StoredValue::new(None::<Subscription>);
        let last_id = StoredValue::new(None::<i64>);
        // Notified when the subscription has to be made again
        let ended = Trigger::new();
        Effect::new(move |_| {
            ended.track();
            let account = self.account.get();
            let session = api.session();
            let api_network = api_network.get();
            let account_id = account.as_ref().map(|(account_id, _)| account_id.clone());
            if followed.get_value().as_ref() != Some(&account_id) {
                if let Some(sub) = sub.get_value() {
                    api.unsubscribe(sub);
                }
                sub.set_value(None);
                last_id.set_value(None);
                followed.set_value(Some(account_id));
                self.start_over(account.as_ref());
            }
            let Some((account_id, network)) = account else {
                return;
            };
            let Some(session) = session.filter(|_| network == api_network) else {
                // Its subscription is gone with the connection
                sub.set_value(None);
                return;
            };
            if sub.get_value().is_some_and(|sub| sub.session() == session) {
                return;
            }
            let resumed_after = last_id.get_value();
            let params = match resumed_after {
                Some(after_id) => HistorySubscribe::after(account_id.clone(), after_id),
                None => HistorySubscribe::newest(account_id.clone(), PAGE_ROWS),
            };
            let generation = self.generation.get_value();
            let keep_up = move |rows: &[TransferRow], latest_id: Option<i64>| {
                let newest = rows.iter().map(|row| row.id).chain(latest_id).max();
                last_id.update_value(|last_id| *last_id = (*last_id).max(newest));
            };
            let made = api.subscribe(params, {
                let network = network.clone();
                move |event| match event {
                    SubscriptionEvent::Reply(Ok(page)) => {
                        let mut rows = page.rows.0;
                        keep_up(&rows, page.latest_id);
                        if resumed_after.is_some() {
                            // What was missed, oldest first
                            rows.reverse();
                            self.add(generation, &account_id, &network, rows, None);
                        } else {
                            let next_page = page.next_cursor.map_or(NextPage::End, NextPage::Older);
                            self.add(generation, &account_id, &network, rows, Some(next_page));
                        }
                    }
                    SubscriptionEvent::Reply(Err(error)) => {
                        log::error!("Following the history of {account_id} failed: {error}");
                        if resumed_after.is_some() && error.code == ErrorCode::TooFarBehind {
                            // Too much was missed to catch up on: start over
                            followed.set_value(None);
                            ended.notify();
                        } else if resumed_after.is_none() {
                            self.next_page.set(NextPage::End);
                        }
                    }
                    SubscriptionEvent::Push(push) => {
                        let mut rows = push.rows;
                        keep_up(&rows, None);
                        // A block's rows come oldest first
                        rows.reverse();
                        self.add(generation, &account_id, &network, rows, None);
                    }
                    SubscriptionEvent::End(error) => {
                        log::warn!("The history of {account_id} stopped: {error}");
                        sub.set_value(None);
                        ended.notify();
                    }
                }
            });
            sub.set_value(made);
        });
        // Nothing follows the account once the page is left
        on_cleanup(move || {
            if let Some(sub) = sub.try_get_value().flatten() {
                api.unsubscribe(sub);
            }
        });
    }

    /// Shows nothing until `account`'s newest page comes, or nothing at all for a network without
    /// a price API.
    fn start_over(self, account: Option<&(AccountId, Network)>) {
        self.generation.update_value(|generation| *generation += 1);
        self.known.set_value(HashSet::new());
        self.transactions.set(Vec::new());
        self.loading_older.set(false);
        self.next_page.set(
            if account.is_some_and(|(_, network)| network.api_url().is_some()) {
                NextPage::Newest
            } else {
                NextPage::End
            },
        );
    }

    /// Reads the transactions of `rows`, newest first, that aren't shown or being read yet, and
    /// shows them where their time puts them, then moves on to `next_page` if given. Nothing is
    /// shown if it started over since `generation`.
    fn add(
        self,
        generation: u64,
        account_id: &AccountId,
        network: &Network,
        rows: Vec<TransferRow>,
        next_page: Option<NextPage>,
    ) {
        let read = self.read(account_id, network, rows);
        spawn_local(async move {
            let transactions = read.await;
            // Started over, or the page was left
            if self.generation.try_get_value() != Some(generation) {
                return;
            }
            self.show(transactions);
            if let Some(next_page) = next_page {
                self.next_page.set(next_page);
            }
        });
    }

    /// The transactions of `rows`, newest first, that aren't shown or being read yet, each once,
    /// with its newest row, read from RPC. Transactions RPC can't read are left out.
    fn read(
        self,
        account_id: &AccountId,
        network: &Network,
        rows: Vec<TransferRow>,
    ) -> impl Future<Output = Vec<Arc<HistoryTransaction>>> + 'static {
        let new = self
            .known
            .try_update_value(|known| {
                rows.into_iter()
                    .filter_map(|row| {
                        let transaction_id = row.transaction_id?;
                        let other_account_id = other_account_id(&row, account_id)?;
                        known.insert(transaction_id).then_some((
                            transaction_id,
                            row.timestamp_millis,
                            other_account_id,
                        ))
                    })
                    .collect::<Vec<_>>()
            })
            .unwrap_or_default();
        let rpc_client = network
            .default_rpc_client()
            .with_request_timeout(TRANSACTION_TIMEOUT)
            .with_max_retries(1);
        async move {
            join_all(
                new.into_iter()
                    .map(|(transaction_id, timestamp_millis, other_account_id)| {
                        let rpc_client = &rpc_client;
                        async move {
                            let transaction =
                                transaction_details(rpc_client, transaction_id).await?;
                            Some(Arc::new(HistoryTransaction {
                                transaction_id,
                                timestamp_millis,
                                other_account_id,
                                transaction,
                            }))
                        }
                    }),
            )
            .await
            .into_iter()
            .flatten()
            .collect()
        }
    }

    fn show(self, new: Vec<Arc<HistoryTransaction>>) {
        if new.is_empty() {
            return;
        }
        self.transactions.update(|transactions| {
            transactions.extend(new);
            transactions.sort_by_key(|tx| Reverse(tx.timestamp_millis));
        });
    }

    /// Loads the next older page, unless one is loading or there's none. One that fails is asked
    /// for again a little later, while the bottom is in view.
    fn load_older(self, api: ApiContext) {
        let NextPage::Older(cursor) = self.next_page.get_untracked() else {
            return;
        };
        let Some((account_id, network)) = self.account.get_untracked() else {
            return;
        };
        if self.loading_older.get_untracked() {
            return;
        }
        self.loading_older.set(true);
        let generation = self.generation.get_value();
        spawn_local(async move {
            let page = api
                .request(HistoryQuery::new(account_id.clone(), PAGE_ROWS, cursor))
                .await;
            let page = match page {
                Ok(page) => page,
                Err(error) => {
                    log::error!("Failed to load history: {error}");
                    set_timeout(
                        move || {
                            if self.generation.try_get_value() == Some(generation) {
                                self.loading_older.set(false);
                            }
                        },
                        RETRY_AFTER,
                    );
                    return;
                }
            };
            let transactions = self.read(&account_id, &network, page.rows.0).await;
            // Started over, or the page was left
            if self.generation.try_get_value() != Some(generation) {
                return;
            }
            self.show(transactions);
            self.next_page
                .set(page.next_cursor.map_or(NextPage::End, NextPage::Older));
            self.loading_older.set(false);
        });
    }

    fn scroll_to_top(&self) {
        if let Some(root) = self.root.get_untracked() {
            let options = web_sys::ScrollIntoViewOptions::new();
            options.set_behavior(web_sys::ScrollBehavior::Smooth);
            root.scroll_into_view_with_scroll_into_view_options(&options);
        }
    }
}

#[component]
pub fn History() -> impl IntoView {
    let api = expect_context::<ApiContext>();
    let root_ref = NodeRef::<leptos::html::Div>::new();
    let feed = HistoryFeed::new(root_ref);
    provide_context(feed);
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    let timestamp_format = move || config.get().timestamp_format;

    let is_loading = move || {
        feed.loading_older.get()
            || feed
                .next_page
                .with(|next_page| *next_page == NextPage::Newest)
    };
    let bottom_ref = NodeRef::<leptos::html::Div>::new();
    let (bottom_visible, set_bottom_visible) = signal(false);
    use_intersection_observer(bottom_ref, move |entries, _observer| {
        if let Some(entry) = entries.last() {
            set_bottom_visible.set(entry.is_intersecting());
        }
    });
    // Keeps loading while the bottom is in view, so a page too short to scroll leads to the next
    Effect::new(move || {
        if bottom_visible.get()
            && feed
                .next_page
                .with(|next_page| matches!(next_page, NextPage::Older(_)))
            && !feed.loading_older.get()
        {
            feed.load_older(api);
        }
    });
    let dates = Memo::new(move |_| {
        let mut dates = Vec::<NaiveDate>::new();
        for tx in feed.transactions.get().iter() {
            let date = local_date(tx);
            if dates.last() != Some(&date) {
                dates.push(date);
            }
        }
        dates
    });

    view! {
        <div class="md:p-4" node_ref=root_ref>
            <div class="flex justify-between items-center mb-4 px-4">
                <h1 class="text-white text-2xl font-bold pt-4 sm:pt-0">
                    {move || TranslationKey::PagesHistoryTitle.format(&[])}
                </h1>
                <button
                    on:click=move |_| {
                        config
                            .update(|c| {
                                c.timestamp_format = match c.timestamp_format {
                                    TimestampFormat::TimeAgo => TimestampFormat::DateTime,
                                    TimestampFormat::DateTime => TimestampFormat::TimeAgo,
                                }
                            })
                    }
                    class="text-white hover:text-neutral-300 transition-colors p-2 pt-5 cursor-pointer no-mobile-ripple"
                >
                    {move || {
                        if timestamp_format() == TimestampFormat::DateTime {
                            view! { <Icon icon=LuClock width="20" height="20" /> }
                        } else {
                            view! { <Icon icon=LuCalendar width="20" height="20" /> }
                        }
                    }}
                </button>
            </div>
            <div class="space-y-6">
                <For each=move || dates.get() key=|date| *date let:date>
                    <div class="space-y-2">
                        <h2 class="text-white text-lg font-semibold px-4 py-2 bg-neutral-950 sticky top-0 z-10">
                            {move || {
                                let today = Local::now().date_naive();
                                if date == today {
                                    TranslationKey::PagesHistoryGroupToday.format(&[])
                                } else if today.pred_opt() == Some(date) {
                                    TranslationKey::PagesHistoryGroupYesterday.format(&[])
                                } else {
                                    date.format("%B %d").to_string()
                                }
                            }}
                        </h2>
                        <div class="space-y-0 rounded-lg overflow-hidden">
                            <For
                                each=move || {
                                    feed
                                        .transactions
                                        .get()
                                        .into_iter()
                                        .filter(|tx| local_date(tx) == date)
                                        .collect::<Vec<_>>()
                                }
                                key=|tx| tx.transaction_id
                                let:tx
                            >
                                <TransactionRow tx=tx />
                            </For>
                        </div>
                    </div>
                </For>
            </div>
            <div node_ref=bottom_ref>
                {move || {
                    is_loading()
                        .then(|| {
                            view! {
                                <div class="flex items-center justify-center h-32">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            }
                        })
                }}
            </div>
        </div>
    }
}

#[component]
fn TransactionRow(tx: Arc<HistoryTransaction>) -> impl IntoView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    let timestamp_format = move || config.get().timestamp_format;
    let datetime = ChronoDateTime::from_timestamp_millis(tx.timestamp_millis as i64).unwrap();
    let now = Utc::now();
    let duration = now.signed_duration_since(datetime).to_std().unwrap();
    let time_ago = format_duration(duration);
    let formatted_datetime = datetime
        .with_timezone(&Local)
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();
    let account_id = format_account_id(&tx.other_account_id);
    let tx_hash = tx
        .transaction
        .final_execution_outcome
        .as_ref()
        .map(|t| t.final_outcome.transaction.hash);
    let content = view! {
        <div class="flex flex-col gap-1">
            <div class="text-white font-medium text-lg md:text-xl transition-all duration-100">
                {match &tx.transaction.final_execution_outcome {
                    Some(transaction) => {
                        display_transaction(transaction)
                            .into_any()
                    }
                    None => {
                        view! {
                            <div>
                                {move || {
                                    TranslationKey::PagesHistoryRowUnknown.format(&[])
                                }}
                            </div>
                        }
                            .into_any()
                    }
                }}
            </div>
        </div>
        <div class="flex flex-col gap-1 items-end justify-between h-35 text-right">
            <div class="text-neutral-300">
                {move || {
                    if timestamp_format() == TimestampFormat::DateTime {
                        formatted_datetime.clone()
                    } else {
                        TranslationKey::PagesHistoryTimeAgo
                            .format(&[("duration", &time_ago)])
                    }
                }}
            </div>
            <div class="text-neutral-400 text-sm max-w-[80px] w-[80px] md:max-w-[160px] md:w-[160px] sm:max-w-xs wrap-anywhere transition-all duration-100 ml-2">
                {account_id}
            </div>
        </div>
    };
    let has_hash = tx_hash.is_some();

    view! {
        <div
            on:click=move |_| {
                if !has_hash {
                    window()
                        .alert_with_message(
                            &TranslationKey::PagesHistoryRowTransactionNotFound
                                .format(&[]),
                        )
                        .unwrap();
                }
            }
            class="cursor-pointer hover:bg-neutral-700 odd:bg-neutral-800 even:bg-neutral-900 transition-all duration-100"
        >
            {match tx_hash {
                Some(hash) => {
                    view! {
                        <div class="flex justify-between items-center p-4 md:p-6 min-h-35 transition-all duration-100">
                            <a
                                href=move || {
                                    let selected_account_network = accounts()
                                        .accounts
                                        .into_iter()
                                        .find(|a| {
                                            a.account_id
                                                == accounts()
                                                    .selected_account_id
                                                    .expect("No selected account")
                                        })
                                        .map(|a| a.network.clone())
                                        .unwrap_or_else(|| {
                                            log::error!("Selected account not found");
                                            Network::Mainnet
                                        });
                                    let explorer_url = match &selected_account_network {
                                        Network::Mainnet => "https://nearblocks.io".to_string(),
                                        Network::Testnet => {
                                            "https://testnet.nearblocks.io".to_string()
                                        }
                                        Network::Localnet(network) => {
                                            if let Some(url) = &network.explorer_url {
                                                url.clone()
                                            } else {
                                                return "#".to_string();
                                            }
                                        }
                                    };
                                    format!("{explorer_url}/txns/{hash}")
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex-1 flex justify-between items-center"
                            >
                                {content}
                            </a>
                        </div>
                    }
                        .into_any()
                }
                None => {
                    view! {
                        <div class="flex justify-between items-center p-4 md:p-6 min-h-35 transition-all duration-100 odd:bg-neutral-800 even:bg-neutral-900">
                            {content}
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}

pub(crate) fn display_transaction(
    transaction: &FinalExecutionOutcomeWithReceiptView,
) -> impl IntoAny + use<> {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let Some(me) = accounts().selected_account_id else {
        return view! { <div>{move || TranslationKey::PagesHistoryNoSelectedAccount.format(&[])}</div> }
        .into_any();
    };
    let mut actions_config = ActionsConfig::default();
    let mut actions = Vec::<AnyView>::new();
    let fns = [
        add_storage_actions,
        add_lnc_actions,
        add_harvestmoon_actions,
        add_wrap_actions,
        add_ft_actions,
        add_near_actions,
        add_dex_actions,
        add_nft_actions,
        add_staking_actions,
        add_key_actions,
        add_account_actions,
    ];
    // First pass: build actions config
    for f in fns {
        f(
            &mut Vec::new(),
            transaction,
            &me,
            &mut actions_config,
            client.get_untracked(),
        );
    }
    // Second pass: build actions
    for f in fns {
        f(
            &mut actions,
            transaction,
            &me,
            &mut actions_config.clone(),
            client.get_untracked(),
        );
    }
    if actions.is_empty() {
        if transaction.final_outcome.transaction.actions.is_empty() {
            view! { <div>{move || TranslationKey::PagesHistoryEmptyTransaction.format(&[])}</div> }
                .into_any()
        } else {
            view! { <div>{move || TranslationKey::PagesHistoryRowAppInteraction.format(&[])}</div> }
                .into_any()
        }
    } else {
        view! { <div class="flex flex-col gap-2">{actions}</div> }.into_any()
    }
}

#[derive(Debug, Default, Clone)]
struct ActionsConfig {
    ft_event_format: TokenEventFormat,
    nft_event_format: TokenEventFormat,
    storage_deposit_to: HashSet<AccountId>,
    withdrawing_from_staking: HashMap<AccountId, NearToken>,
    /// Exchanges the account traded on, whose token transfers are shown as
    /// part of the trade and not as transfers
    swap_exchanges: HashSet<AccountId>,
    /// NEAR paid out for trades and unwraps, by payer, shown as part of them
    conversion_payouts: HashMap<AccountId, NearToken>,
}

#[derive(Debug, Clone, Copy, Default, PartialEq)]
enum TokenEventFormat {
    #[default]
    Full,
    Short,
    Hidden,
}

fn add_account_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    _me: &AccountIdRef,
    _actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for action in transaction.final_outcome.transaction.actions.iter() {
        let receiver_id = transaction.final_outcome.transaction.receiver_id.clone();
        match action {
            ActionView::CreateAccount => {
                actions.push(
                    view! {
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                                <Icon
                                    icon=icondata::LuUserPlus
                                    width="40"
                                    height="40"
                                    attr:class="min-w-[40px] min-h-[40px]"
                                />
                                <span>
                                    {move || {
                                        TranslationKey::PagesHistoryCreateAccount
                                            .format_view(
                                                vec![("account_id", format_account_id(&receiver_id))],
                                            )
                                    }}
                                </span>
                            </div>
                        </div>
                    }
                    .into_any(),
                );
            }
            ActionView::DeleteAccount { beneficiary_id } => {
                let beneficiary_id = beneficiary_id.clone();
                actions.push(
                    view! {
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                                <Icon
                                    icon=icondata::LuUserMinus
                                    width="40"
                                    height="40"
                                    attr:class="min-w-[40px] min-h-[40px]"
                                />
                                <span>
                                    {move || {
                                        TranslationKey::PagesHistoryDeleteAccountWithBeneficiary
                                            .format_view(
                                                vec![
                                                    ("receiver_id", format_account_id(&receiver_id)),
                                                    ("beneficiary_id", format_account_id(&beneficiary_id)),
                                                ],
                                            )
                                    }}
                                </span>
                            </div>
                        </div>
                    }
                    .into_any(),
                );
            }
            _ => {}
        }
    }
}

fn add_key_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    _actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    if transaction.final_outcome.transaction.receiver_id != me {
        return;
    }
    for action in transaction.final_outcome.transaction.actions.iter() {
        match action {
            ActionView::AddKey { access_key, .. } => match &access_key.permission {
                AccessKeyPermissionView::FullAccess
                | AccessKeyPermissionView::GasKeyFullAccess { .. } => {
                    actions.push(
                        view! {
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-2">
                                    <Icon
                                        icon=icondata::LuShieldAlert
                                        width="40"
                                        height="40"
                                        attr:class="min-w-[40px] min-h-[40px]"
                                    />
                                    <span>
                                        {move || {
                                            TranslationKey::PagesHistoryAddFullAccessKeyTitle
                                                .format(&[])
                                        }}
                                    </span>
                                </div>
                                <span class="text-sm text-neutral-400 pl-12">
                                    {move || {
                                        TranslationKey::PagesHistoryAddFullAccessKeyDescription
                                            .format(&[])
                                    }}
                                </span>
                            </div>
                        }
                        .into_any(),
                    );
                }
                AccessKeyPermissionView::FunctionCall {
                    allowance,
                    receiver_id,
                    method_names,
                }
                | AccessKeyPermissionView::GasKeyFunctionCall {
                    allowance,
                    receiver_id,
                    method_names,
                    ..
                } => {
                    let allowance = *allowance;
                    let receiver_id = receiver_id.clone();
                    let method_names = method_names.clone();
                    let methods_list = method_names.join(", ");
                    actions.push(
                        view! {
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-2">
                                    <Icon
                                        icon=icondata::LuKeyRound
                                        width="40"
                                        height="40"
                                        attr:class="min-w-[40px] min-h-[40px]"
                                    />
                                    <span>
                                        {move || {
                                            TranslationKey::PagesHistoryAddFunctionCallKeyTitle
                                                .format(&[])
                                        }}
                                    </span>
                                </div>
                                <span class="text-sm text-neutral-400 pl-12">
                                    {move || {
                                        let methods_fragment = if method_names.is_empty() {
                                            view! {
                                                {move || {
                                                    TranslationKey::PagesHistoryAddFunctionCallKeyAllMethods
                                                        .format(&[])
                                                }}
                                            }
                                                .into_any()
                                        } else {
                                            let methods_list = methods_list.clone();
                                            view! {
                                                <span class="hover-capable-only bg-neutral-600 hover:bg-neutral-800 px-1 rounded group relative">
                                                    {move || {
                                                        TranslationKey::PagesHistoryAddFunctionCallKeyCertainMethods
                                                            .format(&[])
                                                    }}
                                                    <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-neutral-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                        {move || {
                                                            TranslationKey::PagesHistoryAddFunctionCallKeyMethodsTooltip
                                                                .format(&[("methods", methods_list.as_str())])
                                                        }}
                                                    </div>
                                                </span>
                                                <span class="hover-incapable-only rounded">
                                                    {move || {
                                                        TranslationKey::PagesHistoryAddFunctionCallKeyCertainMethods
                                                            .format(&[])
                                                    }}
                                                </span>
                                            }
                                                .into_any()
                                        };
                                        let allowance_fragment = match allowance {
                                            Some(allowance) => {
                                                let amount = format_token_amount(
                                                    allowance.as_yoctonear(),
                                                    24,
                                                    "NEAR",
                                                );
                                                view! {
                                                    {move || {
                                                        TranslationKey::PagesHistoryAddFunctionCallKeyAllowanceUpTo
                                                            .format(&[("amount", amount.as_str())])
                                                    }}
                                                }
                                                    .into_any()
                                            }
                                            None => {
                                                view! {
                                                    {move || {
                                                        TranslationKey::PagesHistoryAddFunctionCallKeyAllowanceUnlimited
                                                            .format(&[])
                                                    }}
                                                }
                                                    .into_any()
                                            }
                                        };
                                        let contract_fragment = match receiver_id
                                            .parse::<AccountId>()
                                        {
                                            Ok(id) => format_account_id(id.as_ref()),
                                            Err(_) => {
                                                view! { <span>{receiver_id.as_str()}</span> }.into_any()
                                            }
                                        };
                                        TranslationKey::PagesHistoryAddFunctionCallKeyDescription
                                            .format_view(
                                                vec![
                                                    ("methods", methods_fragment),
                                                    ("contract", contract_fragment),
                                                    ("allowance", allowance_fragment),
                                                ],
                                            )
                                    }}
                                </span>
                            </div>
                        }
                        .into_any(),
                    );
                }
            },
            ActionView::DeleteKey { .. } => {
                actions.push(
                    view! {
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                                <Icon
                                    icon=icondata::LuTrash2
                                    width="40"
                                    height="40"
                                    attr:class="min-w-[40px] min-h-[40px]"
                                />
                                <span>
                                    {move || {
                                        TranslationKey::PagesHistoryDeleteKeyTitle.format(&[])
                                    }}
                                </span>
                            </div>
                            <span class="text-sm text-neutral-400 pl-12">
                                {move || {
                                    TranslationKey::PagesHistoryDeleteKeyDescription.format(&[])
                                }}
                            </span>
                        </div>
                    }
                    .into_any(),
                );
            }
            _ => {}
        }
    }
}

fn add_staking_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        if !receipt.receiver_id.as_str().ends_with(".pool.near")
            && !receipt.receiver_id.as_str().ends_with(".poolv1.near")
        {
            continue;
        }
        for log in transaction
            .final_outcome
            .receipts_outcome
            .iter()
            .find(|r| r.id == receipt.receipt_id)
            .expect("receipt outcome not found")
            .outcome
            .logs
            .iter()
        {
            if let Some(log) = log.strip_prefix("@")
                && let Some((account_id, rest)) = log.split_once(" ")
                && account_id == me
            {
                if let Some(rest) = rest.strip_prefix("staking ") {
                    if let Some((amount, _)) = rest.split_once(".")
                        && let Ok(amount) = amount.parse::<u128>()
                    {
                        actions.push(
                            view! {
                                <div class="flex items-center gap-2">
                                    <Icon
                                        icon=icondata::LuLock
                                        width="40"
                                        height="40"
                                        attr:class="min-w-[40px] min-h-[40px]"
                                    />
                                    <span>
                                        {move || {
                                            let amount = format_token_amount(amount, 24, "NEAR");
                                            TranslationKey::PagesHistoryStakeNear
                                                .format(&[("amount", amount.as_str())])
                                        }}
                                    </span>
                                </div>
                            }
                            .into_any(),
                        );
                    }
                } else if let Some(rest) = rest.strip_prefix("unstaking ") {
                    if let Some((amount, _)) = rest.split_once(".")
                        && let Ok(amount) = amount.parse::<u128>()
                    {
                        actions.push(
                            view! {
                                <div class="flex items-center gap-2">
                                    <Icon
                                        icon=icondata::LuLockOpen
                                        width="40"
                                        height="40"
                                        attr:class="min-w-[40px] min-h-[40px]"
                                    />
                                    <span>
                                        {move || {
                                            let amount = format_token_amount(amount, 24, "NEAR");
                                            TranslationKey::PagesHistoryStartUnstakingNear
                                                .format(&[("amount", amount.as_str())])
                                        }}
                                    </span>
                                </div>
                            }
                            .into_any(),
                        );
                    }
                } else if let Some(rest) = rest.strip_prefix("withdrawing ")
                    && let Some((amount, _)) = rest.split_once(".")
                    && let Ok(amount) = amount.parse::<u128>()
                {
                    actions.push(
                        view! {
                            <div class="flex items-center gap-2">
                                <Icon
                                    icon=icondata::LuDownload
                                    width="40"
                                    height="40"
                                    attr:class="min-w-[40px] min-h-[40px]"
                                />
                                <span>
                                    {move || {
                                        let amount = format_token_amount(amount, 24, "NEAR");
                                        TranslationKey::PagesHistoryWithdrawNear
                                            .format(&[("amount", amount.as_str())])
                                    }}
                                </span>
                            </div>
                        }
                        .into_any(),
                    );
                    let withdrawing = actions_config
                        .withdrawing_from_staking
                        .entry(receipt.receiver_id.clone())
                        .or_default();
                    *withdrawing = withdrawing
                        .checked_add(NearToken::from_yoctonear(amount))
                        .unwrap();
                }
            }
        }
    }
}

fn add_near_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        if let ReceiptEnumView::Action {
            actions: tx_actions,
            ..
        } = &receipt.receipt
        {
            for action in tx_actions.iter() {
                if let ActionView::Transfer { deposit } = action
                    && !deposit.is_zero()
                {
                    if receipt.predecessor_id == me {
                        let deposit = *deposit;
                        actions.push(
                            view! {
                                <div class="flex items-center gap-2">
                                    <img
                                        src=format!(
                                            "data:image/svg+xml;base64,{}",
                                            base64::prelude::BASE64_STANDARD
                                                .encode(include_bytes!("../data/near.svg")),
                                        )
                                        width="40"
                                        height="40"
                                        class="rounded-full"
                                    />
                                    <span>
                                        {move || {
                                            let amount = format_token_amount(
                                                deposit.as_yoctonear(),
                                                24,
                                                "NEAR",
                                            );
                                            TranslationKey::PagesHistoryTransferNear
                                                .format(&[("amount", amount.as_str())])
                                        }}
                                    </span>
                                </div>
                            }
                            .into_any(),
                        );
                    }
                    if receipt.receiver_id == me && receipt.predecessor_id != "system" {
                        if let Some(withdraw_amount) = actions_config
                            .withdrawing_from_staking
                            .remove(&receipt.predecessor_id)
                            && withdraw_amount == *deposit
                        {
                            continue;
                        }
                        if actions_config
                            .conversion_payouts
                            .get(&receipt.predecessor_id)
                            == Some(deposit)
                        {
                            continue;
                        }
                        let incoming_deposit = *deposit;
                        actions.push(
                            if actions_config
                                .storage_deposit_to
                                .contains(&receipt.predecessor_id)
                            {
                                view! {
                                    <div class="flex items-center gap-2">
                                        <img
                                            src=format!(
                                                "data:image/svg+xml;base64,{}",
                                                base64::prelude::BASE64_STANDARD
                                                    .encode(include_bytes!("../data/near.svg")),
                                            )
                                            width="40"
                                            height="40"
                                            class="rounded-sm"
                                        />
                                        <span>
                                            {move || {
                                                let amount = format_token_amount(
                                                    incoming_deposit.as_yoctonear(),
                                                    24,
                                                    "NEAR",
                                                );
                                                TranslationKey::PagesHistoryStorageDepositRefundNear
                                                    .format(&[("amount", amount.as_str())])
                                            }}
                                        </span>
                                    </div>
                                }
                                .into_any()
                            } else {
                                let sender_id = receipt.predecessor_id.clone();
                                view! {
                                    <div class="flex items-center gap-2">
                                        <img
                                            src=format!(
                                                "data:image/svg+xml;base64,{}",
                                                base64::prelude::BASE64_STANDARD
                                                    .encode(include_bytes!("../data/near.svg")),
                                            )
                                            width="40"
                                            height="40"
                                            class="rounded-full"
                                        />
                                        <span>
                                            {move || {
                                                let amount = format_token_amount(
                                                    incoming_deposit.as_yoctonear(),
                                                    24,
                                                    "NEAR",
                                                );
                                                TranslationKey::PagesHistoryReceiveNearFrom
                                                    .format_view(
                                                        vec![
                                                            ("amount", amount.into_any()),
                                                            ("sender", format_account_id(&sender_id)),
                                                        ],
                                                    )
                                            }}
                                        </span>
                                    </div>
                                }
                                .into_any()
                            },
                        );
                    }
                }
            }
        }
    }
}

const STORAGE_WITHDRAW_THRESHOLD: NearToken = NearToken::from_millinear(100);

#[component]
fn StorageWithdrawButton(contract_id: AccountId, account_id: AccountId) -> impl IntoView {
    let RpcContext { client } = expect_context::<RpcContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let feed = expect_context::<HistoryFeed>();
    let (dismissed, set_dismissed) = signal(false);
    let (submitted, set_submitted) = signal(false);

    let withdrawable = LocalResource::new({
        let contract_id = contract_id.clone();
        move || {
            let rpc_client = client.get_untracked();
            let contract_id = contract_id.clone();
            let account_id = account_id.clone();
            async move {
                let balance = rpc_client
                    .call::<Option<StorageBalance>>(
                        contract_id,
                        "storage_balance_of",
                        serde_json::json!({ "account_id": account_id }),
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                    .await
                    .ok()??;
                (balance.available >= STORAGE_WITHDRAW_THRESHOLD).then_some(balance.available)
            }
        }
    });

    move || {
        if dismissed() {
            return ().into_any();
        }
        let Some(Some(amount)) = withdrawable.get() else {
            return ().into_any();
        };
        let contract_id = contract_id.clone();
        let formatted_amount = format_token_amount(amount.as_yoctonear(), 24, "NEAR");
        let label = TranslationKey::PagesHistoryStorageWithdraw
            .format(&[("amount", formatted_amount.as_str())]);
        view! {
            <button
                class="bg-neutral-600 hover:bg-neutral-500 disabled:opacity-50 disabled:cursor-default text-white text-sm px-3 py-1 rounded-lg cursor-pointer transition-colors"
                disabled=submitted
                on:click=move |ev| {
                    // The button lives inside the row's explorer link
                    ev.prevent_default();
                    ev.stop_propagation();
                    if submitted.get_untracked() {
                        return;
                    }
                    let Some(signer_id) = accounts.get_untracked().selected_account_id else {
                        return;
                    };
                    set_submitted(true);
                    let description = TranslationKey::MiscTransactionStorageWithdraw
                        .format(&[("contract_id", contract_id.as_str())]);
                    let (rx, tx) = EnqueuedTransaction::create(
                        description,
                        signer_id,
                        contract_id.clone(),
                        vec![
                            Action::FunctionCall(
                                Box::new(FunctionCallAction {
                                    method_name: "storage_withdraw".to_string(),
                                    args: serde_json::json!({ "amount": amount.as_yoctonear().to_string() })
                                        .to_string()
                                        .into_bytes(),
                                    gas: NearGas::from_tgas(30).into(),
                                    deposit: NearToken::from_yoctonear(1),
                                }),
                            ),
                        ],
                        false,
                    );
                    add_transaction.update(|txs| txs.push(tx));
                    spawn_local(async move {
                        let succeeded = match rx.await {
                            Ok(Ok(details)) => {
                                details
                                    .final_execution_outcome
                                    .is_some_and(|outcome| {
                                        !matches!(
                                            outcome.final_outcome.status,
                                            FinalExecutionStatus::Failure(_)
                                        )
                                    })
                            }
                            Ok(Err(err)) => {
                                log::error!("Storage withdraw failed: {err}");
                                false
                            }
                            Err(err) => {
                                log::error!("Storage withdraw was cancelled: {err}");
                                false
                            }
                        };
                        set_dismissed(true);
                        // The withdrawal comes in at the top
                        if succeeded {
                            feed.scroll_to_top();
                        }
                    });
                }
            >
                {label}
            </button>
        }
            .into_any()
    }
}

fn add_storage_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        if let ReceiptEnumView::Action {
            actions: tx_actions,
            ..
        } = &receipt.receipt
        {
            for action in tx_actions.iter() {
                if let ActionView::FunctionCall {
                    method_name,
                    args: _,
                    deposit,
                    ..
                } = action
                    && method_name == "storage_deposit"
                    && receipt.predecessor_id == me
                {
                    let deposit_amount = *deposit;
                    let withdraw_button =
                        (deposit_amount > STORAGE_WITHDRAW_THRESHOLD).then(|| {
                            let contract_id = receipt.receiver_id.clone();
                            let account_id = me.to_owned();
                            view! { <StorageWithdrawButton contract_id account_id /> }
                        });
                    actions.push(
                        view! {
                            <div class="flex flex-wrap items-center gap-2">
                                <img
                                    src=format!(
                                        "data:image/svg+xml;base64,{}",
                                        base64::prelude::BASE64_STANDARD
                                            .encode(include_bytes!("../data/near.svg")),
                                    )
                                    width="40"
                                    height="40"
                                    class="rounded-sm"
                                />
                                <span class="flex items-center gap-1">
                                    {move || {
                                        let amount = format_token_amount(
                                            deposit_amount.as_yoctonear(),
                                            24,
                                            "NEAR",
                                        );
                                        let line = TranslationKey::PagesHistoryStorageDepositNear
                                            .format(&[("amount", amount.as_str())]);
                                        let tip = TranslationKey::PagesHistoryStorageDepositTooltip
                                            .format(&[]);
                                        view! {
                                            {line}
                                            <Tooltip text=tip />
                                        }
                                    }}
                                </span>
                                {withdraw_button}
                            </div>
                        }
                        .into_any(),
                    );
                    actions_config
                        .storage_deposit_to
                        .insert(receipt.receiver_id.clone());
                }
            }
        }
    }
}

fn token_conversion_view(
    title_icon: AnyView,
    title: TranslationKey,
    icon_in: Option<String>,
    amount_in: String,
    icon_out: Option<String>,
    amount_out: String,
) -> AnyView {
    view! {
        <div class="flex gap-3 flex-col">
            <div class="flex items-center gap-3">
                {title_icon} <span>{move || title.format(&[])}</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex items-center gap-2">
                    <img src=icon_in width="30" height="30" class="rounded-full" />
                    <span class="text-sm sm:text-lg font-medium wrap-anywhere">{amount_in}</span>
                </div>
                <Icon
                    icon=LuArrowRight
                    width="16"
                    height="16"
                    attr:class="text-neutral-400 min-w-4 min-h-4"
                />
                <div class="flex items-center gap-2 wrap-anywhere">
                    <img src=icon_out width="30" height="30" class="rounded-full" />
                    <span class="text-sm sm:text-lg font-medium">{amount_out}</span>
                </div>
            </div>
        </div>
    }
    .into_any()
}

fn add_wrap_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        if receipt.receiver_id != "wrap.near" && receipt.receiver_id != "wrap.testnet" {
            continue;
        }
        for log in transaction
            .final_outcome
            .receipts_outcome
            .iter()
            .find(|r| r.id == receipt.receipt_id)
            .expect("receipt outcome not found")
            .outcome
            .logs
            .iter()
        {
            if let Some(deposit_details) = log.strip_prefix("Deposit ")
                && let Some((amount, receiver)) = deposit_details.split_once(" NEAR to ")
                && let (Ok(amount), Ok(depositor)) =
                    (amount.parse::<u128>(), receiver.parse::<AccountId>())
                && depositor == me
            {
                actions.push(token_conversion_view(
                    view! {
                        <Icon
                            icon=LuPackage
                            width="40"
                            height="40"
                            attr:class="min-w-[40px] min-h-[40px]"
                        />
                    }
                    .into_any(),
                    TranslationKey::PagesHistoryWrap,
                    near_metadata().icon,
                    format_token_amount(amount, 24, "NEAR"),
                    near_metadata().icon,
                    format_token_amount(amount, 24, "wNEAR"),
                ));
            }
            if let Some(withdraw_details) = log.strip_prefix("Withdraw ")
                && let Some((amount, receiver)) = withdraw_details.split_once(" NEAR from ")
                && let (Ok(amount), Ok(withdrawer)) =
                    (amount.parse::<u128>(), receiver.parse::<AccountId>())
                && withdrawer == me
            {
                // The payout also returns the 1 yoctoNEAR that `near_withdraw` requires
                actions_config.conversion_payouts.insert(
                    receipt.receiver_id.clone(),
                    NearToken::from_yoctonear(amount + 1),
                );
                actions.push(token_conversion_view(
                    view! {
                        <Icon
                            icon=LuPackageOpen
                            width="40"
                            height="40"
                            attr:class="min-w-[40px] min-h-[40px]"
                        />
                    }
                    .into_any(),
                    TranslationKey::PagesHistoryUnwrap,
                    near_metadata().icon,
                    format_token_amount(amount, 24, "wNEAR"),
                    near_metadata().icon,
                    format_token_amount(amount, 24, "NEAR"),
                ));
            }
        }
    }
}

#[derive(Debug, Clone)]
struct Trade {
    exchange_id: AccountId,
    token_in: Token,
    amount_in: Balance,
    token_out: Token,
    amount_out: Balance,
}

fn parse_trades(
    exchange_id: &AccountIdRef,
    log: &str,
    me: &AccountIdRef,
    signer_id: &AccountIdRef,
) -> Vec<Trade> {
    let trade =
        |token_in: Token, amount_in: Balance, token_out: Token, amount_out: Balance| Trade {
            exchange_id: exchange_id.to_owned(),
            token_in,
            amount_in,
            token_out,
            amount_out,
        };
    match exchange_id.as_str() {
        // Rhea doesn't log who swapped, so only swaps in transactions `me` signed are counted
        "v2.ref-finance.near" => {
            if signer_id == me
                && let Some(swap) = log.strip_prefix("Swapped ")
                && let Some((input, output)) = swap
                    .split(',')
                    .next()
                    .and_then(|swap| swap.split_once(" for "))
                && let Some((amount_in, token_in)) = input.split_once(' ')
                && let Some((amount_out, token_out)) = output.split_once(' ')
                && let (Ok(amount_in), Ok(token_in), Ok(amount_out), Ok(token_out)) = (
                    amount_in.parse(),
                    token_in.parse(),
                    amount_out.parse(),
                    token_out.parse(),
                )
            {
                vec![trade(
                    Token::Nep141(token_in),
                    amount_in,
                    Token::Nep141(token_out),
                    amount_out,
                )]
            } else {
                vec![]
            }
        }
        "dclv2.ref-labs.near" => match EventLogData::<RefDclSwapLog>::deserialize(log) {
            Ok(log) if log.validate() => log
                .data
                .iter()
                .filter(|swap| swap.swapper == me)
                .map(|swap| {
                    trade(
                        Token::Nep141(swap.token_in.clone()),
                        swap.amount_in,
                        Token::Nep141(swap.token_out.clone()),
                        swap.amount_out,
                    )
                })
                .collect(),
            _ => vec![],
        },
        "dex.intear.near" => match EventLogData::<IntearDexSwapLog>::deserialize(log) {
            Ok(log) if log.validate() && log.data.trader == me => {
                let token = |asset_id: &str| match asset_id {
                    "near" => Some(Token::Near),
                    _ => asset_id
                        .strip_prefix("nep141:")?
                        .parse()
                        .ok()
                        .map(Token::Nep141),
                };
                match (
                    token(&log.data.request.asset_in),
                    token(&log.data.request.asset_out),
                ) {
                    (Some(token_in), Some(token_out)) => vec![trade(
                        token_in,
                        log.data.amount_in,
                        token_out,
                        log.data.amount_out,
                    )],
                    _ => vec![],
                }
            }
            _ => vec![],
        },
        _ => vec![],
    }
}

fn add_dex_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    rpc_client: RpcClient,
) {
    let signer_id = &transaction.final_outcome.transaction.signer_id;
    let mut trades = Vec::<Trade>::new();
    for receipt_outcome in transaction.final_outcome.receipts_outcome.iter() {
        for log in receipt_outcome.outcome.logs.iter() {
            for hop in parse_trades(&receipt_outcome.outcome.executor_id, log, me, signer_id) {
                match trades.last_mut() {
                    Some(trade)
                        if trade.exchange_id == hop.exchange_id
                            && trade.token_out == hop.token_in =>
                    {
                        trade.token_out = hop.token_out;
                        trade.amount_out = hop.amount_out;
                    }
                    _ => trades.push(hop),
                }
            }
        }
    }

    for trade in trades.iter_mut() {
        actions_config
            .swap_exchanges
            .insert(trade.exchange_id.clone());
        // Exchanges can unwrap the output and pay it out as NEAR
        let paid_out_as_near = transaction.receipts.iter().any(|receipt| {
            receipt.predecessor_id == trade.exchange_id
                && receipt.receiver_id == me
                && matches!(
                    &receipt.receipt,
                    ReceiptEnumView::Action { actions, .. }
                        if actions.iter().any(|action| matches!(
                            action,
                            ActionView::Transfer { deposit }
                                if deposit.as_yoctonear() == trade.amount_out
                        ))
                )
        });
        if paid_out_as_near {
            trade.token_out = Token::Near;
            actions_config.conversion_payouts.insert(
                trade.exchange_id.clone(),
                NearToken::from_yoctonear(trade.amount_out),
            );
        }
    }

    for trade in trades {
        let exchange_logo = match trade.exchange_id.as_str() {
            "dex.intear.near" => "/intear.svg",
            "v2.ref-finance.near" | "dclv2.ref-labs.near" => "/history-rhea.svg",
            _ => continue,
        };
        let token_metadata = |token: Token| {
            let rpc_client = rpc_client.clone();
            LocalResource::new(move || {
                let token = token.clone();
                let rpc_client = rpc_client.clone();
                async move {
                    match token {
                        Token::Near => Ok(near_metadata()),
                        Token::Nep141(token_id) | Token::Rhea(token_id) => {
                            get_ft_metadata(token_id, rpc_client).await
                        }
                    }
                }
            })
        };
        let token_in_metadata = token_metadata(trade.token_in);
        let token_out_metadata = token_metadata(trade.token_out);
        let (amount_in, amount_out) = (trade.amount_in, trade.amount_out);

        actions.push(
            (move || {
                if let (Some(Ok(in_meta)), Some(Ok(out_meta))) =
                    (token_in_metadata.get(), token_out_metadata.get())
                {
                    token_conversion_view(
                        view! {
                            <img
                                src=exchange_logo
                                width="40"
                                height="40"
                                class="min-w-[40px] min-h-[40px]"
                            />
                        }
                        .into_any(),
                        TranslationKey::PagesHistorySwap,
                        in_meta.icon,
                        format_token_amount(amount_in, in_meta.decimals, &in_meta.symbol),
                        out_meta.icon,
                        format_token_amount(amount_out, out_meta.decimals, &out_meta.symbol),
                    )
                } else {
                    ().into_any()
                }
            })
            .into_any(),
        );
    }
}

fn add_ft_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        for log in transaction
            .final_outcome
            .receipts_outcome
            .iter()
            .find(|r| r.id == receipt.receipt_id)
            .expect("receipt outcome not found")
            .outcome
            .logs
            .iter()
        {
            if let (Ok(log), _) | (_, Ok(log)) = (
                EventLogData::<FtTransferLog>::deserialize(log),
                FtTransferLog::deserialize_tkn_farm_log(log).map(|log| EventLogData {
                    standard: NEP141_EVENT_STANDARD_STRING.to_string(),
                    version: "0.0.0".to_string(), // not standard
                    event: "ft_transfer".to_string(),
                    data: log,
                }),
            ) {
                let executor_id = receipt.receiver_id.clone();
                let rpc_client = rpc_client.clone();
                let metadata = LocalResource::new(move || {
                    get_ft_metadata(executor_id.clone(), rpc_client.clone())
                });
                if log.validate() {
                    for transfer in log.data.iter().cloned() {
                        if transfer.old_owner_id == me
                            && !actions_config
                                .swap_exchanges
                                .contains(&transfer.new_owner_id)
                        {
                            let transfer = transfer.clone();
                            let ft_event_format = actions_config.ft_event_format;
                            if ft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            let new_owner_id = transfer.new_owner_id.clone();
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                let metadata = metadata.clone();
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if ft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if ft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if ft_event_format == TokenEventFormat::Short {
                                                            view! {
                                                                <span class="text-red-300 text-lg">
                                                                    "-"
                                                                    {move || format_token_amount(
                                                                        transfer.amount,
                                                                        metadata.decimals,
                                                                        &metadata.symbol,
                                                                    )}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            let memo = transfer.memo.clone();
                                                            view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <span>
                                                                        {move || {
                                                                            let amount = format_token_amount(
                                                                                transfer.amount,
                                                                                metadata.decimals,
                                                                                &metadata.symbol,
                                                                            );
                                                                            TranslationKey::PagesHistoryFtSendTo
                                                                                .format_view(
                                                                                    vec![
                                                                                        ("amount", amount.into_any()),
                                                                                        ("recipient", format_account_id(&new_owner_id)),
                                                                                    ],
                                                                                )
                                                                        }}
                                                                    </span>
                                                                    <span class="text-xs">{memo}</span>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                        if transfer.new_owner_id == me
                            && !actions_config
                                .swap_exchanges
                                .contains(&transfer.old_owner_id)
                        {
                            let transfer = transfer.clone();
                            let ft_event_format = actions_config.ft_event_format;
                            if ft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(view! {
                                <div class="flex items-center gap-2">
                                    {move || {
                                        if let Some(Ok(metadata)) = metadata.get() {
                                            view! {
                                                <img
                                                    src=metadata.icon.clone()
                                                    width=if ft_event_format == TokenEventFormat::Short {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    height=if ft_event_format == TokenEventFormat::Short {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    class="rounded-full"
                                                />
                                                <span>
                                                    {if ft_event_format == TokenEventFormat::Short {
                                                        view! {
                                                            <span class="text-green-300 text-lg">
                                                                "+"
                                                                {format_token_amount(
                                                                    transfer.amount,
                                                                    metadata.decimals,
                                                                    &metadata.symbol,
                                                                )}
                                                            </span>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        let memo = transfer.memo.clone();
                                                        let sender_id = transfer.old_owner_id.clone();
                                                        view! {
                                                            <div class="flex flex-col gap-1">
                                                                <span>
                                                                    {move || {
                                                                        let amount = format_token_amount(
                                                                            transfer.amount,
                                                                            metadata.decimals,
                                                                            &metadata.symbol,
                                                                        );
                                                                        TranslationKey::PagesHistoryFtReceiveFrom
                                                                            .format_view(
                                                                                vec![
                                                                                    ("amount", amount.into_any()),
                                                                                    ("sender", format_account_id(&sender_id)),
                                                                                ],
                                                                            )
                                                                    }}
                                                                </span>
                                                                <span class="text-xs">{memo}</span>
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }}
                                                </span>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            }.into_any());
                        }
                    }
                }
            }
            if let Ok(log) = EventLogData::<FtMintLog>::deserialize(log) {
                let executor_id = receipt.receiver_id.clone();
                let rpc_client = rpc_client.clone();
                let metadata = LocalResource::new(move || {
                    get_ft_metadata(executor_id.clone(), rpc_client.clone())
                });
                if log.validate() {
                    for mint in log.data.iter().cloned() {
                        if mint.owner_id == me {
                            let ft_event_format = actions_config.ft_event_format;
                            if ft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if ft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if ft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if ft_event_format == TokenEventFormat::Short {
                                                            view! {
                                                                <span class="text-green-300 text-lg">
                                                                    "+"
                                                                    {format_token_amount(
                                                                        mint.amount,
                                                                        metadata.decimals,
                                                                        &metadata.symbol,
                                                                    )}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            let memo = mint.memo.clone();
                                                            view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <span>
                                                                        {move || {
                                                                            let amount = format_token_amount(
                                                                                mint.amount,
                                                                                metadata.decimals,
                                                                                &metadata.symbol,
                                                                            );
                                                                            TranslationKey::PagesHistoryFtMint
                                                                                .format(&[("amount", amount.as_str())])
                                                                        }}
                                                                    </span>
                                                                    <span class="text-xs">{memo}</span>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                    }
                }
            }
            if let Ok(log) = EventLogData::<FtBurnLog>::deserialize(log) {
                let executor_id = receipt.receiver_id.clone();
                let rpc_client = rpc_client.clone();
                let metadata = LocalResource::new(move || {
                    get_ft_metadata(executor_id.clone(), rpc_client.clone())
                });
                if log.validate() {
                    for burn in log.data.iter().cloned() {
                        if burn.owner_id == me {
                            let ft_event_format = actions_config.ft_event_format;
                            if ft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if ft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if ft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if ft_event_format == TokenEventFormat::Short {
                                                            view! {
                                                                <span class="text-red-300 text-lg">
                                                                    "-"
                                                                    {format_token_amount(
                                                                        burn.amount,
                                                                        metadata.decimals,
                                                                        &metadata.symbol,
                                                                    )}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            let memo = burn.memo.clone();
                                                            view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <span>
                                                                        {move || {
                                                                            let amount = format_token_amount(
                                                                                burn.amount,
                                                                                metadata.decimals,
                                                                                &metadata.symbol,
                                                                            );
                                                                            TranslationKey::PagesHistoryFtBurn
                                                                                .format(&[("amount", amount.as_str())])
                                                                        }}
                                                                    </span>
                                                                    <span class="text-xs">{memo}</span>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                    }
                }
            }
        }
    }
}

fn add_nft_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        for log in transaction
            .final_outcome
            .receipts_outcome
            .iter()
            .find(|r| r.id == receipt.receipt_id)
            .expect("receipt outcome not found")
            .outcome
            .logs
            .iter()
        {
            if let Ok(log) = EventLogData::<NftTransferLog>::deserialize(log) {
                let executor_id = receipt.receiver_id.clone();
                let metadata =
                    LocalResource::new(move || get_nft_collection_metadata(executor_id.clone()));
                if log.validate() {
                    for transfer in log.data.iter().cloned() {
                        if transfer.old_owner_id == me {
                            let transfer = transfer.clone();
                            let nft_event_format = actions_config.nft_event_format;
                            if nft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            let new_owner_id = transfer.new_owner_id.clone();
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                let metadata = metadata.clone();
                                                let nft_count = transfer.token_ids.len();
                                                let collection_name = metadata.name.clone();
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if nft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if nft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if nft_event_format == TokenEventFormat::Short {
                                                            view! {
                                                                <span class="text-red-300 text-lg">
                                                                    "-" {transfer.token_ids.len().to_string()} " "
                                                                    {metadata.symbol.clone()}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            let memo = transfer.memo.clone();
                                                            view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <span>
                                                                        {move || {
                                                                            TranslationKey::PagesHistoryNftSendTo
                                                                                .format_view(
                                                                                    vec![
                                                                                        ("count", nft_count.into_any()),
                                                                                        ("collection", collection_name.clone().into_any()),
                                                                                        ("recipient", format_account_id(&new_owner_id)),
                                                                                    ],
                                                                                )
                                                                        }}
                                                                    </span>
                                                                    <span class="text-xs">{memo}</span>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                        if transfer.new_owner_id == me {
                            let transfer = transfer.clone();
                            let nft_event_format = actions_config.nft_event_format;
                            if nft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(view! {
                                <div class="flex items-center gap-2">
                                    {move || {
                                        let old_owner_id = transfer.old_owner_id.clone();
                                        if let Some(Ok(metadata)) = metadata.get() {
                                            let metadata = metadata.clone();
                                            let nft_count = transfer.token_ids.len();
                                            let collection_name = metadata.name.clone();
                                            view! {
                                                <img
                                                    src=metadata.icon.clone()
                                                    width=if nft_event_format == TokenEventFormat::Short {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    height=if nft_event_format == TokenEventFormat::Short {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    class="rounded-full"
                                                />
                                                <span>
                                                    {if nft_event_format == TokenEventFormat::Short {
                                                        view! {
                                                            <span class="text-green-300 text-lg">
                                                                "+" {transfer.token_ids.len().to_string()} " "
                                                                {metadata.symbol.clone()}
                                                            </span>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        let memo = transfer.memo.clone();
                                                        view! {
                                                            <div class="flex flex-col gap-1">
                                                                <span>
                                                                    {move || {
                                                                        TranslationKey::PagesHistoryNftReceiveFrom
                                                                            .format_view(
                                                                                vec![
                                                                                    ("count", nft_count.into_any()),
                                                                                    ("collection", collection_name.clone().into_any()),
                                                                                    ("sender", format_account_id(&old_owner_id)),
                                                                                ],
                                                                            )
                                                                    }}
                                                                </span>
                                                                <span class="text-xs">{memo}</span>
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }}
                                                </span>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            }.into_any());
                        }
                    }
                }
            }
            if let Ok(log) = EventLogData::<NftMintLog>::deserialize(log) {
                let executor_id = receipt.receiver_id.clone();
                let metadata =
                    LocalResource::new(move || get_nft_collection_metadata(executor_id.clone()));
                if log.validate() {
                    for mint in log.data.iter().cloned() {
                        if mint.owner_id == me {
                            let nft_event_format = actions_config.nft_event_format;
                            if nft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                let metadata = metadata.clone();
                                                let nft_count = mint.token_ids.len();
                                                let collection_name = metadata.name.clone();
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if nft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if nft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if nft_event_format == TokenEventFormat::Short {
                                                            view! {
                                                                <span class="text-green-300 text-lg">
                                                                    "+" {mint.token_ids.len().to_string()} " "
                                                                    {metadata.symbol.clone()}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            let memo = mint.memo.clone();
                                                            view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <span>
                                                                        {move || {
                                                                            TranslationKey::PagesHistoryNftMint
                                                                                .format(
                                                                                    &[
                                                                                        ("count", &nft_count.to_string()),
                                                                                        ("collection", &collection_name.clone()),
                                                                                    ],
                                                                                )
                                                                        }}
                                                                    </span>
                                                                    <span class="text-xs">{memo}</span>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                    }
                }
            }
            if let Ok(log) = EventLogData::<NftBurnLog>::deserialize(log) {
                let executor_id = receipt.receiver_id.clone();
                let metadata =
                    LocalResource::new(move || get_nft_collection_metadata(executor_id.clone()));
                if log.validate() {
                    for burn in log.data.iter().cloned() {
                        if burn.owner_id == me {
                            let nft_event_format = actions_config.nft_event_format;
                            if nft_event_format == TokenEventFormat::Hidden {
                                continue;
                            }
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                let metadata = metadata.clone();
                                                let nft_count = burn.token_ids.len();
                                                let collection_name = metadata.name.clone();
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if nft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if nft_event_format == TokenEventFormat::Short {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if nft_event_format == TokenEventFormat::Short {
                                                            view! {
                                                                <span class="text-red-300 text-lg">
                                                                    "-" {burn.token_ids.len().to_string()} " "
                                                                    {metadata.symbol.clone()}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            let memo = burn.memo.clone();
                                                            view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <span>
                                                                        {move || {
                                                                            TranslationKey::PagesHistoryNftBurn
                                                                                .format(
                                                                                    &[
                                                                                        ("count", &nft_count.to_string()),
                                                                                        ("collection", &collection_name.clone()),
                                                                                    ],
                                                                                )
                                                                        }}
                                                                    </span>
                                                                    <span class="text-xs">{memo}</span>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                    }
                }
            }
        }
    }
}

fn add_harvestmoon_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        if receipt.receiver_id == "aa-harvest-moon.near"
            && receipt.predecessor_id == me
            && let ReceiptEnumView::Action {
                actions: tx_actions,
                ..
            } = &receipt.receipt
        {
            for action in tx_actions.iter() {
                if let ActionView::FunctionCall {
                    method_name, args, ..
                } = action
                {
                    if method_name == "recruit_tinkers" {
                        #[derive(Debug, Deserialize)]
                        struct Args {
                            // 0: basic, 1: advanced, 2: expert
                            union_contract_id: u8,
                            count: usize,
                        }
                        if let Ok(args) = serde_json::from_slice::<Args>(args) {
                            let mut tinkers = HashMap::new();
                            for log in transaction
                                .final_outcome
                                .receipts_outcome
                                .iter()
                                .find(|r| r.id == receipt.receipt_id)
                                .expect("receipt outcome not found")
                                .outcome
                                .logs
                                .iter()
                            {
                                if let Some(tinker_info) = log.strip_prefix("Added ")
                                    && let Some((count, rest)) =
                                        tinker_info.split_once(" count of tinker_id ")
                                    && let Some((tinker_id, _)) =
                                        rest.split_once(" to space tinker count for account ")
                                    && let (Ok(count), Ok(tinker_id)) =
                                        (count.parse::<usize>(), tinker_id.parse::<u8>())
                                {
                                    // 1 = intern, 2 = researcher, 3 = scientist, 4 = genius, 5 = brain
                                    *tinkers.entry(tinker_id).or_insert(0) += count;
                                }
                            }
                            actions.push(view! {
                                <div class="flex flex-col gap-2">
                                    <div class="flex items-center gap-2">
                                        <img
                                            src=format!(
                                                "/history-contract-{}.png",
                                                match args.union_contract_id {
                                                    1 => "basic",
                                                    2 => "advanced",
                                                    3 => "expert",
                                                    _ => "unknown",
                                                },
                                            )
                                            width="40"
                                            height="40"
                                        />
                                        <span>
                                            {move || {
                                                if args.count == 1 {
                                                    TranslationKey::PagesHistoryHarvestMoonRecruitOne
                                                        .format(&[])
                                                } else {
                                                    TranslationKey::PagesHistoryHarvestMoonRecruitN
                                                        .format(&[("count", &args.count.to_string())])
                                                }
                                            }}
                                        </span>
                                    </div>
                                    {if !tinkers.is_empty() {
                                        view! {
                                            <div class="flex items-center gap-4 pl-12">
                                                {tinkers
                                                    .iter()
                                                    .map(|(tinker_id, count)| {
                                                        view! {
                                                            <div class="flex flex-col items-center gap-1">
                                                                <img
                                                                    src=format!(
                                                                        "/history-tinker-{}.png",
                                                                        match tinker_id {
                                                                            1 => "intern",
                                                                            2 => "researcher",
                                                                            3 => "scientist",
                                                                            4 => "genius",
                                                                            5 => "brain",
                                                                            _ => "",
                                                                        },
                                                                    )
                                                                    width="24"
                                                                    height="24"
                                                                    class="rounded-full"
                                                                />
                                                                <span class="text-sm">{*count}"x"</span>
                                                            </div>
                                                        }
                                                    })
                                                    .collect::<Vec<_>>()}
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }}
                                </div>
                            }.into_any());
                        }
                    }
                    if method_name == "harvest" {
                        actions.push(
                            view! {
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/history-harvest.png"
                                        width="40"
                                        height="40"
                                        style="animation: none !important;"
                                    />
                                    <span>
                                        {move || {
                                            TranslationKey::PagesHistoryHarvestMoonHarvest.format(&[])
                                        }}
                                    </span>
                                </div>
                            }
                            .into_any(),
                        );
                        actions_config.ft_event_format = TokenEventFormat::Short;
                    }
                }
            }
        }
    }
}

fn add_lnc_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    _me: &AccountIdRef,
    _actions_config: &mut ActionsConfig,
    _rpc_client: RpcClient,
) {
    for receipt in transaction.receipts.iter() {
        if receipt.receiver_id != "login.learnclub.near" {
            continue;
        }
        if let ReceiptEnumView::Action {
            actions: tx_actions,
            ..
        } = &receipt.receipt
        {
            for action in tx_actions.iter() {
                if let ActionView::FunctionCall { method_name, .. } = action
                    && method_name == "n_learns_notification_event"
                {
                    for log in transaction
                        .final_outcome
                        .receipts_outcome
                        .iter()
                        .find(|r| r.id == receipt.receipt_id)
                        .expect("receipt outcome not found")
                        .outcome
                        .logs
                        .iter()
                    {
                        let num = log
                            .chars()
                            .rev()
                            .take_while(|c| c.is_ascii_digit())
                            .collect::<String>();
                        let nlearns = num.parse::<Balance>().unwrap_or_default();
                        let nlearns = if let Some(rest) = log.strip_suffix(&num) {
                            if rest.ends_with('-') {
                                format!("-{nlearns}")
                            } else {
                                format!("+{nlearns}")
                            }
                        } else {
                            format!("+{nlearns}")
                        };
                        let log = log.trim_end_matches(&num).trim_end_matches('-').to_owned();
                        let nlearns_line = nlearns.clone();
                        actions.push(
                            view! {
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/history-lnc.png"
                                        width="40"
                                        height="40"
                                        class="rounded-full"
                                    />
                                    <div class="flex flex-col gap-1">
                                        <span>
                                            {move || {
                                                TranslationKey::PagesHistoryLearnClubNlBalance
                                                    .format(&[("amount", nlearns_line.as_str())])
                                            }}
                                        </span>
                                        <span class="text-xs">{log}</span>
                                    </div>
                                </div>
                            }
                            .into_any(),
                        );
                    }
                }
            }
        }
    }
}
