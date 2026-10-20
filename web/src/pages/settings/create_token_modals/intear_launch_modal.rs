use bigdecimal::BigDecimal;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::{
    QueryFinality,
    types::{
        AccountId, Action, CryptoHash, ExecutionStatusView, FinalExecutionStatus, Finality,
        FunctionCallAction, NearGas, NearToken,
    },
};
use serde::{Deserialize, Serialize};

use crate::{
    components::select::{Select, SelectOption},
    contexts::{
        accounts_context::AccountsContext,
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    translations::TranslationKey,
    utils::decimal_to_balance,
};

const INTEAR_LAUNCH_ACCOUNT: &str = "launch-v2.intear.near";
const LAUNCH_GAS: NearGas = NearGas::from_tgas(400);
const LAUNCH_GAS_PER_ARGS_BYTE: NearGas = NearGas::from_gas(400_000_000);

#[derive(Clone, Debug, Deserialize)]
struct LaunchPreparation {
    token_account_id: Option<AccountId>,
    deposit: Option<NearToken>,
    errors: Vec<String>,
}

fn parse_near_amount(value: &str) -> Option<NearToken> {
    let amount = value.parse::<BigDecimal>().ok()?;
    let yoctonear = decimal_to_balance(amount, 24);
    (yoctonear > 0).then(|| NearToken::from_yoctonear(yoctonear))
}

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

    #[derive(Clone, Debug, Default, PartialEq)]
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
            SelectOption::new("no_fee".to_string(), || {
                view! { {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchNoFee.format(&[])} }.into_any()
            }),
            SelectOption::new("fixed_0_1".to_string(), || view! { "0.1%" }.into_any()),
            SelectOption::new("fixed_0_5".to_string(), || view! { "0.5%" }.into_any()),
            SelectOption::new("fixed_1_0".to_string(), || view! { "1%" }.into_any()),
            SelectOption::new("scheduled_20_to_0_1_1h".to_string(), || {
                view! { {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchFeeScheduled20.format(&[])} }
                    .into_any()
            }),
            SelectOption::new("scheduled_40_to_0_5_4h".to_string(), || {
                view! { {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchFeeScheduled40.format(&[])} }
                    .into_any()
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
    let validate_first_buy = move |buy_str: &str| -> Option<String> {
        if buy_str.is_empty() {
            return None;
        }

        match buy_str.parse::<BigDecimal>() {
            Ok(_) if parse_near_amount(buy_str).is_none() => Some(
                TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchAmountGt0.format(&[]),
            ),
            Ok(_) => None,
            Err(_) => Some(
                TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchInvalidNumber
                    .format(&[]),
            ),
        }
    };
    let selected_account = move || accounts_context.accounts.get().selected_account_id;

    let launch_args = {
        let token_symbol = token_symbol.clone();
        let token_name = token_name.clone();
        let token_supply = token_supply.clone();
        let token_image = token_image.clone();
        move |values: &IntearLaunchForm, first_buy: &str, signer_id: &AccountId| {
            let total_supply = decimal_to_balance(token_supply.clone(), token_decimals as u32);
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
            serde_json::json!({
                "name": token_name,
                "symbol": token_symbol,
                "icon": optional_string(&token_image),
                "decimals": token_decimals,
                "total_supply": total_supply.to_string(),
                "short_id": values.short_id,
                "fees": fees,
                "first_buy": parse_near_amount(first_buy),
                "launch_data": {
                    "telegram": optional_string(&values.telegram),
                    "x": optional_string(&values.x),
                    "website": optional_string(&values.website),
                    "description": optional_string(&values.description),
                },
            })
        }
    };

    #[derive(Clone)]
    struct PreparedLaunch {
        values: IntearLaunchForm,
        first_buy: String,
        signer_id: AccountId,
        preparation: LaunchPreparation,
    }

    let launch_preparation_resource = LocalResource::new({
        let launch_args = launch_args.clone();
        move || {
            let values = form.get();
            let first_buy_value = first_buy.get();
            let signer_id = selected_account();
            let rpc_client = client.get();
            let launch_args = launch_args.clone();

            async move {
                let Some(signer_id) = signer_id else {
                    return Ok::<_, String>(None);
                };
                let mut args = launch_args(&values, &first_buy_value, &signer_id);
                args["account_id"] = serde_json::json!(signer_id);
                let preparation = rpc_client
                    .call::<LaunchPreparation>(
                        INTEAR_LAUNCH_ACCOUNT.parse().unwrap(),
                        "prepare_launch",
                        args,
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                    .await
                    .map_err(|e| e.to_string())?;
                Ok(Some(PreparedLaunch {
                    values,
                    first_buy: first_buy_value,
                    signer_id,
                    preparation,
                }))
            }
        }
    });
    let current_preparation = move || match launch_preparation_resource.get() {
        Some(Ok(Some(prepared)))
            if prepared.values == form.get()
                && prepared.first_buy == first_buy.get()
                && Some(&prepared.signer_id) == selected_account().as_ref() =>
        {
            Some(prepared.preparation)
        }
        _ => None,
    };
    let current_deposit = move || current_preparation().and_then(|preparation| preparation.deposit);

    // A first buy that isn't a valid amount is sent as no first buy, so the deposit isn't for it
    let is_valid =
        move || validate_first_buy(&first_buy.get()).is_none() && current_deposit().is_some();

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let token_symbol_clone = token_symbol.clone();

    let handle_confirm = move || {
        if !is_valid() {
            return;
        }
        let values = form.get();
        // launch_token takes only the exact deposit, which is for these inputs
        let Some(LaunchPreparation {
            token_account_id: Some(preview_id),
            deposit: Some(deposit),
            ..
        }) = current_preparation()
        else {
            return;
        };

        let token_symbol = token_symbol_clone.clone();
        let first_buy_value = first_buy.get();
        let signer_id = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id;
        let launch_args = launch_args.clone();
        let add_transaction = add_transaction;

        on_confirm();
        close_modal();

        spawn_local(async move {
            let Some(signer_id) = signer_id else {
                log::error!("No account selected");
                return;
            };

            let args =
                serde_json::to_vec(&launch_args(&values, &first_buy_value, &signer_id)).unwrap();
            // A larger name or icon needs more gas for the token's `new`, and all arguments need
            // gas to be parsed
            let gas = LAUNCH_GAS
                .checked_add(
                    LAUNCH_GAS_PER_ARGS_BYTE
                        .checked_mul(args.len() as u64)
                        .unwrap(),
                )
                .unwrap();

            let action = Action::FunctionCall(Box::new(FunctionCallAction {
                method_name: "launch_token".to_string(),
                args,
                gas: gas.into(),
                deposit,
            }));

            let launch_account: AccountId = INTEAR_LAUNCH_ACCOUNT.parse().unwrap();
            let (rx, transaction) = EnqueuedTransaction::create(
                TranslationKey::MiscTransactionLaunchIntearLaunch
                    .format(&[("token_symbol", &token_symbol)]),
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
                                    error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrTxOutcome
                                        .format(&[]))
                                />
                            }
                            .into_any()
                        })));
                        return;
                    };

                    let tx_hash = outcome.final_outcome.transaction.hash;
                    let any_receipt_failed =
                        outcome
                            .final_outcome
                            .receipts_outcome
                            .iter()
                            .any(|receipt| {
                                matches!(receipt.outcome.status, ExecutionStatusView::Failure(_))
                            });
                    match outcome.final_outcome.status {
                        FinalExecutionStatus::SuccessValue(_) if any_receipt_failed => {
                            modal_context.modal.set(Some(Box::new(move || {
                                view! {
                                    <IntearLaunchErrorModal
                                        tx_hash=Some(tx_hash)
                                        error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrLaunchFailed
                                            .format(&[]))
                                    />
                                }
                                .into_any()
                            })));
                        }
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
                                    let err_msg = e.to_string();
                                    modal_context.modal.set(Some(Box::new(move || {
                                        let err_msg = err_msg.clone();
                                        view! {
                                            <IntearLaunchErrorModal
                                                tx_hash=Some(tx_hash)
                                                error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrParseFailed
                                                    .format(&[("error", err_msg.as_str())]))
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
                                        error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrLaunchFailed
                                            .format(&[]))
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
                                        error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrUnexpectedStatus
                                            .format(&[]))
                                    />
                                }
                                .into_any()
                            })));
                        }
                    }
                }
                Ok(Err(e)) => {
                    let err_msg = e.to_string();
                    modal_context.modal.set(Some(Box::new(move || {
                        let err_msg = err_msg.clone();
                        view! {
                            <IntearLaunchErrorModal
                                tx_hash=None
                                error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrTxFailed
                                    .format(&[("error", err_msg.as_str())]))
                            />
                        }
                        .into_any()
                    })));
                }
                Err(_) => {
                    modal_context.modal.set(Some(Box::new(move || {
                        view! {
                            <IntearLaunchErrorModal
                                tx_hash=None
                                error_message=Signal::derive(move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrTxCancelled
                                    .format(&[]))
                            />
                        }
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
                    <h2 class="text-xl font-semibold">
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchTitle.format(&[])}
                    </h2>
                    <button
                        on:click=move |_| close_modal()
                        class="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                    >
                        <Icon icon=icondata::LuX width="20" height="20" />
                    </button>
                </div>

                <div class="text-sm text-gray-400 mb-4">
                    {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchDescription.format(&[])}
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
                            <span class="text-sm font-medium">
                                {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchShortCa.format(&[])}
                            </span>
                        </label>
                        <div class="text-xs text-gray-500 mt-1">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchCostsOneNear.format(&[])}
                        </div>
                    </div>

                    // Preview
                    <div class="border border-neutral-700 rounded p-4 bg-neutral-900">
                        <div class="text-sm font-medium mb-2">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchCaPreview.format(&[])}
                        </div>
                        {move || {
                            match launch_preparation_resource.get() {
                                None => {
                                    view! {
                                        <div class="text-xs text-yellow-300">
                                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchLoadingPreview
                                                .format(&[])}
                                        </div>
                                    }
                                        .into_any()
                                }
                                Some(Ok(None)) => {
                                    view! {
                                        <div class="text-xs text-yellow-300">
                                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchSelectAccountFirst
                                                .format(&[])}
                                        </div>
                                    }
                                        .into_any()
                                }
                                Some(Ok(Some(prepared))) => {
                                    view! {
                                        <div class="text-sm font-mono text-white break-all">
                                            {prepared
                                                .preparation
                                                .token_account_id
                                                .map_or_else(|| "-".to_string(), |account_id| account_id.to_string())}
                                        </div>
                                    }
                                        .into_any()
                                }
                                Some(Err(e)) => {
                                    let e = TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchErrPreviewFailed
                                        .format(&[("error", e.as_str())]);
                                    view! { <div class="text-xs text-red-400">{e}</div> }.into_any()
                                }
                            }
                        }}
                    </div>

                    // Telegram Link
                    <div>
                        <label class="flex text-sm font-medium mb-1 items-center gap-2">
                            <Icon icon=icondata::SiTelegram width="16" height="16" />
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchTelegram.format(&[])}
                            " "
                            <span class="text-gray-500">
                                {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchOptional.format(&[])}
                            </span>
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
                    </div>

                    // X Link
                    <div>
                        <label class="flex text-sm font-medium mb-1 items-center gap-2">
                            <Icon icon=icondata::SiX width="16" height="16" />
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchX.format(&[])}
                            " "
                            <span class="text-gray-500">
                                {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchOptional.format(&[])}
                            </span>
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
                    </div>

                    // Website
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchWebsite.format(&[])}
                            " "
                            <span class="text-gray-500">
                                {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchOptional.format(&[])}
                            </span>
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
                    </div>

                    // Description
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchTokenDescription.format(&[])}
                            " "
                            <span class="text-gray-500">
                                {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchOptional.format(&[])}
                            </span>
                        </label>
                        <textarea
                            prop:value=move || form.get().description
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.description = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white min-h-24"
                            placeholder=move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchDescriptionPlaceholder.format(&[])
                        />
                    </div>

                    // First Buy
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchFirstBuy.format(&[])}
                            " "
                            <span class="text-gray-500">
                                {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchOptional.format(&[])}
                            </span>
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
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchBuyFirstDescription.format(&[])}
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
                        <label class="block text-sm font-medium mb-1">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchFees.format(&[])}
                        </label>
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
                                        TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchFeeReceiver.format(&[
                                            ("account_id", account_id.as_str()),
                                        ])
                                    })
                                    .unwrap_or_else(|| {
                                        TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchSelectAccountFirst.format(&[])
                                    })
                            }}
                        </div>
                    </div>

                    // Review Section
                    <div class="border-t border-neutral-700 pt-4 mt-2">
                        <div class="text-sm font-medium mb-3">
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchTokenDetails.format(&[])}
                        </div>
                        <div class="bg-neutral-900 p-4 rounded border border-neutral-600 space-y-3">
                            <div class="flex items-center gap-3 pb-3 border-b border-neutral-700">
                                <img
                                    src=token_image.clone()
                                    alt=move || {
                                        TranslationKey::PagesSettingsDeveloperCreateTokenTokenImageAlt
                                            .format(&[])
                                    }
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
                                    <div class="text-xs text-neutral-400">
                                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchSupply.format(&[])}
                                    </div>
                                    <div class="text-sm text-white">
                                        {token_supply.to_plain_string()}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-xs text-neutral-400">
                                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchDecimals.format(&[])}
                                    </div>
                                    <div class="text-sm text-white">{token_decimals}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {move || {
                        if let Some(Ok(Some(prepared))) = launch_preparation_resource.get() {
                            prepared
                                .preparation
                                .errors
                                .into_iter()
                                .map(|error| view! { <div class="text-xs text-red-400">{error}</div> })
                                .collect_view()
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}

                    // Buttons
                    <div class="flex gap-2 mt-4">
                        <button
                            on:click=move |_| handle_confirm()
                            disabled=move || !is_valid()
                            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded cursor-pointer"
                        >
                            {move || {
                                let deposit = match current_deposit() {
                                    Some(deposit) => deposit.to_string(),
                                    None => "…".to_string(),
                                };
                                TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchCreateButton
                                    .format(&[("deposit", deposit.as_str())])
                            }}
                        </button>
                        <button
                            on:click=move |_| close_modal()
                            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                        >
                            {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchCancel.format(&[])}
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

    let launch_url = format!("https://dex.intea.rs/?from=near&to={token_account_id}");

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
                    <h2 class="text-xl font-semibold">
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchTokenLaunched.format(&[])}
                    </h2>
                    <p class="text-center text-gray-400">
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchSuccessDescription.format_view(vec![
                            ("token", view! { <span class="font-semibold text-white">{token_symbol.clone()}</span> }.into_any()),
                            ("address", view! { <span class="font-mono text-white break-all">{token_account_id.to_string()}</span> }.into_any()),
                        ])}
                    </p>
                    <a
                        href=launch_url
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center cursor-pointer"
                    >
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchOpenOnIntearLaunch.format(&[])}
                    </a>
                    <button
                        on:click=move |_| close_modal()
                        class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                    >
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchClose.format(&[])}
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
fn IntearLaunchErrorModal(
    tx_hash: Option<CryptoHash>,
    #[prop(into)] error_message: Signal<String>,
) -> impl IntoView {
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
                    <h2 class="text-xl font-semibold">
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchLaunchFailed.format(&[])}
                    </h2>
                    <p class="text-center text-gray-400">{move || error_message.get()}</p>
                    {move || {
                        if let Some(url) = nearblocks_url() {
                            view! {
                                <a
                                    href=url
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center cursor-pointer"
                                >
                                    {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchViewTxDetails.format(&[])}
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
                        {move || TranslationKey::PagesSettingsDeveloperCreateTokenIntearLaunchClose.format(&[])}
                    </button>
                </div>
            </div>
        </div>
    }
}
