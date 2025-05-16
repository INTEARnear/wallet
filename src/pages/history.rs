use std::collections::{HashMap, HashSet};

use crate::{
    contexts::{
        accounts_context::AccountsContext,
        config_context::{ConfigContext, TimestampFormat},
        network_context::Network,
    },
    utils::{
        format_account_id, format_duration, format_token_amount, get_ft_metadata,
        get_nft_collection_metadata, EventLogData, FtBurnLog, FtMintLog, FtTransferLog, NftBurnLog,
        NftMintLog, NftTransferLog, RefDclSwapLog, VeaxSwapLog, NEP141_EVENT_STANDARD_STRING,
    },
};
use base64::{self, Engine};
use chrono::{DateTime as ChronoDateTime, Local, Utc};
use icondata::{LuCalendar, LuClock, LuInfo, LuPackage, LuPackageOpen};
use leptos::prelude::*;
use leptos_icons::Icon;
use near_min_api::{
    types::{
        AccessKeyPermissionView, AccountId, AccountIdRef, ActionView, Balance,
        FinalExecutionOutcomeWithReceiptView, NearToken, ReceiptEnumView,
    },
    ExperimentalTxDetails,
};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
struct TransactionResponse {
    block_timestamp_nanosec: u64,
    meta: TransactionMeta,
    transaction: ExperimentalTxDetails,
}

#[derive(Debug, Deserialize, Clone)]
struct TransactionMeta {
    other_account_id: AccountId,
    tx_type: TransactionType,
}

#[derive(Debug, Deserialize, Clone, Copy)]
enum TransactionType {
    TxSigner,
    TxReceiver,
    FtReceiver,
}

async fn fetch_transactions() -> Vec<TransactionResponse> {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let Some(selected_account_id) = accounts().selected_account_id else {
        return vec![];
    };
    let selected_account = accounts()
        .accounts
        .into_iter()
        .find(|a| a.account_id == selected_account_id)
        .expect("Selected account not found");

    let history_service_addr = match selected_account.network {
        Network::Mainnet => dotenvy_macro::dotenv!("MAINNET_HISTORY_SERVICE_ADDR"),
        Network::Testnet => dotenvy_macro::dotenv!("TESTNET_HISTORY_SERVICE_ADDR"),
    };
    if let Ok(response) = reqwest::get(format!(
        "{history_service_addr}/api/transactions/{selected_account_id}"
    ))
    .await
    {
        response
            .json::<Vec<TransactionResponse>>()
            .await
            .unwrap_or_default()
    } else {
        vec![]
    }
}

#[component]
pub fn History() -> impl IntoView {
    let transactions = LocalResource::new(fetch_transactions);
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let timestamp_format = move || config.get().timestamp_format;
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    Effect::new(move || {
        accounts.track();
        transactions.refetch();
    });

    view! {
        <div class="md:p-4 transition-all duration-100">
            <div class="flex justify-between items-center mb-4 px-4">
                <h1 class="text-white text-2xl font-bold pt-4 sm:pt-0">Transaction History</h1>
                <button
                    on:click=move |_| {
                        set_config
                            .update(|c| {
                                c.timestamp_format = match c.timestamp_format {
                                    TimestampFormat::TimeAgo => TimestampFormat::DateTime,
                                    TimestampFormat::DateTime => TimestampFormat::TimeAgo,
                                }
                            })
                    }
                    class="text-white hover:text-neutral-300 transition-colors p-2 pt-5 cursor-pointer"
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
            <Suspense fallback=move || {
                view! {
                    <div class="flex items-center justify-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    if let Some(transactions) = transactions.get() {
                        let mut grouped_transactions: HashMap<String, Vec<TransactionResponse>> = HashMap::new();
                        let now = Local::now();
                        let today = now.date_naive();
                        let yesterday = today.pred_opt().unwrap();
                        for tx in transactions.clone().into_iter() {
                            let timestamp = tx.block_timestamp_nanosec / 1_000_000_000;
                            let datetime = ChronoDateTime::from_timestamp(timestamp as i64, 0)
                                .unwrap();
                            let local_datetime = datetime.with_timezone(&Local);
                            let date = local_datetime.date_naive();
                            let group_key = if date == today {
                                "Today".to_string()
                            } else if date == yesterday {
                                "Yesterday".to_string()
                            } else {
                                date.format("%B %d, %Y").to_string()
                            };
                            grouped_transactions.entry(group_key).or_default().push(tx);
                        }
                        let mut sorted_groups: Vec<(String, Vec<TransactionResponse>)> = grouped_transactions
                            .into_iter()
                            .collect();
                        sorted_groups
                            .sort_by(|a, b| {
                                let a_date = if a.0 == "Today" {
                                    today
                                } else if a.0 == "Yesterday" {
                                    yesterday
                                } else {
                                    chrono::NaiveDate::parse_from_str(&a.0, "%B %d, %Y").unwrap()
                                };
                                let b_date = if b.0 == "Today" {
                                    today
                                } else if b.0 == "Yesterday" {
                                    yesterday
                                } else {
                                    chrono::NaiveDate::parse_from_str(&b.0, "%B %d, %Y").unwrap()
                                };
                                b_date.cmp(&a_date)
                            });

                        // Sort groups by date (most recent first)
                        view! {
                            <div class="space-y-6">
                                {sorted_groups
                                    .into_iter()
                                    .map(|(date_label, transactions)| {
                                        let display_label = if date_label == "Today"
                                            || date_label == "Yesterday"
                                        {
                                            date_label
                                        } else {
                                            chrono::NaiveDate::parse_from_str(&date_label, "%B %d, %Y")
                                                .unwrap()
                                                .format("%B %d")
                                                .to_string()
                                        };
                                        view! {
                                            <div class="space-y-2">
                                                <h2 class="text-white text-lg font-semibold px-4 py-2 bg-neutral-950 sticky top-0 z-10">
                                                    {display_label}
                                                </h2>
                                                <div class="space-y-0 rounded-lg overflow-hidden">
                                                    {transactions
                                                        .into_iter()
                                                        .map(|tx| {
                                                            let timestamp = tx.block_timestamp_nanosec / 1_000_000_000;
                                                            let datetime = ChronoDateTime::from_timestamp(
                                                                    timestamp as i64,
                                                                    0,
                                                                )
                                                                .unwrap();
                                                            let now = Utc::now();
                                                            let duration = now
                                                                .signed_duration_since(datetime)
                                                                .to_std()
                                                                .unwrap();
                                                            let time_ago = format_duration(duration);
                                                            let formatted_datetime = datetime
                                                                .format("%Y-%m-%d %H:%M:%S")
                                                                .to_string();
                                                            let account_id = format_account_id(
                                                                &tx.meta.other_account_id,
                                                            );
                                                            let tx_hash = tx
                                                                .transaction
                                                                .final_execution_outcome
                                                                .as_ref()
                                                                .map(|t| t.final_outcome.transaction.hash);
                                                            let content = view! {
                                                                <div class="flex flex-col gap-1">
                                                                    <div class="text-white font-medium text-lg md:text-xl transition-all duration-100">
                                                                        {match tx.transaction.final_execution_outcome {
                                                                            Some(transaction) => {
                                                                                display_transaction(&transaction, tx.meta.tx_type)
                                                                                    .into_any()
                                                                            }
                                                                            None => view! { <div>"Unknown"</div> }.into_any(),
                                                                        }}
                                                                    </div>
                                                                </div>
                                                                <div class="flex flex-col gap-1 items-end justify-between h-35 text-right">
                                                                    <div class="text-neutral-300">
                                                                        {move || {
                                                                            if timestamp_format() == TimestampFormat::DateTime {
                                                                                formatted_datetime.clone()
                                                                            } else {
                                                                                format!("{time_ago} ago")
                                                                            }
                                                                        }}
                                                                    </div>
                                                                    <div class="text-neutral-400 text-sm max-w-[120px] w-[120px] md:max-w-[160px] md:w-[160px] sm:max-w-xs wrap-anywhere transition-all duration-100 ml-2">
                                                                        {account_id}
                                                                    </div>
                                                                </div>
                                                            };
                                                            let has_hash = tx_hash.is_some();

                                                            view! {
                                                                <div
                                                                    on:click=move |_| {
                                                                        if !has_hash {
                                                                            web_sys::window()
                                                                                .unwrap()
                                                                                .alert_with_message(
                                                                                    "Transaction not found. This is a bug, please report it.",
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
                                                                                            let selected_account = accounts()
                                                                                                .accounts
                                                                                                .into_iter()
                                                                                                .find(|a| {
                                                                                                    a.account_id
                                                                                                        == accounts()
                                                                                                            .selected_account_id
                                                                                                            .expect("No selected account")
                                                                                                })
                                                                                                .expect("Selected account not found");
                                                                                            let explorer_url = match selected_account.network {
                                                                                                Network::Mainnet => "https://nearblocks.io",
                                                                                                Network::Testnet => "https://testnet.nearblocks.io",
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
                                                        })
                                                        .collect::<Vec<_>>()}
                                                </div>
                                            </div>
                                        }
                                    })
                                    .collect::<Vec<_>>()}
                            </div>
                        }
                            .into_any()
                    } else {
                        ().into_any()
                    }
                }}
            </Suspense>
        </div>
    }
}

fn display_transaction(
    transaction: &FinalExecutionOutcomeWithReceiptView,
    tx_type: TransactionType,
) -> impl IntoAny {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let Some(me) = accounts().selected_account_id else {
        return view! { <div>No selected account</div> }.into_any();
    };
    let actions_config = RwSignal::new(ActionsConfig::default());
    match tx_type {
        TransactionType::TxSigner | TransactionType::TxReceiver => {
            let mut actions = Vec::<AnyView>::new();
            add_storage_actions(&mut actions, transaction, &me, actions_config);
            add_lnc_actions(&mut actions, &me, transaction, actions_config);
            add_harvestmoon_actions(&mut actions, &me, transaction, actions_config);
            add_wrap_actions(&mut actions, transaction, &me, actions_config);
            add_dex_actions(&mut actions, transaction, &me, actions_config);
            add_ft_actions(&mut actions, transaction, &me, actions_config);
            add_nft_actions(&mut actions, transaction, &me, actions_config);
            add_staking_actions(&mut actions, transaction, &me, actions_config);
            add_near_actions(&mut actions, transaction, &me, actions_config);
            add_key_actions(&mut actions, transaction, &me, actions_config);
            add_account_actions(&mut actions, transaction, &me, actions_config);
            if actions.is_empty() {
                if transaction.final_outcome.transaction.actions.is_empty() {
                    view! { <div>Empty Transaction</div> }.into_any()
                } else {
                    view! { <div>App Interaction</div> }.into_any()
                }
            } else {
                view! { <div class="flex flex-col gap-2">{actions}</div> }.into_any()
            }
        }
        TransactionType::FtReceiver => view! { <div>Receive token</div> }.into_any(), // TODO
    }
}

#[derive(Debug, Default)]
struct ActionsConfig {
    short_ft_events: bool,
    short_nft_events: bool,
    storage_deposit_to: HashSet<AccountId>,
    withdrawing_from_staking: HashMap<AccountId, NearToken>,
}

fn add_account_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    _me: &AccountIdRef,
    _actions_config: RwSignal<ActionsConfig>,
) {
    for action in transaction.final_outcome.transaction.actions.iter() {
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
                                    "Create Account "
                                    {format_account_id(
                                        &transaction.final_outcome.transaction.receiver_id,
                                    )}
                                </span>
                            </div>
                        </div>
                    }
                    .into_any(),
                );
            }
            ActionView::DeleteAccount { beneficiary_id } => {
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
                                    "Delete Account "
                                    {format_account_id(
                                        &transaction.final_outcome.transaction.receiver_id,
                                    )} " and send remaining NEAR to "
                                    {format_account_id(beneficiary_id)}
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
    _actions_config: RwSignal<ActionsConfig>,
) {
    if transaction.final_outcome.transaction.receiver_id != me {
        return;
    }
    for action in transaction.final_outcome.transaction.actions.iter() {
        match action {
            ActionView::AddKey { access_key, .. } => match &access_key.permission {
                AccessKeyPermissionView::FullAccess => {
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
                                    <span>Add full key</span>
                                </div>
                                <span class="text-sm text-neutral-400 pl-12">
                                    This usually means someone else logged in to your account, or you started using a new wallet
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
                } => {
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
                                    <span>Add app key</span>
                                </div>
                                <span class="text-sm text-neutral-400 pl-12">
                                    "Gives some web-app permission to execute"
                                    {if method_names.is_empty() {
                                        " all methods ".into_any()
                                    } else {
                                        view! {
                                            <span class="hover-capable-only bg-neutral-600 hover:bg-neutral-800 px-1 rounded group relative">
                                                "certain methods"
                                                <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-neutral-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                    "Methods: " {method_names.join(", ")}
                                                </div>
                                            </span>
                                            <span class="hover-incapable-only rounded">
                                                " certain methods "
                                            </span>
                                        }
                                            .into_any()
                                    }} "on your behalf on "{receiver_id.to_string()}" and use "
                                    {if let Some(allowance) = allowance {
                                        format!(
                                            "up to {}",
                                            format_token_amount(allowance.as_yoctonear(), 24, "NEAR"),
                                        )
                                    } else {
                                        "unlimited NEAR".to_string()
                                    }} " for fees"
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
                                <span>Delete Key</span>
                            </div>
                            <span class="text-sm text-neutral-400 pl-12">
                                This usually means you signed out in some application
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
    actions_config: RwSignal<ActionsConfig>,
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
            if let Some(log) = log.strip_prefix("@") {
                if let Some((account_id, rest)) = log.split_once(" ") {
                    if account_id == me {
                        if let Some(rest) = rest.strip_prefix("staking ") {
                            if let Some((amount, _)) = rest.split_once(".") {
                                if let Ok(amount) = amount.parse::<u128>() {
                                    actions.push(view! {
                                        <div class="flex items-center gap-2">
                                            <Icon
                                                icon=icondata::LuLock
                                                width="40"
                                                height="40"
                                                attr:class="min-w-[40px] min-h-[40px]"
                                            />
                                            <span>Stake {format_token_amount(amount, 24, "NEAR")}</span>
                                        </div>
                                    }.into_any());
                                }
                            }
                        } else if let Some(rest) = rest.strip_prefix("unstaking ") {
                            if let Some((amount, _)) = rest.split_once(".") {
                                if let Ok(amount) = amount.parse::<u128>() {
                                    actions.push(view! {
                                        <div class="flex items-center gap-2">
                                            <Icon
                                                icon=icondata::LuUnlock
                                                width="40"
                                                height="40"
                                                attr:class="min-w-[40px] min-h-[40px]"
                                            />
                                            <span>
                                                Start unstaking {format_token_amount(amount, 24, "NEAR")}
                                            </span>
                                        </div>
                                    }.into_any());
                                }
                            }
                        } else if let Some(rest) = rest.strip_prefix("withdrawing ") {
                            if let Some((amount, _)) = rest.split_once(".") {
                                if let Ok(amount) = amount.parse::<u128>() {
                                    actions.push(view! {
                                        <div class="flex items-center gap-2">
                                            <Icon
                                                icon=icondata::LuDownload
                                                width="40"
                                                height="40"
                                                attr:class="min-w-[40px] min-h-[40px]"
                                            />
                                            <span>
                                                Withdraw {format_token_amount(amount, 24, "NEAR")}
                                            </span>
                                        </div>
                                    }.into_any());
                                    let mut withdrawing = actions_config.write();
                                    let withdrawing = withdrawing
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
            }
        }
    }
}

fn add_near_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: RwSignal<ActionsConfig>,
) {
    for receipt in transaction.receipts.iter() {
        if let ReceiptEnumView::Action {
            actions: tx_actions,
            ..
        } = &receipt.receipt
        {
            for action in tx_actions.iter() {
                if let ActionView::Transfer { deposit } = action {
                    if !deposit.is_zero() {
                        if receipt.predecessor_id == me {
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
                                            Transfer
                                            {format_token_amount(deposit.as_yoctonear(), 24, "NEAR")}
                                        </span>
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                        if receipt.receiver_id == me && receipt.predecessor_id != "system" {
                            if let Some(withdraw_amount) = actions_config
                                .write()
                                .withdrawing_from_staking
                                .remove(&receipt.predecessor_id)
                            {
                                if withdraw_amount == *deposit {
                                    continue;
                                }
                            }
                            actions.push(
                                if actions_config
                                    .read()
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
                                                Storage deposit refund
                                                {format_token_amount(deposit.as_yoctonear(), 24, "NEAR")}
                                            </span>
                                        </div>
                                    }
                                    .into_any()
                                } else {
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
                                                Receive
                                                {format_token_amount(deposit.as_yoctonear(), 24, "NEAR")}
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
}

fn add_storage_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: RwSignal<ActionsConfig>,
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
                {
                    if method_name == "storage_deposit" && receipt.predecessor_id == me {
                        let deposit_amount = *deposit;
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
                                        class="rounded-sm"
                                    />
                                    <span class="flex items-center gap-1">
                                        "Storage deposit "
                                        {format_token_amount(
                                            deposit_amount.as_yoctonear(),
                                            24,
                                            "NEAR",
                                        )} <div class="group relative hover-capable-only">
                                            <div class="text-neutral-400 hover:text-neutral-300 cursor-help">
                                                <Icon icon=LuInfo width="16" height="16" />
                                            </div>
                                            <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-neutral-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                "Storage deposits are needed for dapps to store your data on NEAR blockchain. Once you stop using this dapp, most dapps allow you to withdraw this deposit."
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            }
                            .into_any(),
                        );
                        actions_config
                            .write()
                            .storage_deposit_to
                            .insert(receipt.receiver_id.clone());
                    }
                }
            }
        }
    }
}

fn add_wrap_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    _actions_config: RwSignal<ActionsConfig>,
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
            if let Some(deposit_details) = log.strip_prefix("Deposit ") {
                if let Some((amount, receiver)) = deposit_details.split_once(" NEAR to ") {
                    if let (Ok(amount), Ok(depositor)) =
                        (amount.parse::<u128>(), receiver.parse::<AccountId>())
                    {
                        if depositor == me {
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        <Icon
                                            icon=LuPackage
                                            width="40"
                                            height="40"
                                            attr:class="min-w-[40px] min-h-[40px]"
                                        />
                                        <span>Wrap {format_token_amount(amount, 24, "NEAR")}</span>
                                    </div>
                                }
                                .into_any(),
                            );
                        }
                    }
                }
            }
            if let Some(withdraw_details) = log.strip_prefix("Withdraw ") {
                if let Some((amount, receiver)) = withdraw_details.split_once(" NEAR from ") {
                    if let (Ok(amount), Ok(withdrawer)) =
                        (amount.parse::<u128>(), receiver.parse::<AccountId>())
                    {
                        if withdrawer == me {
                            actions.push(view! {
                                <div class="flex items-center gap-2">
                                    <Icon
                                        icon=LuPackageOpen
                                        width="40"
                                        height="40"
                                        attr:class="min-w-[40px] min-h-[40px]"
                                    />
                                    <span>Unwrap {format_token_amount(amount, 24, "NEAR")}</span>
                                </div>
                            }.into_any());
                        }
                    }
                }
            }
        }
    }
}

fn add_dex_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: RwSignal<ActionsConfig>,
) {
    for receipt in transaction.receipts.iter() {
        if receipt.receiver_id == "dclv2.ref-labs.near" {
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
                if let Ok(log) = EventLogData::<RefDclSwapLog>::deserialize(log) {
                    if log.validate() {
                        for swap in log.data.iter().cloned() {
                            if swap.swapper == me {
                                actions_config.write().short_ft_events = true;
                                actions.push(
                                    view! {
                                        <div class="flex items-center gap-2">
                                            <img
                                                src=format!(
                                                    "data:image/svg+xml;base64,{}",
                                                    base64::prelude::BASE64_STANDARD
                                                        .encode(include_str!("../data/rhea.svg")),
                                                )
                                                width="40"
                                                height="40"
                                            />
                                            <span>"Swap"</span>
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
        if receipt.receiver_id == "v2.ref-finance.near" {
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
                if log.starts_with("Swapped ") {
                    actions_config.write().short_ft_events = true;
                    actions.push(
                        view! {
                            <div class="flex items-center gap-2">
                                <img
                                    src=format!(
                                        "data:image/svg+xml;base64,{}",
                                        base64::prelude::BASE64_STANDARD
                                            .encode(include_str!("../data/rhea.svg")),
                                    )
                                    width="40"
                                    height="40"
                                />
                                <span>"Swap"</span>
                            </div>
                        }
                        .into_any(),
                    );
                    break;
                }
            }
        }
        if receipt.receiver_id == "veax.near" {
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
                if let Ok(log) = EventLogData::<VeaxSwapLog>::deserialize(log) {
                    if log.validate() && log.data.user == me {
                        actions_config.write().short_ft_events = true;
                        actions.push(
                            view! {
                                <div class="flex items-center gap-2">
                                    <img
                                        src="/history-veax.svg"
                                        width="40"
                                        height="40"
                                        class="min-w-[40px] min-h-[40px]"
                                    />
                                    <span>"Swap"</span>
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

fn add_ft_actions(
    actions: &mut Vec<AnyView>,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    me: &AccountIdRef,
    actions_config: RwSignal<ActionsConfig>,
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
                let metadata = LocalResource::new(move || get_ft_metadata(executor_id.clone()));
                if log.validate() {
                    for transfer in log.data.iter().cloned() {
                        if transfer.old_owner_id == me {
                            let transfer = transfer.clone();
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
                                                        width=if actions_config.read().short_ft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if actions_config.read().short_ft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if actions_config.read().short_ft_events {
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
                                                                        "Send "
                                                                        {format_token_amount(
                                                                            transfer.amount,
                                                                            metadata.decimals,
                                                                            &metadata.symbol,
                                                                        )} " to " {move || format_account_id(&new_owner_id)}
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
                            actions.push(view! {
                                <div class="flex items-center gap-2">
                                    {move || {
                                        if let Some(Ok(metadata)) = metadata.get() {
                                            view! {
                                                <img
                                                    src=metadata.icon.clone()
                                                    width=if actions_config.read().short_ft_events {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    height=if actions_config.read().short_ft_events {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    class="rounded-full"
                                                />
                                                <span>
                                                    {if actions_config.read().short_ft_events {
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
                                                        view! {
                                                            <div class="flex flex-col gap-1">
                                                                <span>
                                                                    "Receive "
                                                                    {format_token_amount(
                                                                        transfer.amount,
                                                                        metadata.decimals,
                                                                        &metadata.symbol,
                                                                    )} " from " {format_account_id(&transfer.old_owner_id)}
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
                let metadata = LocalResource::new(move || get_ft_metadata(executor_id.clone()));
                if log.validate() {
                    for mint in log.data.iter().cloned() {
                        if mint.owner_id == me {
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if actions_config.read().short_ft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if actions_config.read().short_ft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if actions_config.read().short_ft_events {
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
                                                                        "Mint "
                                                                        {format_token_amount(
                                                                            mint.amount,
                                                                            metadata.decimals,
                                                                            &metadata.symbol,
                                                                        )}
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
                let metadata = LocalResource::new(move || get_ft_metadata(executor_id.clone()));
                if log.validate() {
                    for burn in log.data.iter().cloned() {
                        if burn.owner_id == me {
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if actions_config.read().short_ft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if actions_config.read().short_ft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if actions_config.read().short_ft_events {
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
                                                                        "Burn "
                                                                        {format_token_amount(
                                                                            burn.amount,
                                                                            metadata.decimals,
                                                                            &metadata.symbol,
                                                                        )}
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
    actions_config: RwSignal<ActionsConfig>,
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
                                                        width=if actions_config.read().short_nft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if actions_config.read().short_nft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if actions_config.read().short_nft_events {
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
                                                                        "Send " {transfer.token_ids.len().to_string()} " "
                                                                        {metadata.name.clone()} " to "
                                                                        {move || format_account_id(&new_owner_id)}
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
                            actions.push(view! {
                                <div class="flex items-center gap-2">
                                    {move || {
                                        if let Some(Ok(metadata)) = metadata.get() {
                                            view! {
                                                <img
                                                    src=metadata.icon.clone()
                                                    width=if actions_config.read().short_nft_events {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    height=if actions_config.read().short_nft_events {
                                                        "30"
                                                    } else {
                                                        "40"
                                                    }
                                                    class="rounded-full"
                                                />
                                                <span>
                                                    {if actions_config.read().short_nft_events {
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
                                                                    "Receive " {transfer.token_ids.len().to_string()} " "
                                                                    {metadata.name.clone()} " from "
                                                                    {format_account_id(&transfer.old_owner_id)}
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
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if actions_config.read().short_nft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if actions_config.read().short_nft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if actions_config.read().short_nft_events {
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
                                                                        "Mint " {mint.token_ids.len().to_string()} " "
                                                                        {metadata.name.clone()}
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
                            actions.push(
                                view! {
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            if let Some(Ok(metadata)) = metadata.get() {
                                                view! {
                                                    <img
                                                        src=metadata.icon.clone()
                                                        width=if actions_config.read().short_nft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        height=if actions_config.read().short_nft_events {
                                                            "30"
                                                        } else {
                                                            "40"
                                                        }
                                                        class="rounded-full"
                                                    />
                                                    <span>
                                                        {if actions_config.read().short_nft_events {
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
                                                                        "Burn " {burn.token_ids.len().to_string()} " "
                                                                        {metadata.name.clone()}
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
    me: &AccountIdRef,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    actions_config: RwSignal<ActionsConfig>,
) {
    for receipt in transaction.receipts.iter() {
        if receipt.receiver_id == "aa-harvest-moon.near" && receipt.predecessor_id == me {
            if let ReceiptEnumView::Action {
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
                                    if let Some(tinker_info) = log.strip_prefix("Added ") {
                                        if let Some((count, rest)) =
                                            tinker_info.split_once(" count of tinker_id ")
                                        {
                                            if let Some((tinker_id, _)) = rest
                                                .split_once(" to space tinker count for account ")
                                            {
                                                if let (Ok(count), Ok(tinker_id)) = (
                                                    count.parse::<usize>(),
                                                    tinker_id.parse::<u8>(),
                                                ) {
                                                    // 1 = intern, 2 = researcher, 3 = scientist, 4 = genius, 5 = brain
                                                    *tinkers.entry(tinker_id).or_insert(0) += count;
                                                }
                                            }
                                        }
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
                                                "Recruit "{args.count}" tinker"
                                                {if args.count > 1 { "s" } else { "" }}
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
                                        <span>Harvest</span>
                                    </div>
                                }
                                .into_any(),
                            );
                            actions_config.update(|c| c.short_ft_events = true);
                        }
                    }
                }
            }
        }
    }
}

fn add_lnc_actions(
    actions: &mut Vec<AnyView>,
    _me: &AccountIdRef,
    transaction: &FinalExecutionOutcomeWithReceiptView,
    _actions_config: RwSignal<ActionsConfig>,
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
                if let ActionView::FunctionCall { method_name, .. } = action {
                    if method_name == "n_learns_notification_event" {
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
                                            <span>{nlearns}" nL"</span>
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
}
