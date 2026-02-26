use bigdecimal::BigDecimal;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::{
    CallError, QueryFinality,
    types::{
        AccountId, Action, CryptoHash, FinalExecutionStatus, Finality, FunctionCallAction, NearGas,
        NearToken,
    },
};
use serde::Serialize;

use crate::{
    components::select::{Select, SelectOption},
    contexts::{
        accounts_context::AccountsContext,
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::decimal_to_balance,
};

const INTEAR_LAUNCH_ACCOUNT: &str = "launch.intear.near";
const LONG_ID_BASE_DEPOSIT: NearToken = NearToken::from_millinear(33);
const SHORT_ID_COST: NearToken = NearToken::from_near(1);
const SHORT_ID_BASE_DEPOSIT: NearToken =
    NearToken::from_yoctonear(SHORT_ID_COST.as_yoctonear() + LONG_ID_BASE_DEPOSIT.as_yoctonear());
const STORAGE_ESTIMATE_OVERHEAD_BYTES: usize = 400;

#[component]
pub fn IntearLaunchModal<F>(
    token_symbol: String,
    token_name: String,
    token_supply: BigDecimal,
    token_decimals: u8,
    token_image: String,
    on_confirm: F,
) -> impl IntoView
where
    F: Fn() + 'static,
{
    let modal_context = expect_context::<ModalContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    #[derive(Clone, Debug, Default)]
    struct IntearLaunchForm {
        telegram: String,
        x: String,
        website: String,
        description: String,
        short_id: bool,
        fee_preset: FeePreset,
    }

    #[derive(Clone, Copy, Debug, PartialEq, Eq, Default)]
    enum FeePreset {
        #[default]
        NoFee,
        FixedPointOnePercent,
        FixedPointFivePercent,
        FixedOnePercent,
        ScheduledTwentyToPointOneOneHour,
        ScheduledFortyToPointFiveFourHours,
    }

    #[derive(Serialize)]
    enum FeeReceiverArg {
        Account(AccountId),
    }

    #[derive(Serialize)]
    enum ScheduledFeeCurveArg {
        Linear,
    }

    #[derive(Serialize)]
    enum FeeAmountArg {
        Fixed(u32),
        Scheduled {
            start: (u64, u32),
            end: (u64, u32),
            curve: ScheduledFeeCurveArg,
        },
    }

    type FeeEntryArg = (FeeReceiverArg, FeeAmountArg);

    let (form, set_form) = signal(IntearLaunchForm::default());
    let (first_buy, set_first_buy) = signal(String::new());
    let fee_preset_to_value = |preset: FeePreset| -> &'static str {
        match preset {
            FeePreset::NoFee => "no_fee",
            FeePreset::FixedPointOnePercent => "fixed_0_1",
            FeePreset::FixedPointFivePercent => "fixed_0_5",
            FeePreset::FixedOnePercent => "fixed_1_0",
            FeePreset::ScheduledTwentyToPointOneOneHour => "scheduled_20_to_0_1_1h",
            FeePreset::ScheduledFortyToPointFiveFourHours => "scheduled_40_to_0_5_4h",
        }
    };
    let fee_preset_from_value = |value: &str| -> FeePreset {
        match value {
            "fixed_0_1" => FeePreset::FixedPointOnePercent,
            "fixed_0_5" => FeePreset::FixedPointFivePercent,
            "fixed_1_0" => FeePreset::FixedOnePercent,
            "scheduled_20_to_0_1_1h" => FeePreset::ScheduledTwentyToPointOneOneHour,
            "scheduled_40_to_0_5_4h" => FeePreset::ScheduledFortyToPointFiveFourHours,
            _ => FeePreset::NoFee,
        }
    };
    let fee_preset_options = Signal::derive(|| {
        vec![
            SelectOption::new("no_fee".to_string(), || view! { "No fee" }.into_any()),
            SelectOption::new("fixed_0_1".to_string(), || view! { "0.1%" }.into_any()),
            SelectOption::new("fixed_0_5".to_string(), || view! { "0.5%" }.into_any()),
            SelectOption::new("fixed_1_0".to_string(), || view! { "1%" }.into_any()),
            SelectOption::new("scheduled_20_to_0_1_1h".to_string(), || {
                view! { "20% -> 0.1% over 1 hour" }.into_any()
            }),
            SelectOption::new("scheduled_40_to_0_5_4h".to_string(), || {
                view! { "40% -> 0.5% over 4 hours" }.into_any()
            }),
        ]
    });
    let optional_string = |value: &str| {
        let trimmed = value.trim();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed.to_string())
        }
    };
    let validate_telegram_link = |telegram: &str| -> Option<String> {
        if telegram.is_empty() {
            return None;
        }
        let prefix = "https://t.me/";
        let Some(handle) = telegram.strip_prefix(prefix) else {
            return Some(format!("Must start with {prefix}"));
        };
        if handle.is_empty() {
            return Some(format!("Must include a handle after {prefix}"));
        }
        if handle.contains('/') {
            return Some(format!("Cannot contain '/' after {prefix}"));
        }
        None
    };
    let validate_x_link = |x: &str| -> Option<String> {
        if x.is_empty() {
            return None;
        }
        let prefix = "https://x.com/";
        let Some(handle) = x.strip_prefix(prefix) else {
            return Some(format!("Must start with {prefix}"));
        };
        if handle.is_empty() {
            return Some(format!("Must include a handle after {prefix}"));
        }
        if handle.contains('/') {
            return Some(format!("Cannot contain '/' after {prefix}"));
        }
        None
    };
    let validate_website = |website: &str| -> Option<String> {
        if website.is_empty() {
            return None;
        }
        if !website.starts_with("https://") {
            return Some("Must start with https://".to_string());
        }
        if reqwest::Url::parse(website).is_err() {
            return Some("Must be a valid URL".to_string());
        }
        None
    };
    let validate_first_buy = move |buy_str: &str| -> Option<String> {
        if buy_str.is_empty() {
            return None;
        }

        match buy_str.parse::<BigDecimal>() {
            Ok(amount) => {
                if amount <= 0 {
                    Some("Amount must be greater than 0".to_string())
                } else {
                    None
                }
            }
            Err(_) => Some("Invalid number".to_string()),
        }
    };
    let preview_id_resource = LocalResource::new({
        let token_symbol = token_symbol.clone();
        move || {
            let short_id = form.get().short_id;
            let symbol = token_symbol.clone();
            let rpc_client = client.get();

            async move {
                let contract_id = INTEAR_LAUNCH_ACCOUNT
                    .parse::<AccountId>()
                    .map_err(|e| format!("Invalid contract ID: {e}"))?;

                rpc_client
                    .call::<AccountId>(
                        contract_id,
                        "preview_id",
                        serde_json::json!({
                            "symbol": symbol,
                            "short_id": short_id,
                        }),
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                    .await
                    .map_err(|e| {
                        if let CallError::ExecutionError(e) = &e
                            && e.contains("Short account ID for this symbol is already taken.")
                        {
                            "Short account ID for this symbol is already taken".to_string()
                        } else {
                            format!("Failed to preview ID: {e}")
                        }
                    })
            }
        }
    });

    let selected_account = move || accounts_context.accounts.get().selected_account_id;

    let token_image_for_deposit = token_image.clone();
    let token_name_for_deposit = token_name.clone();
    let token_symbol_for_deposit = token_symbol.clone();
    let calculate_storage_deposit = move || {
        let values = form.get();
        let estimated_size_bytes = token_image_for_deposit.len()
            + token_name_for_deposit.len()
            + token_symbol_for_deposit.len()
            + values.telegram.len()
            + values.x.len()
            + values.website.len()
            + values.description.len()
            + STORAGE_ESTIMATE_OVERHEAD_BYTES;
        let size_bd = BigDecimal::from(estimated_size_bytes as u64);
        let divisor = BigDecimal::from(100_000_u64);
        let size_near = size_bd / divisor;
        let size_yoctonear = decimal_to_balance(size_near, 24);
        NearToken::from_yoctonear(size_yoctonear)
    };
    let calculate_storage_deposit_for_total = calculate_storage_deposit.clone();
    let calculate_total_deposit = move || {
        let values = form.get();
        let base_deposit = if values.short_id {
            SHORT_ID_BASE_DEPOSIT
        } else {
            LONG_ID_BASE_DEPOSIT
        };
        let with_storage = base_deposit
            .checked_add(calculate_storage_deposit_for_total())
            .unwrap_or(base_deposit);
        let first_buy_token = if first_buy.get().is_empty() {
            NearToken::from_yoctonear(0)
        } else {
            match first_buy.get().parse::<BigDecimal>() {
                Ok(amount) => {
                    if amount <= 0 {
                        NearToken::from_yoctonear(0)
                    } else {
                        let yoctonear = decimal_to_balance(amount, 24);
                        NearToken::from_yoctonear(yoctonear)
                    }
                }
                Err(_) => NearToken::from_yoctonear(0),
            }
        };
        with_storage
            .checked_add(first_buy_token)
            .unwrap_or(with_storage)
    };
    let calculate_total_deposit_label = calculate_total_deposit.clone();

    let is_valid = move || {
        let values = form.get();
        if selected_account().is_none() {
            return false;
        }
        if validate_telegram_link(&values.telegram).is_some() {
            return false;
        }
        if validate_x_link(&values.x).is_some() {
            return false;
        }
        if validate_website(&values.website).is_some() {
            return false;
        }
        if validate_first_buy(&first_buy.get()).is_some() {
            return false;
        }
        matches!(preview_id_resource.get(), Some(Ok(_)))
    };

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let token_symbol_clone = token_symbol.clone();
    let token_name_clone = token_name.clone();
    let token_supply_clone = token_supply.clone();
    let token_image_clone = token_image.clone();

    let handle_confirm = move || {
        let values = form.get();
        let Some(Ok(preview_id)) = preview_id_resource.get() else {
            return;
        };

        let token_symbol = token_symbol_clone.clone();
        let token_name = token_name_clone.clone();
        let token_supply = token_supply_clone.clone();
        let token_image = token_image_clone.clone();
        let first_buy_value = first_buy.get();
        let signer_id = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id;
        let deposit = calculate_total_deposit();
        let add_transaction = add_transaction;

        on_confirm();
        close_modal();

        spawn_local(async move {
            let Some(signer_id) = signer_id else {
                log::error!("No account selected");
                return;
            };

            let total_supply = decimal_to_balance(token_supply, token_decimals as u32);
            let now_nanos = chrono::Utc::now().timestamp_nanos_opt().unwrap() as u64;
            let one_hour_nanos = 60 * 60 * 1_000_000_000;
            let fees: Option<Vec<FeeEntryArg>> = match values.fee_preset {
                FeePreset::NoFee => None,
                FeePreset::FixedPointOnePercent => Some(vec![(
                    FeeReceiverArg::Account(signer_id.clone()),
                    FeeAmountArg::Fixed(1_000),
                )]),
                FeePreset::FixedPointFivePercent => Some(vec![(
                    FeeReceiverArg::Account(signer_id.clone()),
                    FeeAmountArg::Fixed(5_000),
                )]),
                FeePreset::FixedOnePercent => Some(vec![(
                    FeeReceiverArg::Account(signer_id.clone()),
                    FeeAmountArg::Fixed(10_000),
                )]),
                FeePreset::ScheduledTwentyToPointOneOneHour => Some(vec![(
                    FeeReceiverArg::Account(signer_id.clone()),
                    FeeAmountArg::Scheduled {
                        start: (now_nanos, 200_000),
                        end: (now_nanos.saturating_add(one_hour_nanos), 1_000),
                        curve: ScheduledFeeCurveArg::Linear,
                    },
                )]),
                FeePreset::ScheduledFortyToPointFiveFourHours => Some(vec![(
                    FeeReceiverArg::Account(signer_id.clone()),
                    FeeAmountArg::Scheduled {
                        start: (now_nanos, 400_000),
                        end: (now_nanos.saturating_add(4 * one_hour_nanos), 5_000),
                        curve: ScheduledFeeCurveArg::Linear,
                    },
                )]),
            };
            let first_buy_token = if first_buy_value.is_empty() {
                None
            } else {
                match first_buy_value.parse::<BigDecimal>() {
                    Ok(amount) => {
                        if amount <= 0 {
                            None
                        } else {
                            let yoctonear = decimal_to_balance(amount, 24);
                            Some(NearToken::from_yoctonear(yoctonear))
                        }
                    }
                    Err(_) => None,
                }
            };
            let args = serde_json::json!({
                "name": token_name,
                "symbol": token_symbol.clone(),
                "icon": optional_string(&token_image),
                "decimals": token_decimals,
                "total_supply": total_supply.to_string(),
                "short_id": values.short_id,
                "fees": fees,
                "first_buy": first_buy_token,
                "launch_data": {
                    "telegram": optional_string(&values.telegram),
                    "x": optional_string(&values.x),
                    "website": optional_string(&values.website),
                    "description": optional_string(&values.description),
                },
            });

            let action = Action::FunctionCall(Box::new(FunctionCallAction {
                method_name: "launch_token".to_string(),
                args: serde_json::to_vec(&args).unwrap(),
                gas: NearGas::from_tgas(300).into(),
                deposit,
            }));

            let launch_account: AccountId = INTEAR_LAUNCH_ACCOUNT.parse().unwrap();
            let (rx, transaction) = EnqueuedTransaction::create(
                format!("Launch {token_symbol} on Intear Launch"),
                signer_id.clone(),
                launch_account,
                vec![action],
                false,
            );
            add_transaction.update(|txs| txs.push(transaction));

            match rx.await {
                Ok(Ok(tx_details)) => {
                    let Some(outcome) = tx_details.final_execution_outcome else {
                        modal_context.modal.set(Some(Box::new(move || {
                            view! {
                                <IntearLaunchErrorModal
                                    tx_hash=None
                                    error_message="Transaction outcome not found".to_string()
                                />
                            }
                            .into_any()
                        })));
                        return;
                    };

                    let tx_hash = outcome.final_outcome.transaction.hash;
                    match outcome.final_outcome.status {
                        FinalExecutionStatus::SuccessValue(value) => {
                            match serde_json::from_slice::<AccountId>(&value) {
                                Ok(token_account_id) => {
                                    modal_context.modal.set(Some(Box::new(move || {
                                        view! {
                                            <IntearLaunchSuccessModal
                                                token_symbol=token_symbol.clone()
                                                token_account_id=token_account_id.clone()
                                            />
                                        }
                                        .into_any()
                                    })));
                                }
                                Err(e) => {
                                    modal_context.modal.set(Some(Box::new(move || {
                                        view! {
                                            <IntearLaunchErrorModal
                                                tx_hash=Some(tx_hash)
                                                error_message=format!(
                                                    "Launch succeeded, but failed to parse returned token ID: {e}",
                                                )
                                            />
                                        }
                                        .into_any()
                                    })));
                                }
                            }
                        }
                        FinalExecutionStatus::Failure(_) => {
                            modal_context.modal.set(Some(Box::new(move || {
                                view! {
                                    <IntearLaunchErrorModal
                                        tx_hash=Some(tx_hash)
                                        error_message="There was an error launching your token on Intear Launch."
                                            .to_string()
                                    />
                                }
                                .into_any()
                            })));
                        }
                        _ => {
                            modal_context.modal.set(Some(Box::new(move || {
                                view! {
                                    <IntearLaunchErrorModal
                                        tx_hash=Some(tx_hash)
                                        error_message="Unexpected transaction status".to_string()
                                    />
                                }
                                .into_any()
                            })));
                        }
                    }
                }
                Ok(Err(e)) => {
                    modal_context.modal.set(Some(Box::new(move || {
                        view! { <IntearLaunchErrorModal tx_hash=None error_message=format!("Transaction failed: {e}") /> }
                        .into_any()
                    })));
                }
                Err(_) => {
                    modal_context.modal.set(Some(Box::new(move || {
                        view! { <IntearLaunchErrorModal tx_hash=None error_message="Transaction cancelled".to_string() /> }
                        .into_any()
                    })));
                }
            }
        });

        log::info!("Intear preview ID used for launch: {preview_id}");
    };

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            on:click=move |_| close_modal()
        >
            <div
                class="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
                on:click=move |e| e.stop_propagation()
            >
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold">"Launch on Intear Launch"</h2>
                    <button
                        on:click=move |_| close_modal()
                        class="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                    >
                        <Icon icon=icondata::LuX width="20" height="20" />
                    </button>
                </div>

                <div class="text-sm text-gray-400 mb-4">
                    "Official Intear launchpad, bonding curve-like (immediately deployed on Intear DEX)"
                </div>

                <div class="flex flex-col gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    // Short ID
                    <div class="border border-neutral-700 rounded p-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                prop:checked=move || form.get().short_id
                                on:change=move |ev| {
                                    set_form.update(|f| f.short_id = event_target_checked(&ev));
                                }
                                class="w-4 h-4 cursor-pointer"
                            />
                            <span class="text-sm font-medium">"Short CA without numbers"</span>
                        </label>
                        <div class="text-xs text-gray-500 mt-1">"Costs 1 NEAR"</div>
                    </div>

                    // Preview
                    <div class="border border-neutral-700 rounded p-4 bg-neutral-900">
                        <div class="text-sm font-medium mb-2">"CA Preview"</div>
                        {move || {
                            match preview_id_resource.get() {
                                None => {
                                    view! {
                                        <div class="text-xs text-yellow-300">
                                            "Loading preview..."
                                        </div>
                                    }
                                        .into_any()
                                }
                                Some(Ok(account_id)) => {
                                    view! {
                                        <div class="text-sm font-mono text-white break-all">
                                            {account_id.to_string()}
                                        </div>
                                    }
                                        .into_any()
                                }
                                Some(Err(e)) => {
                                    view! { <div class="text-xs text-red-400">{e}</div> }.into_any()
                                }
                            }
                        }}
                    </div>

                    // Telegram Link
                    <div>
                        <label class="flex text-sm font-medium mb-1 items-center gap-2">
                            <Icon icon=icondata::SiTelegram width="16" height="16" />
                            "Telegram "
                            <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().telegram
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.telegram = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="https://t.me/yourchat"
                        />
                        {move || {
                            if let Some(error_msg) = validate_telegram_link(&form.get().telegram) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // X Link
                    <div>
                        <label class="flex text-sm font-medium mb-1 items-center gap-2">
                            <Icon icon=icondata::SiX width="16" height="16" />
                            "X "
                            <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().x
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.x = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="https://x.com/yourhandle"
                        />
                        {move || {
                            if let Some(error_msg) = validate_x_link(&form.get().x) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // Website
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Website " <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().website
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.website = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="https://example.com"
                        />
                        {move || {
                            if let Some(error_msg) = validate_website(&form.get().website) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // Description
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Description " <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <textarea
                            prop:value=move || form.get().description
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.description = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white min-h-24"
                            placeholder="Write a short description for your token launch"
                        />
                    </div>

                    // First Buy
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "First Buy (NEAR) " <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || first_buy.get()
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_first_buy.set(value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="1.0"
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            "If you want to be guaranteed to buy first, enter the amount here"
                        </div>
                        {move || {
                            if let Some(error_msg) = validate_first_buy(&first_buy.get()) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // Fee Preset
                    <div>
                        <label class="block text-sm font-medium mb-1">"Fees"</label>
                        <Select
                            options=fee_preset_options
                            on_change=Callback::new(move |value: String| {
                                set_form
                                    .update(|f| {
                                        f.fee_preset = fee_preset_from_value(&value);
                                    });
                            })
                            initial_value=fee_preset_to_value(form.get_untracked().fee_preset)
                                .to_string()
                            class="text-white"
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            {move || {
                                selected_account()
                                    .map(|account_id| {
                                        format!("Receiver for fees: {account_id}")
                                    })
                                    .unwrap_or_else(|| "Select an account first".to_string())
                            }}
                        </div>
                    </div>

                    // Review Section
                    <div class="border-t border-neutral-700 pt-4 mt-2">
                        <div class="text-sm font-medium mb-3">"Token Details"</div>
                        <div class="bg-neutral-900 p-4 rounded border border-neutral-600 space-y-3">
                            <div class="flex items-center gap-3 pb-3 border-b border-neutral-700">
                                <img
                                    src=token_image.clone()
                                    alt="Token"
                                    class="w-12 h-12 rounded-lg border border-neutral-600"
                                />
                                <div>
                                    <div class="text-white font-semibold">
                                        {token_symbol.clone()}
                                    </div>
                                    <div class="text-neutral-400 text-sm">{token_name.clone()}</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <div class="text-xs text-neutral-400">"Supply"</div>
                                    <div class="text-sm text-white">
                                        {token_supply.to_plain_string()}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-xs text-neutral-400">"Decimals"</div>
                                    <div class="text-sm text-white">{token_decimals}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    // Buttons
                    <div class="flex gap-2 mt-4">
                        <button
                            on:click=move |_| handle_confirm()
                            disabled=move || !is_valid()
                            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded cursor-pointer"
                        >
                            {move || format!("Create ({})", calculate_total_deposit_label())}
                        </button>
                        <button
                            on:click=move |_| close_modal()
                            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                        >
                            "Cancel"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
fn IntearLaunchSuccessModal(token_symbol: String, token_account_id: AccountId) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();
    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let launch_url = format!("https://dex.intea.rs/launch?token={token_account_id}");

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            on:click=move |_| close_modal()
        >
            <div
                class="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full m-4"
                on:click=move |e| e.stop_propagation()
            >
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center text-green-400">
                        <Icon icon=icondata::LuCheck width="32" height="32" />
                    </div>
                    <h2 class="text-xl font-semibold">"Token Launched!"</h2>
                    <p class="text-center text-gray-400">
                        "Your token " <span class="font-semibold text-white">{token_symbol}</span>
                        " was launched with CA "
                        <span class="font-mono text-white break-all">
                            {token_account_id.to_string()}
                        </span>
                    </p>
                    <a
                        href=launch_url
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center cursor-pointer"
                    >
                        "Open on Intear Launch"
                    </a>
                    <button
                        on:click=move |_| close_modal()
                        class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
fn IntearLaunchErrorModal(tx_hash: Option<CryptoHash>, error_message: String) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();
    let network_context = expect_context::<NetworkContext>();
    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let nearblocks_url = move || {
        tx_hash
            .as_ref()
            .map(|hash| match network_context.network.get() {
                Network::Mainnet => format!("https://nearblocks.io/txns/{hash}"),
                Network::Testnet => format!("https://testnet.nearblocks.io/txns/{hash}"),
                Network::Localnet(_) => String::new(),
            })
            .filter(|url| !url.is_empty())
    };

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            on:click=move |_| close_modal()
        >
            <div
                class="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full m-4"
                on:click=move |e| e.stop_propagation()
            >
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center text-red-400">
                        <Icon icon=icondata::LuX width="32" height="32" />
                    </div>
                    <h2 class="text-xl font-semibold">"Launch Failed"</h2>
                    <p class="text-center text-gray-400">{error_message}</p>
                    {move || {
                        if let Some(url) = nearblocks_url() {
                            view! {
                                <a
                                    href=url
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center cursor-pointer"
                                >
                                    "View Transaction Details"
                                </a>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}
                    <button
                        on:click=move |_| close_modal()
                        class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}
