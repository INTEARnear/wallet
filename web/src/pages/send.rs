use crate::{
    components::send_modals::{
        SendConfirmationData, SendConfirmationModal, SendConfirmationTransfer, SendErrorModal,
        SendResult, SendSuccessModal,
    },
    contexts::{
        modal_context::ModalContext,
        network_context::NetworkContext,
        rpc_context::RpcContext,
        tokens_context::{Token, TokenData, TokenMetadata, TokensContext},
        transaction_queue_context::EnqueuedTransaction,
    },
    pages::stake::is_validator_supported,
    utils::{
        balance_to_decimal, decimal_to_balance, format_account_id_no_hide, format_token_amount,
        format_token_amount_full_precision, format_token_amount_no_hide, format_usd_value_no_hide,
        StorageBalance,
    },
};
use bigdecimal::{BigDecimal, FromPrimitive};
use futures_timer::Delay;
use leptos::{html::Input, prelude::set_timeout_with_handle};
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::Icon;
use leptos_router::components::A;
use leptos_router::hooks::use_params_map;
use near_min_api::{
    types::{
        AccountId, Action, Balance, FinalExecutionStatus, Finality, FunctionCallAction, NearGas,
        NearToken, TransferAction, U128,
    },
    QueryFinality, RpcClient,
};
use reqwest;
use serde_json;
use std::collections::HashSet;
use std::time::Duration;
use wasm_bindgen::closure::Closure;
use wasm_bindgen::JsCast;
use web_sys::{Event, FileReader, HtmlInputElement, ProgressEvent};

#[allow(dead_code)]
fn is_valid_account_id(account_id: &str) -> bool {
    account_id.parse::<AccountId>().is_ok()
}
fn is_implicit_account(account_id: &str) -> bool {
    account_id.chars().all(|c| c.is_ascii_hexdigit()) && account_id.len() == 64
}
fn is_evm_implicit_account(account_id: &str) -> bool {
    account_id.starts_with("0x")
        && account_id.chars().skip(2).all(|c| c.is_ascii_hexdigit())
        && account_id.len() == 42
}
#[derive(Clone, Copy)]
enum RecipientField {
    Recipient,
    Amount,
}
#[derive(Clone, Debug, Default)]
struct MultiSendRecipient {
    recipient: String,
    amount: String,
    has_typed_recipient: bool,
    has_typed_amount: bool,
    account_exists: bool,
    recipient_balance: Option<Balance>,
    is_loading_recipient: bool,
    amount_error: Option<String>,
    recipient_warning: Option<RecipientWarning>,
}
#[derive(Clone, Debug)]
struct RecipientWarning {
    message: String,
    link: Option<String>,
    link_text: Option<String>,
}

#[component]
fn ImportModal(
    content: RwSignal<String>,
    import_table: RwSignal<Vec<(AccountId, BigDecimal)>>,
    set_recipients: WriteSignal<Vec<MultiSendRecipient>>,
    token: Signal<TokenData>,
    trigger_validation: impl Fn(usize, RecipientField, String) + Send + Sync + Copy + 'static,
    file_error: ReadSignal<Option<String>>,
) -> impl IntoView {
    const MANY_ROWS: usize = 10;
    let ModalContext { modal } = expect_context::<ModalContext>();
    let has_rows = move || !import_table().is_empty();
    let has_many_rows = move || import_table().len() > MANY_ROWS;
    let (is_loading, set_is_loading) = signal(false);
    let (error_msg, set_error_msg) = signal::<Option<String>>(None);
    let (check_only_first, set_check_only_first) = signal(true);
    let ai_service_addr: &str = dotenvy_macro::dotenv!("SHARED_AI_TOOLS_SERVICE_ADDR");
    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                class="bg-neutral-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                on:click=|ev| ev.stop_propagation()
            >
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-white font-bold text-xl">"Import Recipients"</h3>
                    <button
                        class="text-gray-400 hover:text-white cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        <Icon icon=icondata::LuX width="18" height="18" />
                    </button>
                </div>
                <textarea
                    class="w-full h-24 md:h-48 bg-neutral-800 text-white rounded-lg p-3 font-mono text-sm mb-4 resize-none"
                    prop:value=content
                    on:input=move |ev| {
                        let input: web_sys::HtmlTextAreaElement = ev
                            .target()
                            .unwrap()
                            .unchecked_into();
                        content.set(input.value());
                    }
                />
                <div class="flex gap-3 mb-4">
                    <button
                        class={move || {
                            if is_loading() {
                                "flex-1 bg-neutral-700 text-white rounded-lg px-4 py-6 font-semibold cursor-not-allowed"
                            } else {
                                "flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white rounded-lg px-4 py-6 font-semibold shadow-lg transition-all duration-200 cursor-pointer"
                            }
                        }}
                        disabled=is_loading
                        on:click=move |_| {
                            set_is_loading.set(true);
                            set_error_msg.set(None);
                            let text = content();
                            spawn_local(async move {
                                let client = reqwest::Client::new();
                                let body = serde_json::json!({ "text": text });
                                let res = client
                                    .post(format!("{}/api/extract", ai_service_addr))
                                    .json(&body)
                                    .send()
                                    .await;
                                match res {
                                    Ok(resp) => {
                                        match resp.json::<serde_json::Value>().await {
                                            Ok(json) => {
                                                if let Some(err) = json
                                                    .get("error")
                                                    .and_then(|e| e.as_str())
                                                {
                                                    set_error_msg.set(Some(err.to_string()));
                                                } else if let Some(map) = json
                                                    .get("accounts")
                                                    .and_then(|a| a.as_object())
                                                {
                                                    let mut table = Vec::new();
                                                    for (acc, val) in map {
                                                        if let (Ok(account_id), Some(amount_f)) = (
                                                            acc.parse::<AccountId>(),
                                                            val.as_f64(),
                                                        ) {
                                                            table
                                                                .push((
                                                                    account_id,
                                                                    BigDecimal::from_f64(amount_f).unwrap_or_default(),
                                                                ));
                                                        }
                                                    }
                                                    import_table.set(table);
                                                }
                                            }
                                            Err(e) => set_error_msg.set(Some(e.to_string())),
                                        }
                                    }
                                    Err(e) => set_error_msg.set(Some(e.to_string())),
                                }
                                set_is_loading.set(false);
                            });
                        }
                    >
                        {move || {
                            if is_loading() {
                                "Loading...".to_string()
                            } else {
                                "Read with AI".to_string()
                            }
                        }}
                    </button>
                </div>
                {move || {
                    if let Some(err) = file_error.get() {
                        view! { <p class="text-red-400 text-sm mb-2">{err}</p> }.into_any()
                    } else if let Some(err) = error_msg.get() {
                        view! { <p class="text-red-400 text-sm mb-2">{err}</p> }.into_any()
                    } else {
                        ().into_any()
                    }
                }}
                <Show when=has_rows>
                    <div class="mb-4 max-h-80 overflow-y-auto border border-neutral-700 rounded-lg">
                        <table class="w-full text-left text-white">
                            <thead class="sticky top-0 bg-neutral-900 border-b border-neutral-700">
                                <tr class="text-gray-400 text-sm">
                                    <th class="py-2 px-3">"Account"</th>
                                    <th class="py-2 px-3">"Amount"</th>
                                </tr>
                            </thead>
                            <tbody>
                                {move || {
                                    let token = token.get();
                                    let decimals = token.token.metadata.decimals;
                                    let symbol = token.token.metadata.symbol.clone();
                                    import_table()
                                        .into_iter()
                                        .map(|(account_id, amount)| {
                                            view! {
                                                <tr class="border-t border-neutral-700 text-sm hover:bg-neutral-800/50">
                                                    <td class="py-2 px-3 whitespace-nowrap">
                                                        {account_id.to_string()}
                                                    </td>
                                                    <td class="py-2 px-3 whitespace-nowrap">
                                                        {format_token_amount_full_precision(
                                                            decimal_to_balance(amount, decimals),
                                                            decimals,
                                                            &symbol,
                                                        )}
                                                    </td>
                                                </tr>
                                            }
                                        })
                                        .collect::<Vec<_>>()
                                }}
                            </tbody>
                        </table>
                    </div>
                    <Show when=has_many_rows>
                        <div class="mb-4 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
                            <label class="flex items-center gap-2 text-white text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
                                    prop:checked=check_only_first
                                    on:change=move |ev| {
                                        let checked = event_target_checked(&ev);
                                        set_check_only_first.set(checked);
                                    }
                                />
                                <span>"Check only first 10 accounts"</span>
                            </label>
                            <p class="text-gray-400 text-xs mt-2">
                                "For large lists, checking every single account can take time and be heavy on network (need to check whether it exists, its balance, whether it's a token or NFT contract address, etc. for each account), so we recommend turning this on if you're sure your list is correct"
                            </p>
                        </div>
                    </Show>
                    <button
                        class={move || {
                            if has_rows() {
                                "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg px-4 py-3 font-medium cursor-pointer"
                            } else {
                                "w-full bg-neutral-700 text-neutral-400 rounded-lg px-4 py-3 font-medium cursor-not-allowed"
                            }
                        }}
                        disabled=move || !has_rows()
                        on:click=move |_| {
                            modal.set(None);
                            let batches = import_table
                                .get()
                                .into_iter()
                                .enumerate()
                                .collect::<Vec<_>>();
                            let batches = batches
                                .chunks(25)
                                .map(|chunk| chunk.to_vec())
                                .collect::<Vec<_>>();
                            set_recipients
                                .set(
                                    import_table
                                        .get()
                                        .into_iter()
                                        .map(|(account_id, amount)| MultiSendRecipient {
                                            recipient: account_id.to_string(),
                                            amount: amount.to_string(),
                                            ..Default::default()
                                        })
                                        .collect(),
                                );
                            let check_only_first_val = check_only_first.get_untracked();
                            let import_table_data = import_table.get();
                            if check_only_first_val && import_table_data.len() > MANY_ROWS {
                                set_recipients
                                    .update(|recipients| {
                                        for (idx, recipient) in recipients.iter_mut().enumerate() {
                                            if idx >= MANY_ROWS {
                                                recipient.account_exists = true;
                                                recipient.amount_error = None;
                                                recipient.recipient_balance = Some(Balance::MAX);
                                                recipient.is_loading_recipient = false;
                                                recipient.recipient_warning = None;
                                                recipient.has_typed_recipient = true;
                                                recipient.has_typed_amount = true;
                                            }
                                        }
                                    });
                            }
                            import_table.set(vec![]);
                            spawn_local(async move {
                                'outer: for batch in batches {
                                    for (idx, (account_id, amount)) in batch {
                                        if check_only_first_val && idx >= MANY_ROWS {
                                            break 'outer;
                                        } else {
                                            trigger_validation(
                                                idx,
                                                RecipientField::Recipient,
                                                account_id.to_string(),
                                            );
                                            trigger_validation(
                                                idx,
                                                RecipientField::Amount,
                                                amount.to_string(),
                                            );
                                        }
                                    }
                                    Delay::new(Duration::from_secs(1)).await;
                                }
                            });
                        }
                    >
                        "Use this list"
                    </button>
                </Show>
            </div>
        </div>
    }
}

#[component]
pub fn SendToken() -> impl IntoView {
    let params = use_params_map();
    let token_id = move || params.get().get("token_id").unwrap_or_default();
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let NetworkContext { network, .. } = expect_context::<NetworkContext>();
    let (recipient, set_recipient) = signal("".to_string());
    let (amount, set_amount) = signal("".to_string());
    let (is_loading_recipient, set_is_loading_recipient) = signal(false);
    let (amount_error, set_amount_error) = signal::<Option<String>>(None);
    let (recipient_balance, set_recipient_balance) = signal(None);
    let (has_typed_recipient, set_has_typed_recipient) = signal(false);
    let (has_typed_amount, set_has_typed_amount) = signal(false);
    #[derive(Clone, Debug)]
    struct RecipientWarning {
        message: String,
        link: Option<String>,
        link_text: Option<String>,
    }

    let (recipient_warning, set_recipient_warning) = signal::<Option<RecipientWarning>>(None);
    let (balance_error_count, set_balance_error_count) = signal(0);
    let (balance_error_timeout, set_balance_error_timeout) = signal::<Option<TimeoutHandle>>(None);
    let ModalContext { modal } = expect_context::<ModalContext>();

    let token = move || {
        tokens
            .get()
            .into_iter()
            .find(|t| match &t.token.account_id {
                Token::Near => token_id() == "near",
                Token::Nep141(account_id) => *account_id == token_id(),
            })
    };

    let check_recipient = move |recipient_to_check: String| {
        set_has_typed_recipient.set(true);

        let Ok(recipient_to_check) = recipient_to_check.parse::<AccountId>() else {
            set_recipient_balance.set(None);
            set_is_loading_recipient.set(false);
            set_recipient_warning.set(None);
            return;
        };
        set_is_loading_recipient.set(true);
        let Some(token) = token() else {
            return;
        };

        let rpc_client = client();
        spawn_local(async move {
            let recipient_is_implicit = recipient_to_check
                .as_str()
                .chars()
                .all(|c| c.is_ascii_hexdigit())
                && recipient_to_check.as_str().len() == 64;
            let recipient_is_evm_implicit = recipient_to_check.as_str().starts_with("0x")
                && recipient_to_check
                    .as_str()
                    .chars()
                    .skip(2)
                    .all(|c| c.is_ascii_hexdigit())
                && recipient_to_check.as_str().len() == 42;
            let account_exists = recipient_is_implicit
                || recipient_is_evm_implicit
                || rpc_client
                    .view_account(
                        recipient_to_check.clone(),
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                    .await
                    .is_ok();

            if recipient_to_check == recipient.get_untracked() {
                if account_exists {
                    let recipient_for_validator_check = recipient_to_check.clone();

                    let (balance, ft_metadata_result, nft_metadata_result) = match token
                        .token
                        .account_id
                    {
                        Token::Near => {
                            let metadata_requests = vec![
                                (
                                    recipient_to_check.clone(),
                                    "ft_metadata",
                                    serde_json::json!({}),
                                    QueryFinality::Finality(Finality::None),
                                ),
                                (
                                    recipient_to_check.clone(),
                                    "nft_metadata",
                                    serde_json::json!({}),
                                    QueryFinality::Finality(Finality::None),
                                ),
                            ];

                            let metadata_results = rpc_client
                                .batch_call::<serde_json::Value>(metadata_requests)
                                .await;

                            let balance = rpc_client
                                .view_account(
                                    recipient_to_check.clone(),
                                    QueryFinality::Finality(Finality::DoomSlug),
                                )
                                .await
                                .map(|acc| acc.amount.as_yoctonear())
                                .unwrap_or(0);

                            let (ft_result, nft_result) = match metadata_results {
                                Ok(results) if results.len() == 2 => {
                                    let ft_result = match &results[0] {
                                        Ok(value) => {
                                            serde_json::from_value::<TokenMetadata>(value.clone())
                                                .ok()
                                        }
                                        Err(_) => None,
                                    };
                                    let nft_result = results[1].is_ok();
                                    (
                                        ft_result.ok_or(()),
                                        if nft_result { Ok(()) } else { Err(()) },
                                    )
                                }
                                _ => (Err(()), Err(())),
                            };

                            (balance, ft_result, nft_result)
                        }
                        Token::Nep141(token_id) => {
                            let batch_requests = vec![
                                (
                                    recipient_to_check.clone(),
                                    "ft_metadata",
                                    serde_json::json!({}),
                                    QueryFinality::Finality(Finality::None),
                                ),
                                (
                                    recipient_to_check.clone(),
                                    "nft_metadata",
                                    serde_json::json!({}),
                                    QueryFinality::Finality(Finality::None),
                                ),
                                (
                                    token_id.clone(),
                                    "ft_balance_of",
                                    serde_json::json!({"account_id": recipient_to_check.clone()}),
                                    QueryFinality::Finality(Finality::DoomSlug),
                                ),
                            ];

                            let batch_results = rpc_client
                                .batch_call::<serde_json::Value>(batch_requests)
                                .await;

                            match batch_results {
                                Ok(results) if results.len() == 3 => {
                                    let ft_result = match &results[0] {
                                        Ok(value) => {
                                            serde_json::from_value::<TokenMetadata>(value.clone())
                                                .ok()
                                        }
                                        Err(_) => None,
                                    };
                                    let nft_result = results[1].is_ok();
                                    let balance = match &results[2] {
                                        Ok(value) => serde_json::from_value::<U128>(value.clone())
                                            .map(u128::from)
                                            .unwrap_or(0),
                                        Err(_) => 0,
                                    };

                                    (
                                        balance,
                                        ft_result.ok_or(()),
                                        if nft_result { Ok(()) } else { Err(()) },
                                    )
                                }
                                _ => (0, Err(()), Err(())),
                            }
                        }
                    };
                    if ft_metadata_result.is_ok() {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is a token contract address, not someone's wallet address, sending tokens to it would likely result in asset loss".to_string(),
                            link: Some(format!("/token/{}", recipient_for_validator_check)),
                            link_text: Some("View token details".to_string()),
                        }));
                    } else if nft_metadata_result.is_ok() {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is an NFT contract address, not someone's wallet address, sending tokens to it would likely result in asset loss".to_string(),
                            link: Some(format!("/nfts/{}", recipient_for_validator_check)),
                            link_text: Some("View NFT collection".to_string()),
                        }));
                    } else if is_validator_supported(
                        &recipient_for_validator_check,
                        network.get_untracked(),
                    ) {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is a validator address. Sending tokens to validators will result in asset loss. Consider using the staking functionality instead".to_string(),
                            link: Some(format!("/stake/{}/stake", recipient_for_validator_check)),
                            link_text: Some("Stake instead".to_string()),
                        }));
                    } else if recipient_is_evm_implicit && balance == 0 {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is an EVM-like address on NEAR blockchain. These addresses are supported, but they're incredibly rare, so you probably don't want to do this. Please use a bridge if you want to send tokens to Ethereum or other networks".to_string(),
                            link: None,
                            link_text: None,
                        }));
                    } else {
                        set_recipient_warning.set(None);
                    }

                    set_recipient_balance.set(Some(balance));
                } else {
                    set_recipient_balance.set(None);
                    set_recipient_warning.set(None);
                }
                set_is_loading_recipient.set(false);
            }
        });
    };

    let check_amount = move |amount: String| {
        set_has_typed_amount.set(true);

        if let Some(handle) = balance_error_timeout.get_untracked() {
            handle.clear();
        }

        if let Some(token) = token() {
            if let Ok(amount_decimal) = amount.parse::<BigDecimal>() {
                if amount_decimal <= BigDecimal::from(0) {
                    set_amount_error.set(Some("Amount must be greater than 0".to_string()));
                    set_balance_error_count.set(0);
                    return;
                }

                let max_amount_decimal =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                if amount_decimal > max_amount_decimal {
                    let current_count = balance_error_count.get_untracked();

                    if current_count == 0 {
                        set_amount_error.set(Some("Not enough balance".to_string()));
                        set_balance_error_count.set(1);
                    } else if let Ok(handle) = set_timeout_with_handle(
                        move || {
                            let error_messages = [
                                "Not enough balance",
                                "Still not enough",
                                "Your persistence won't increase your balance",
                                "Try again?",
                                "Minting new tokens...",
                                "Minting failed. Still not enough balance",
                                "Please stop trying",
                                "It won't change anything",
                            ];

                            let message_index = current_count % error_messages.len();
                            set_amount_error.set(Some(error_messages[message_index].to_string()));
                            set_balance_error_count.set(current_count + 1);
                        },
                        Duration::from_millis(750),
                    ) {
                        set_balance_error_timeout.set(Some(handle));
                    }
                    return;
                }

                set_amount_error.set(None);
                set_balance_error_count.set(0);
            } else {
                set_amount_error.set(Some("Please enter amount".to_string()));
                set_balance_error_count.set(0);
            }
        }
    };

    let handle_send = move |_| {
        if recipient_balance.get().is_none() || amount_error.get().is_some() {
            return;
        }

        let Ok(recipient) = recipient.get().parse::<AccountId>() else {
            panic!(
                "Recipient '{}' cannot be parsed as AccountId, yet recipient_balance is Some",
                recipient()
            );
        };
        let Ok(amount_decimal) = amount.get().parse::<BigDecimal>() else {
            panic!(
                "Amount '{}' cannot be parsed as BigDecimal, yet amount_error is None",
                amount()
            );
        };
        let Some(token) = token() else {
            panic!("Token not found, but tried to send it");
        };
        let amount_raw = decimal_to_balance(amount_decimal, token.token.metadata.decimals);

        spawn_local(async move {
            let confirmation = SendConfirmationData {
                token,
                transfers: vec![SendConfirmationTransfer {
                    recipient,
                    amount: amount_raw,
                }],
            };

            modal.set(Some(Box::new(move || {
                view! {
                    <SendConfirmationModal
                        confirmation_data=confirmation.clone()
                        clear_fields=move || {
                            set_recipient.set("".to_string());
                            set_amount.set("".to_string());
                            set_has_typed_recipient.set(false);
                            set_has_typed_amount.set(false);
                            set_recipient_balance.set(None);
                            set_amount_error.set(None);
                        }
                    />
                }
                .into_any()
            })));
        });
    };

    view! {
        <div class="flex flex-col gap-4 p-3 md:p-4 transition-all duration-100">
            <div class="flex items-center justify-between mb-2">
                <A
                    href="/"
                    attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <span>Back</span>
                </A>
                <A
                    href=move || format!("/multi-send/{}", token_id())
                    attr:class="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuUsers width="16" height="16" />
                    <span>Multisend</span>
                </A>
            </div>

            {move || {
                if loading_tokens() {
                    view! {
                        <div class="flex items-center justify-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    }
                        .into_any()
                } else if let Some(token) = token() {
                    view! {
                        <div class="flex flex-col gap-4">
                            <div class="bg-neutral-900 rounded-xl p-4">
                                <div class="flex items-center gap-3">
                                    {match token.token.metadata.icon.clone() {
                                        Some(icon) => {
                                            view! { <img src=icon class="w-12 h-12 rounded-full" /> }
                                                .into_any()
                                        }
                                        None => {
                                            view! {
                                                <div class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                                                    {token.token.metadata.symbol.chars().next().unwrap_or('?')}
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }} <div>
                                        <h2 class="text-white text-xl font-bold">
                                            {token.token.metadata.name.clone()}
                                        </h2>
                                        <p class="text-gray-400">
                                            {format_token_amount(
                                                token.balance,
                                                token.token.metadata.decimals,
                                                &token.token.metadata.symbol,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-2">
                                    <label class="text-gray-400">Recipient</label>
                                    <input
                                        type="text"
                                        class="w-full focus:ring-2 bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                        style=move || {
                                            if has_typed_recipient.get() {
                                                if recipient_balance.get().is_none()
                                                    && !is_loading_recipient.get()
                                                {
                                                    "border: 2px solid rgb(239 68 68)"
                                                } else if !is_loading_recipient.get()
                                                    && recipient_warning.get().is_none()
                                                {
                                                    "border: 2px solid rgb(34 197 94)"
                                                } else if !is_loading_recipient.get()
                                                    && recipient_warning.get().is_some()
                                                {
                                                    "border: 2px solid rgb(234 179 8)"
                                                } else {
                                                    "border: 2px solid rgb(55 65 81)"
                                                }
                                            } else {
                                                "border: 2px solid transparent"
                                            }
                                        }
                                        placeholder="account.near"
                                        prop:value=recipient
                                        on:input=move |ev| {
                                            let value = event_target_value(&ev).to_lowercase();
                                            set_recipient.set(value.clone());
                                            set_is_loading_recipient.set(true);
                                            set_recipient_balance.set(None);
                                            check_recipient(value);
                                        }
                                    />
                                    {move || {
                                        if let Some(warning) = recipient_warning.get() {
                                            view! {
                                                <div class="text-yellow-500 text-sm mt-2 font-medium">
                                                    <div class="flex items-center gap-2 mb-1">
                                                        <Icon
                                                            icon=icondata::LuTriangleAlert
                                                            width="16"
                                                            height="16"
                                                            attr:class="min-w-4 min-h-4"
                                                        />
                                                        <span>{warning.message}</span>
                                                    </div>
                                                    {if let (Some(link), Some(link_text)) = (
                                                        warning.link,
                                                        warning.link_text,
                                                    ) {
                                                        view! {
                                                            <div class="ml-6">
                                                                <A
                                                                    href=link
                                                                    attr:class="text-yellow-400 hover:text-yellow-300 underline cursor-pointer"
                                                                >
                                                                    {link_text}
                                                                </A>
                                                            </div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }}
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                    {move || {
                                        if let Some(recipient_balance) = recipient_balance.get() {
                                            view! {
                                                <p class="text-green-500 text-sm mt-2 font-medium">
                                                    {move || {
                                                        if let Ok(recipient) = recipient.get().parse::<AccountId>()
                                                        {
                                                            format_account_id_no_hide(&recipient)
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }}" has "
                                                    {format_token_amount_no_hide(
                                                        recipient_balance,
                                                        token.token.metadata.decimals,
                                                        &token.token.metadata.symbol,
                                                    )}
                                                </p>
                                            }
                                                .into_any()
                                        } else if is_loading_recipient.get() {
                                            view! {
                                                <p class="text-gray-400 text-sm mt-2 font-medium">
                                                    Checking...
                                                </p>
                                            }
                                                .into_any()
                                        } else if has_typed_recipient.get() {
                                            view! {
                                                <p class="text-red-500 text-sm mt-2 font-medium">
                                                    "Account does not exist"
                                                </p>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label class="text-gray-400">Amount</label>
                                    <div class="relative">
                                        <input
                                            type="text"
                                            class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                                            style=move || {
                                                if has_typed_amount.get() {
                                                    if amount_error.get().is_some() {
                                                        "border: 2px solid rgb(239 68 68)"
                                                    } else {
                                                        "border: 2px solid rgb(34 197 94)"
                                                    }
                                                } else {
                                                    "border: 2px solid transparent"
                                                }
                                            }
                                            placeholder="0.0"
                                            prop:value=amount
                                            on:input=move |ev| {
                                                let value = event_target_value(&ev);
                                                set_amount.set(value.clone());
                                                check_amount(value);
                                            }
                                        />
                                        <button
                                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple"
                                            on:click=move |_| {
                                                let max_amount_decimal = balance_to_decimal(
                                                    token.balance,
                                                    token.token.metadata.decimals,
                                                );
                                                let gas_cost_decimal = if token.token.account_id
                                                    == Token::Near
                                                {
                                                    BigDecimal::from_f64(0.0001).unwrap_or_default()
                                                } else {
                                                    BigDecimal::from(0)
                                                };
                                                let final_amount_decimal = (&max_amount_decimal
                                                    - &gas_cost_decimal)
                                                    .max(BigDecimal::from(0));
                                                let mut max_amount_str = final_amount_decimal.to_string();
                                                if max_amount_str.contains('.') {
                                                    max_amount_str = max_amount_str
                                                        .trim_end_matches('0')
                                                        .trim_end_matches('.')
                                                        .to_string();
                                                }
                                                set_amount.set(max_amount_str.clone());
                                                check_amount(max_amount_str);
                                            }
                                        >
                                            MAX
                                        </button>
                                    </div>
                                    {move || {
                                        let error_message = amount_error.get();
                                        let usd_display = if let Ok(amount_decimal) = amount
                                            .get()
                                            .parse::<BigDecimal>()
                                        {
                                            let usd_value_decimal = &amount_decimal
                                                * &token.token.price_usd_hardcoded;
                                            format_usd_value_no_hide(usd_value_decimal)
                                        } else {
                                            "$0".to_string()
                                        };

                                        view! {
                                            <div class="flex justify-between items-center mt-2">
                                                <p class="text-red-500 text-sm font-medium">
                                                    {error_message.unwrap_or_default()}
                                                </p>
                                                <p class="text-gray-400 text-sm">{usd_display}</p>
                                            </div>
                                        }
                                            .into_any()
                                    }}
                                </div>

                                <button
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden hover:bg-neutral-900/70 enabled:bg-gradient-to-r enabled:from-blue-500 enabled:to-purple-500 enabled:hover:from-blue-600 enabled:hover:to-purple-600"
                                    disabled=move || {
                                        recipient_balance.get().is_none()
                                            || amount_error.get().is_some()
                                            || is_loading_recipient.get() || !has_typed_amount.get()
                                    }
                                    on:click=handle_send
                                >
                                    <div class="flex items-center justify-center gap-2">
                                        {move || {
                                            if is_loading_recipient.get() {
                                                view! {
                                                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <>
                                                        <Icon icon=icondata::LuSend width="20" height="20" />
                                                        <span>Send</span>
                                                    </>
                                                }
                                                    .into_any()
                                            }
                                        }}
                                    </div>
                                </button>
                            </div>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="flex flex-col items-center justify-center h-32 gap-4">
                            <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                <div class="flex items-center gap-2 text-red-400">
                                    <Icon icon=icondata::LuTriangleAlert width="20" height="20" />
                                    <p class="text-white font-medium">Token not found</p>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}

#[component]
pub fn SendMultiToken() -> impl IntoView {
    let params = use_params_map();
    let token_id = move || params.get_untracked().get("token_id").unwrap_or_default();

    let TokensContext { tokens, .. } = expect_context::<TokensContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let NetworkContext { network, .. } = expect_context::<NetworkContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();

    let (recipients, set_recipients) = signal(vec![MultiSendRecipient::default()]);
    let (file_error, set_file_error) = signal::<Option<String>>(None);
    let import_content = RwSignal::new(String::new());
    let import_table = RwSignal::new(Vec::<(AccountId, BigDecimal)>::new());
    let (show_all_recipients, set_show_all_recipients) = signal(false);

    let token = move || {
        tokens
            .get()
            .into_iter()
            .find(|t| match &t.token.account_id {
                Token::Near => token_id() == "near",
                Token::Nep141(acc) => *acc == token_id(),
            })
    };
    let token_untracked = move || {
        tokens
            .get_untracked()
            .into_iter()
            .find(|t| match &t.token.account_id {
                Token::Near => token_id() == "near",
                Token::Nep141(acc) => *acc == token_id(),
            })
    };

    let add_recipient = move |_: leptos::ev::MouseEvent| {
        set_recipients.update(|r| r.push(MultiSendRecipient::default()));
    };

    let remove_recipient = move |index: usize| {
        set_recipients.update(|r| {
            if r.len() > 1 {
                r.remove(index);
                // Reset show_all state if we go back to 50 or fewer recipients
                if r.len() <= 50 {
                    set_show_all_recipients.set(false);
                }
            }
        });
    };

    let update_recipient_field = {
        move |index: usize, field: RecipientField, value: String| {
            set_recipients.update(|r| {
                if let Some(rec) = r.get_mut(index) {
                    match field {
                        RecipientField::Recipient => {
                            rec.recipient = value.clone();
                            rec.has_typed_recipient = true;
                            rec.is_loading_recipient = true;
                            rec.account_exists = false;
                            rec.recipient_warning = None;
                            rec.recipient_balance = None;
                        }
                        RecipientField::Amount => {
                            rec.amount = value.clone();
                            rec.has_typed_amount = true;
                        }
                    }
                }
            });
            let Some(token_data) = token_untracked() else {
                return;
            };

            if matches!(field, RecipientField::Amount) {
                let decimals = token_data.token.metadata.decimals;
                set_recipients.update(|r| {
                    if let Some(rec) = r.get_mut(index) {
                        let amount_trim = value.trim();
                        if amount_trim.is_empty() {
                            rec.amount_error = Some("Please enter amount".to_string());
                            return;
                        }
                        match amount_trim.parse::<BigDecimal>() {
                            Ok(dec) => {
                                if dec <= BigDecimal::from(0) {
                                    rec.amount_error =
                                        Some("Amount must be greater than 0".to_string());
                                    return;
                                }
                                let max_amount_dec =
                                    balance_to_decimal(token_data.balance, decimals);
                                if dec > max_amount_dec {
                                    rec.amount_error = Some("Not enough balance".to_string());
                                } else {
                                    rec.amount_error = None;
                                }
                            }
                            Err(_) => {
                                rec.amount_error = Some("Please enter amount".to_string());
                            }
                        }
                    }
                });
                return;
            }

            if !matches!(field, RecipientField::Recipient) {
                return;
            }

            if !is_valid_account_id(&value) {
                set_recipients.update(|r| {
                    if let Some(rec) = r.get_mut(index) {
                        rec.is_loading_recipient = false;
                    }
                });
                return;
            }

            let rpc_client = client.get_untracked();
            let network_val = network.get_untracked();
            let account_id: AccountId = match value.parse() {
                Ok(a) => a,
                Err(_) => {
                    return;
                }
            };

            spawn_local(async move {
                let recipient_is_implicit = is_implicit_account(account_id.as_str());
                let recipient_is_evm = is_evm_implicit_account(account_id.as_str());
                let account_exists = recipient_is_implicit
                    || recipient_is_evm
                    || rpc_client
                        .view_account(
                            account_id.clone(),
                            QueryFinality::Finality(Finality::DoomSlug),
                        )
                        .await
                        .is_ok();

                if !account_exists {
                    set_recipients.update(|r| {
                        if let Some(rec) = r.get_mut(index) {
                            if rec.recipient == account_id.as_str() {
                                rec.account_exists = false;
                                rec.is_loading_recipient = false;
                            }
                        }
                    });
                    return;
                }

                let account_id_clone = account_id.clone();

                let (bal_res, ft_res, nft_res) = match &token_data.token.account_id {
                    Token::Near => {
                        let metadata_requests = vec![
                            (
                                account_id_clone.clone(),
                                "ft_metadata",
                                serde_json::json!({}),
                                QueryFinality::Finality(Finality::None),
                            ),
                            (
                                account_id_clone.clone(),
                                "nft_metadata",
                                serde_json::json!({}),
                                QueryFinality::Finality(Finality::None),
                            ),
                        ];

                        let metadata_results = rpc_client
                            .batch_call::<serde_json::Value>(metadata_requests)
                            .await;

                        let balance = rpc_client
                            .view_account(
                                account_id_clone.clone(),
                                QueryFinality::Finality(Finality::DoomSlug),
                            )
                            .await
                            .map(|a| a.amount.as_yoctonear())
                            .unwrap_or(0);

                        let (ft_result, nft_result) = match metadata_results {
                            Ok(results) if results.len() == 2 => {
                                let ft_result = match &results[0] {
                                    Ok(value) => {
                                        serde_json::from_value::<TokenMetadata>(value.clone()).ok()
                                    }
                                    Err(_) => None,
                                };
                                let nft_result = results[1].is_ok();
                                (
                                    ft_result.ok_or(()),
                                    if nft_result { Ok(()) } else { Err(()) },
                                )
                            }
                            _ => (Err(()), Err(())),
                        };

                        (balance, ft_result, nft_result)
                    }
                    Token::Nep141(token_acc) => {
                        let batch_requests = vec![
                            (
                                account_id_clone.clone(),
                                "ft_metadata",
                                serde_json::json!({}),
                                QueryFinality::Finality(Finality::None),
                            ),
                            (
                                account_id_clone.clone(),
                                "nft_metadata",
                                serde_json::json!({}),
                                QueryFinality::Finality(Finality::None),
                            ),
                            (
                                token_acc.clone(),
                                "ft_balance_of",
                                serde_json::json!({"account_id": account_id_clone.clone()}),
                                QueryFinality::Finality(Finality::DoomSlug),
                            ),
                        ];

                        let batch_results = rpc_client
                            .batch_call::<serde_json::Value>(batch_requests)
                            .await;

                        match batch_results {
                            Ok(results) if results.len() == 3 => {
                                let ft_result = match &results[0] {
                                    Ok(value) => {
                                        serde_json::from_value::<TokenMetadata>(value.clone()).ok()
                                    }
                                    Err(_) => None,
                                };
                                let nft_result = results[1].is_ok();
                                let balance = match &results[2] {
                                    Ok(value) => serde_json::from_value::<U128>(value.clone())
                                        .map(u128::from)
                                        .unwrap_or(0),
                                    Err(_) => 0,
                                };

                                (
                                    balance,
                                    ft_result.ok_or(()),
                                    if nft_result { Ok(()) } else { Err(()) },
                                )
                            }
                            _ => (0, Err(()), Err(())),
                        }
                    }
                };
                let warning = if ft_res.is_ok() {
                    Some(RecipientWarning { message: "This is a token contract address, not someone's wallet address, sending tokens to it would likely result in asset loss".into(), link: Some(format!("/token/{}", account_id_clone)), link_text: Some("View token details".into()) })
                } else if nft_res.is_ok() {
                    Some(RecipientWarning { message: "This is an NFT contract address, not someone's wallet address, sending tokens to it would likely result in asset loss".into(), link: Some(format!("/nfts/{}", account_id_clone)), link_text: Some("View NFT collection".into()) })
                } else if crate::pages::stake::is_validator_supported(
                    &account_id_clone,
                    network_val,
                ) {
                    Some(RecipientWarning { message: "This is a validator address. Sending tokens to validators will result in asset loss.".into(), link: Some(format!("/stake/{}/stake", account_id_clone)), link_text: Some("Stake instead".into()) })
                } else if recipient_is_evm && bal_res == 0 {
                    Some(RecipientWarning {
                        message:
                            "This is an EVM-like address on NEAR blockchain. Please use a bridge."
                                .into(),
                        link: None,
                        link_text: None,
                    })
                } else {
                    None
                };

                let balance_val = bal_res;
                set_recipients.update(|r| {
                    if let Some(rec) = r.get_mut(index) {
                        if rec.recipient == account_id.as_str() {
                            rec.account_exists = true;
                            rec.recipient_balance = Some(balance_val);
                            rec.recipient_warning = warning;
                            rec.is_loading_recipient = false;
                        }
                    }
                });
            });
        }
    };

    let handle_send_multi = move |_: leptos::ev::MouseEvent| {
        let Some(token_data) = token_untracked() else {
            return;
        };
        let mut transfers: Vec<SendConfirmationTransfer> = Vec::new();
        for rec in recipients.get() {
            if !rec.account_exists {
                return;
            }
            if let Ok(amount_dec) = rec.amount.parse::<BigDecimal>() {
                let amount_raw = decimal_to_balance(amount_dec, token_data.token.metadata.decimals);
                transfers.push(SendConfirmationTransfer {
                    recipient: rec.recipient.parse().unwrap(),
                    amount: amount_raw,
                });
            } else {
                return;
            }
        }
        let confirmation = SendConfirmationData {
            token: token_data,
            transfers,
        };
        modal.set(Some(Box::new(move || {
            view! {
                <SendConfirmationModal
                    confirmation_data=confirmation.clone()
                    clear_fields=move || {
                        set_recipients.set(vec![MultiSendRecipient::default()]);
                        set_show_all_recipients.set(false);
                    }
                />
            }
            .into_any()
        })));
    };

    let can_send = move || {
        if let Some(t) = token() {
            let total_raw: Balance = recipients
                .get()
                .iter()
                .filter_map(|r| r.amount.parse::<BigDecimal>().ok())
                .map(|d| decimal_to_balance(d, t.token.metadata.decimals))
                .sum();
            let exceeds_balance = total_raw > t.balance;

            let mut seen: HashSet<String> = HashSet::new();
            let mut has_dup = false;
            for r in recipients.get() {
                let lower = r.recipient.to_lowercase();
                if !lower.is_empty() && !seen.insert(lower) {
                    has_dup = true;
                    break;
                }
            }

            let all_valid = recipients
                .get()
                .iter()
                .all(|r| r.account_exists && r.amount_error.is_none() && !r.amount.is_empty());
            all_valid && !exceeds_balance && !has_dup
        } else {
            false
        }
    };

    let total_amount_dec = move || {
        recipients
            .get()
            .iter()
            .filter_map(|r| r.amount.parse::<BigDecimal>().ok())
            .fold(BigDecimal::from(0), |acc, x| acc + x)
    };

    let file_input_ref: NodeRef<Input> = NodeRef::new();

    let open_file_dialog = move |_| {
        if let Some(input) = file_input_ref.get() {
            input.click();
        }
    };

    let on_file_change = {
        move |ev: Event| {
            let input: HtmlInputElement = ev.target().unwrap().unchecked_into();
            if let Some(file) = input.files().and_then(|fl| fl.get(0)) {
                const MAX_SIZE: usize = 1024 * 1024; // 1MB
                if file.size() as usize > MAX_SIZE {
                    #[allow(clippy::float_arithmetic)]
                    let _ = window().alert_with_message(&format!(
                        "File too large. Maximum size is 1MB, got {:.1}MB",
                        file.size() / 1024.0 / 1024.0
                    ));
                    return;
                } else {
                    set_file_error.set(None);
                }

                let reader = FileReader::new().unwrap();

                let onload = Closure::<dyn Fn(ProgressEvent)>::new(move |e: ProgressEvent| {
                    let result = e
                        .target()
                        .unwrap()
                        .dyn_into::<FileReader>()
                        .unwrap()
                        .result()
                        .unwrap();
                    let text = result.as_string().unwrap_or_default();
                    import_content.set(text);

                    modal.set(Some(Box::new(move || {
                        view! {
                            <ImportModal
                                content=import_content
                                import_table=import_table
                                set_recipients=set_recipients
                                token=Signal::derive(move || token().expect("token"))
                                trigger_validation=update_recipient_field
                                file_error=file_error
                            />
                        }
                        .into_any()
                    })));
                });
                reader.set_onload(Some(onload.as_ref().unchecked_ref()));
                reader.read_as_text(&file).unwrap();
                onload.forget();
            }
        }
    };

    view! {
        <div class="flex flex-col gap-4 p-2 md:p-4 transition-all duration-100 overflow-y-auto">
            <div class="flex items-center justify-between mb-2">
                <A
                    href=move || format!("/send/{}", token_id())
                    attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <span>Back</span>
                </A>
                <A
                    href=move || format!("/send/{}", token_id())
                    attr:class="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuSend width="16" height="16" />
                    <span>Single Send</span>
                </A>
            </div>

            {move || {
                if let Some(t) = token() {
                    view! {
                        <div class="bg-neutral-900 rounded-xl p-4 mb-2">
                            <div class="flex items-center gap-3">
                                {match t.token.metadata.icon.clone() {
                                    Some(icon) => {
                                        view! { <img src=icon class="w-12 h-12 rounded-full" /> }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                                {t.token.metadata.symbol.chars().next().unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div>
                                    <h2 class="text-white text-xl font-bold">
                                        {t.token.metadata.name.clone()}
                                    </h2>
                                    <p class="text-gray-400">
                                        {format_token_amount(
                                            t.balance,
                                            t.token.metadata.decimals,
                                            &t.token.metadata.symbol,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }}

            <div class="flex items-center justify-between mb-2">
                <h3 class="text-white text-lg font-medium">Recipients</h3>
                <div class="flex gap-2">
                    <button
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                        on:click=add_recipient
                    >
                        <span>+ Add Recipient</span>
                    </button>
                    <button
                        class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 cursor-pointer"
                        on:click=open_file_dialog
                        title="Import from file"
                    >
                        <Icon icon=icondata::LuUpload width="14" height="14" />
                    </button>
                    <input
                        type="file"
                        class="hidden"
                        node_ref=file_input_ref
                        accept="text/*"
                        on:change=on_file_change
                    />
                </div>
            </div>

            <div class="space-y-4">
                {move || {
                    let all_recipients = recipients.get();
                    let recipients_to_show = if show_all_recipients.get()
                        || all_recipients.len() <= 25
                    {
                        all_recipients
                    } else {
                        all_recipients.into_iter().take(25).collect()
                    };
                    recipients_to_show
                        .into_iter()
                        .enumerate()
                        .map(|(index, rec)| {

                            view! {
                                <div class="bg-neutral-900/50 rounded-xl p-3 md:p-4 border border-neutral-700 gap-2 md:gap-4 flex justify-between">
                                    <div class="flex flex-col gap-1 flex-1">
                                        <Show when={move || {
                                            index < 50
                                                || index > recipients.get().len().saturating_sub(50)
                                        }}>
                                            <label class="text-gray-400">Recipient</label>
                                        </Show>
                                        <input
                                            type="text"
                                            class="w-full focus:ring-2 bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                            style=move || {
                                                let recs = recipients.get();
                                                if let Some(r) = recs.get(index) {
                                                    if r.has_typed_recipient {
                                                        if !r.is_loading_recipient && r.recipient_balance.is_none()
                                                        {
                                                            "border: 2px solid rgb(239 68 68)"
                                                        } else if !r.is_loading_recipient
                                                            && r.recipient_warning.is_none()
                                                        {
                                                            "border: 2px solid rgb(34 197 94)"
                                                        } else if !r.is_loading_recipient
                                                            && r.recipient_warning.is_some()
                                                        {
                                                            "border: 2px solid rgb(234 179 8)"
                                                        } else {
                                                            "border: 2px solid rgb(55 65 81)"
                                                        }
                                                    } else {
                                                        "border: 2px solid transparent"
                                                    }
                                                } else {
                                                    "border: 2px solid transparent"
                                                }
                                            }
                                            placeholder="account.near"
                                            prop:value=rec.recipient
                                            on:input=move |ev| update_recipient_field(
                                                index,
                                                RecipientField::Recipient,
                                                event_target_value(&ev).to_lowercase(),
                                            )
                                        />
                                        {move || {
                                            if let Some(rec) = recipients.get().get(index).cloned() {
                                                if let Some(warning) = rec.recipient_warning.clone() {
                                                    let link = warning.link.clone();
                                                    let link_text = warning.link_text.clone();
                                                    view! {
                                                        <div class="text-yellow-500 text-sm font-medium">
                                                            <div class="flex items-center gap-2 mb-1">
                                                                <Icon
                                                                    icon=icondata::LuTriangleAlert
                                                                    width="16"
                                                                    height="16"
                                                                    attr:class="min-w-4 min-h-4"
                                                                />
                                                                <span>{warning.message}</span>
                                                            </div>
                                                            {move || match (link.clone(), link_text.clone()) {
                                                                (Some(l), Some(t)) => {
                                                                    view! {
                                                                        <div class="ml-6">
                                                                            <A
                                                                                href=l
                                                                                attr:class="text-yellow-400 hover:text-yellow-300 underline cursor-pointer"
                                                                            >
                                                                                {t}
                                                                            </A>
                                                                        </div>
                                                                    }
                                                                        .into_any()
                                                                }
                                                                _ => ().into_any(),
                                                            }}
                                                        </div>
                                                    }
                                                        .into_any()
                                                } else if let Some(Balance::MAX) = rec.recipient_balance {
                                                    view! {
                                                        <p class="text-green-500 text-sm font-medium">
                                                            "Validation skipped"
                                                        </p>
                                                    }
                                                        .into_any()
                                                } else if let Some(balance) = rec.recipient_balance {
                                                    let formatted_balance = token()
                                                        .map(|t| {
                                                            format_token_amount_no_hide(
                                                                balance,
                                                                t.token.metadata.decimals,
                                                                &t.token.metadata.symbol,
                                                            )
                                                        })
                                                        .unwrap_or_else(|| balance.to_string());
                                                    view! {
                                                        <p class="text-green-500 text-sm font-medium">
                                                            {format!("{} has {}", rec.recipient, formatted_balance)}
                                                        </p>
                                                    }
                                                        .into_any()
                                                } else if rec.is_loading_recipient {
                                                    view! {
                                                        <p class="text-gray-400 text-sm font-medium">
                                                            "Checking..."
                                                        </p>
                                                    }
                                                        .into_any()
                                                } else if rec.has_typed_recipient {
                                                    let is_dup = {
                                                        let lower = rec.recipient.to_lowercase();
                                                        let mut seen = HashSet::new();
                                                        for (idx, other) in recipients.get().iter().enumerate() {
                                                            if idx == index {
                                                                continue;
                                                            }
                                                            if seen.contains(&other.recipient.to_lowercase()) {
                                                                continue;
                                                            }
                                                            seen.insert(other.recipient.to_lowercase());
                                                        }
                                                        seen.contains(&lower)
                                                    };
                                                    let msg = if is_dup {
                                                        "Duplicate recipient"
                                                    } else {
                                                        "Account does not exist"
                                                    };
                                                    view! {
                                                        <p class="text-red-500 text-sm font-medium">{msg}</p>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                    <div class="flex flex-col gap-1 w-32">
                                        <Show when={move || {
                                            index < 50
                                                || index > recipients.get().len().saturating_sub(50)
                                        }}>
                                            <label class="text-gray-400">Amount</label>
                                        </Show>
                                        <input
                                            type="text"
                                            class="w-full focus:ring-2 bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                            style=move || {
                                                let recipients = recipients.get();
                                                if let Some(r) = recipients.get(index) {
                                                    if r.has_typed_amount {
                                                        if r.amount_error.is_some() {
                                                            "border: 2px solid rgb(239 68 68)"
                                                        } else {
                                                            "border: 2px solid rgb(34 197 94)"
                                                        }
                                                    } else {
                                                        "border: 2px solid transparent"
                                                    }
                                                } else {
                                                    "border: 2px solid transparent"
                                                }
                                            }
                                            placeholder="0.0"
                                            prop:value=rec.amount
                                            on:input=move |ev| update_recipient_field(
                                                index,
                                                RecipientField::Amount,
                                                event_target_value(&ev),
                                            )
                                        />
                                        {move || {
                                            let recs = recipients.get();
                                            if let Some(r) = recs.get(index) {
                                                if let Some(err) = &r.amount_error {
                                                    view! {
                                                        <p class="text-red-500 text-sm mt-2 font-medium">
                                                            {err.clone()}
                                                        </p>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
                                    <button
                                        class="text-red-400 hover:text-red-300 cursor-pointer self-start"
                                        on:click=move |_| remove_recipient(index)
                                    >
                                        <Icon
                                            icon=icondata::LuTrash2
                                            width="20"
                                            height="20"
                                            attr:class="min-w-5 min-h-5"
                                        />
                                    </button>
                                </div>
                            }
                        })
                        .collect::<Vec<_>>()
                }}
            </div>

            <Show when=move || {
                let recipient_count = recipients.get().len();
                recipient_count > 50 && !show_all_recipients.get()
            }>
                <div class="flex justify-center mt-4">
                    <button
                        class="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                        on:click=move |_| set_show_all_recipients.set(true)
                    >
                        {move || {
                            let hidden_count = recipients.get().len() - 50;
                            format!("Show {} More Recipients", hidden_count)
                        }}
                    </button>
                </div>
            </Show>

            <div class="bg-neutral-900/50 rounded-xl p-4 border border-neutral-700 mt-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="text-white font-medium">Summary</h4>
                        <p class="text-gray-400 text-sm mt-1">
                            {move || {
                                let count = recipients.get().len();
                                format!("{} recipient{}", count, if count == 1 { "" } else { "s" })
                            }}
                        </p>
                        {move || {
                            let mut warnings: Vec<String> = Vec::new();
                            {
                                let mut seen: HashSet<String> = HashSet::new();
                                let mut duplicates: Vec<String> = Vec::new();
                                for r in recipients.get() {
                                    let lower = r.recipient.to_lowercase();
                                    if !lower.is_empty() && !seen.insert(lower.clone()) {
                                        duplicates.push(lower);
                                    }
                                }
                                if !duplicates.is_empty() {
                                    warnings
                                        .push(
                                            format!("Duplicate recipients: {}", duplicates.join(", ")),
                                        );
                                }
                            }
                            if let Some(t) = token() {
                                let total_raw: Balance = recipients
                                    .get()
                                    .iter()
                                    .filter_map(|r| r.amount.parse::<BigDecimal>().ok())
                                    .map(|d| decimal_to_balance(d, t.token.metadata.decimals))
                                    .sum();
                                if total_raw > t.balance {
                                    warnings.push("Total amount exceeds balance".to_string());
                                }
                                if matches!(t.token.account_id, Token::Nep141(_)) {
                                    let recipient_count = recipients.get().len();
                                    let required_near = "0.01 NEAR"
                                        .parse::<NearToken>()
                                        .unwrap()
                                        .checked_mul(recipient_count as u128)
                                        .unwrap();
                                    let near_balance = tokens
                                        .get()
                                        .iter()
                                        .find(|token| matches!(token.token.account_id, Token::Near))
                                        .map(|token| token.balance)
                                        .unwrap_or(0);
                                    if near_balance < required_near.as_yoctonear() {
                                        warnings
                                            .push(
                                                format!(
                                                    "Insufficient NEAR for gas fees. We recommend having at least {} for {} recipient{}",
                                                    format_token_amount_no_hide(
                                                        required_near.as_yoctonear(),
                                                        24,
                                                        "NEAR",
                                                    ),
                                                    recipient_count,
                                                    if recipient_count == 1 { "" } else { "s" },
                                                ),
                                            );
                                    }
                                }
                            }
                            if warnings.is_empty() {
                                ().into_any()
                            } else {
                                view! {
                                    <p class="text-red-400 text-sm mt-2 font-medium">
                                        {warnings.join("; ")}
                                    </p>
                                }
                                    .into_any()
                            }
                        }}
                    </div>
                    {move || {
                        if let Some(t) = token() {
                            let total_str = format_token_amount_full_precision(
                                decimal_to_balance(total_amount_dec(), t.token.metadata.decimals),
                                t.token.metadata.decimals,
                                &t.token.metadata.symbol,
                            );
                            view! {
                                <div class="text-right">
                                    <div class="text-white font-medium">{total_str}</div>
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}
                </div>
            </div>

            <button
                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden hover:bg-neutral-900/70 enabled:bg-gradient-to-r enabled:from-blue-500 enabled:to-purple-500 enabled:hover:from-blue-600 enabled:hover:to-purple-600"
                disabled=move || !can_send()
                on:click=handle_send_multi
            >
                <div class="flex items-center justify-center gap-2">
                    <Icon icon=icondata::LuSend width="20" height="20" />
                    <span>Send All</span>
                </div>
            </button>
        </div>
    }
}

pub async fn execute_send(
    confirmation: SendConfirmationData,
    signer_id: AccountId,
    add_transaction: WriteSignal<Vec<EnqueuedTransaction>>,
    modal: RwSignal<Option<Box<dyn Fn() -> AnyView>>, LocalStorage>,
    clear_fields: impl Fn(),
    rpc_client: RpcClient,
) {
    let decimals = confirmation.token.token.metadata.decimals;
    let symbol = confirmation.token.token.metadata.symbol.clone();

    let pending_txns = match &confirmation.token.token.account_id {
        Token::Near => confirmation
            .transfers
            .iter()
            .map(|transfer| {
                let description = format!(
                    "Send {} to {}",
                    format_token_amount_full_precision(transfer.amount, decimals, &symbol),
                    transfer.recipient
                );

                EnqueuedTransaction::create(
                    description,
                    signer_id.clone(),
                    transfer.recipient.clone(),
                    vec![Action::Transfer(TransferAction {
                        deposit: NearToken::from_yoctonear(transfer.amount),
                    })],
                )
            })
            .collect::<Vec<_>>(),
        Token::Nep141(token_id) => {
            let storage_balance_requests: Vec<_> = confirmation
                .transfers
                .iter()
                .map(|transfer| {
                    (
                        token_id.clone(),
                        "storage_balance_of",
                        serde_json::json!({
                            "account_id": transfer.recipient,
                        }),
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                })
                .collect();

            let mut storage_balance_results = Vec::new();
            for batch in storage_balance_requests.chunks(100) {
                let Ok(batch_results) = rpc_client
                    .batch_call::<Option<StorageBalance>>(batch.to_vec())
                    .await
                else {
                    modal.set(Some(Box::new(move || {
                        view! { <SendErrorModal /> }.into_any()
                    })));
                    return;
                };
                storage_balance_results.extend(batch_results);
            }

            let transfers: Vec<_> = confirmation
                .transfers
                .iter()
                .zip(storage_balance_results.into_iter())
                .map(|(transfer, storage_balance_result)| {
                    let needs_storage_deposit = match storage_balance_result {
                        Ok(storage_balance) => match storage_balance {
                            Some(storage_balance) => storage_balance.total.is_zero(),
                            None => true,
                        },
                        Err(_) => false, // If we can't check, assume no deposit needed
                    };
                    (transfer.clone(), needs_storage_deposit)
                })
                .collect();

            transfers
                .chunks(15)
                .map(|transfers| {
                    let actions = transfers
                        .iter()
                        .flat_map(|(transfer, needs_storage_deposit)| {
                            let transfer_action =
                                Action::FunctionCall(Box::new(FunctionCallAction {
                                    method_name: "ft_transfer".to_string(),
                                    args: serde_json::to_vec(&serde_json::json!({
                                        "receiver_id": transfer.recipient,
                                        "amount": transfer.amount.to_string(),
                                    }))
                                    .unwrap(),
                                    gas: NearGas::from_tgas(10).as_gas(),
                                    deposit: NearToken::from_yoctonear(1),
                                }));

                            let mut actions = Vec::new();
                            if *needs_storage_deposit {
                                actions.push(Action::FunctionCall(Box::new(FunctionCallAction {
                                    method_name: "storage_deposit".to_string(),
                                    args: serde_json::to_vec(&serde_json::json!({
                                        "account_id": transfer.recipient,
                                        "registration_only": true,
                                    }))
                                    .unwrap(),
                                    gas: NearGas::from_tgas(5).as_gas(),
                                    deposit: "0.002 NEAR".parse().unwrap(),
                                })));
                            }
                            actions.push(transfer_action);
                            actions
                        })
                        .collect::<Vec<_>>();
                    (
                        transfers.iter().map(|(t, _)| t).collect::<Vec<_>>(),
                        actions,
                    )
                })
                .map(|(transfers, actions)| {
                    EnqueuedTransaction::create(
                        format!(
                            "Send {} to {}",
                            format_token_amount_full_precision(
                                transfers.iter().map(|t| t.amount).sum(),
                                decimals,
                                &symbol
                            ),
                            transfers
                                .iter()
                                .map(|t| t.recipient.to_string())
                                .collect::<Vec<_>>()
                                .join(", "),
                        ),
                        signer_id.clone(),
                        token_id.clone(),
                        actions,
                    )
                })
                .collect::<Vec<_>>()
        }
    };

    let (rx_vec, pending_txns) = pending_txns.into_iter().unzip::<_, _, Vec<_>, Vec<_>>();

    add_transaction.update(|txs| {
        txs.extend(pending_txns);
    });

    let mut has_error = false;
    for rx in rx_vec {
        match rx.await {
            Ok(Ok(tx)) => {
                if let Some(outcome) = tx.final_execution_outcome {
                    if matches!(
                        outcome.final_outcome.status,
                        FinalExecutionStatus::Failure(_)
                    ) {
                        modal.set(Some(Box::new(move || {
                            view! { <SendErrorModal /> }.into_any()
                        })));
                        has_error = true;
                        break;
                    }
                }
            }
            Ok(Err(_)) | Err(_) => {
                modal.set(Some(Box::new(move || {
                    view! { <SendErrorModal /> }.into_any()
                })));
                has_error = true;
                break;
            }
        }
    }
    if !has_error {
        let success = SendResult {
            token: confirmation.token,
            recipients: confirmation
                .transfers
                .iter()
                .map(|transfer| transfer.recipient.clone())
                .collect(),
            amount: confirmation
                .transfers
                .iter()
                .map(|transfer| transfer.amount)
                .sum(),
        };
        modal.set(Some(Box::new(move || {
            view! { <SendSuccessModal result=success.clone() /> }.into_any()
        })));
    }

    clear_fields();
}
