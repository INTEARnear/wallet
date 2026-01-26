use bigdecimal::BigDecimal;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::types::{
    AccountId, Action, Balance, CryptoHash, FinalExecutionStatus, FunctionCallAction, NearGas,
    NearToken,
};
use serde::Deserialize;

use crate::{
    contexts::{
        accounts_context::AccountsContext,
        modal_context::ModalContext,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::decimal_to_balance,
};

use super::super::developer_create_token::process_image;

const MIN_TOTAL_SUPPLY: Balance = 1_000_000;
const MAX_ICON_SIZE_BYTES: usize = 100 * 1024;

#[derive(Clone, Debug)]
struct MemeCookingForm {
    duration_minutes: u32,
    soft_cap_near: String,
    hard_cap_near: String,
    x_link: String,
    telegram_link: String,
    website: String,
    team_allocation_enabled: bool,
    team_allocation_percent: String,
    team_cliff_days: String,
    team_vesting_days: String,
}

impl Default for MemeCookingForm {
    fn default() -> Self {
        Self {
            duration_minutes: 1440, // 24 hours
            soft_cap_near: "100".to_string(),
            hard_cap_near: "500".to_string(),
            x_link: String::new(),
            telegram_link: String::new(),
            website: String::new(),
            team_allocation_enabled: false,
            team_allocation_percent: "10".to_string(),
            team_cliff_days: "30".to_string(),
            team_vesting_days: "180".to_string(),
        }
    }
}

const DURATION_VALUES_LEN: usize = 15;
const DURATION_VALUES: [u32; DURATION_VALUES_LEN] = [
    5,
    15,
    30,
    60,
    2 * 60,
    3 * 60,
    6 * 60,
    12 * 60,
    24 * 60,
    2 * 24 * 60,
    3 * 24 * 60,
    4 * 24 * 60,
    5 * 24 * 60,
    6 * 24 * 60,
    7 * 24 * 60,
];

const DURATION_LABELS: [&str; DURATION_VALUES_LEN] = [
    "5 minutes",
    "15 minutes",
    "30 minutes",
    "1 hour",
    "2 hours",
    "3 hours",
    "6 hours",
    "12 hours",
    "1 day",
    "2 days",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "7 days",
];

fn minutes_to_slider_index(minutes: u32) -> usize {
    DURATION_VALUES
        .iter()
        .position(|&v| v == minutes)
        .unwrap_or(8) // Default to index 8 (1 day)
}

fn slider_index_to_minutes(index: usize) -> u32 {
    if index < DURATION_VALUES.len() {
        DURATION_VALUES[index]
    } else {
        1440 // Default to 1 day
    }
}

fn get_duration_label(minutes: u32) -> String {
    DURATION_VALUES
        .iter()
        .position(|&v| v == minutes)
        .and_then(|idx| DURATION_LABELS.get(idx))
        .map(|s| s.to_string())
        .unwrap_or_else(|| format!("{minutes} minutes"))
}

fn parse_near_amount(s: &str) -> Option<NearToken> {
    if let Ok(bd) = s.parse::<BigDecimal>() {
        let yoctonear = decimal_to_balance(bd, 24);
        Some(NearToken::from_yoctonear(yoctonear))
    } else {
        None
    }
}

const MIN_CAP: NearToken = NearToken::from_near(100);
const MAX_CAP: NearToken = NearToken::from_near(4000);

fn validate_soft_cap(soft_cap_str: &str) -> Option<String> {
    let soft_cap = parse_near_amount(soft_cap_str)?;

    if soft_cap < MIN_CAP || soft_cap > MAX_CAP {
        Some(format!("Soft Cap must be between {MIN_CAP} and {MAX_CAP}"))
    } else {
        None
    }
}

fn validate_hard_cap(hard_cap_str: &str, soft_cap_str: &str) -> Option<String> {
    let hard_cap = parse_near_amount(hard_cap_str)?;

    if hard_cap < MIN_CAP || hard_cap > MAX_CAP {
        return Some(format!("Hard Cap must be between {MIN_CAP} and {MAX_CAP}"));
    }

    if let Some(soft_cap) = parse_near_amount(soft_cap_str)
        && hard_cap < soft_cap
    {
        return Some("Hard Cap must be greater than or equal to Soft Cap".to_string());
    }

    None
}

fn validate_x_link(x_link: &str) -> Option<String> {
    if !x_link.is_empty() && !x_link.starts_with("https://x.com/") {
        Some("Must start with https://x.com/".to_string())
    } else {
        None
    }
}

fn validate_telegram_link(telegram_link: &str) -> Option<String> {
    if !telegram_link.is_empty() && !telegram_link.starts_with("https://t.me/") {
        Some("Must start with https://t.me/".to_string())
    } else {
        None
    }
}

fn validate_website(website: &str) -> Option<String> {
    if !website.is_empty() && !website.starts_with("https://") {
        Some("Must start with https://".to_string())
    } else {
        None
    }
}

fn validate_team_allocation_percent(percent_str: &str) -> Option<String> {
    match percent_str.parse::<u32>() {
        Ok(percent) if (1..=90).contains(&percent) => None,
        Ok(_) => Some("Allocation must be between 1% and 90%".to_string()),
        Err(_) => Some("Invalid number".to_string()),
    }
}

fn validate_team_cliff_days(days_str: &str) -> Option<String> {
    match days_str.parse::<u32>() {
        Ok(days) if (2..=1825).contains(&days) => None,
        Ok(_) => Some("Cliff must be between 2 and 1825 days".to_string()),
        Err(_) => Some("Invalid number".to_string()),
    }
}

fn validate_team_vesting_days(days_str: &str) -> Option<String> {
    match days_str.parse::<u32>() {
        Ok(days) if (5..=1825).contains(&days) => None,
        Ok(_) => Some("Vesting must be between 5 and 1825 days".to_string()),
        Err(_) => Some("Invalid number".to_string()),
    }
}

#[component]
pub fn MemeCookingModal<F>(
    token_symbol: String,
    token_name: String,
    token_supply: BigDecimal,
    token_decimals: u32,
    token_image: String,
    original_image_data_url: Option<String>,
    on_confirm: F,
) -> impl IntoView
where
    F: Fn() + 'static,
{
    let modal_context = expect_context::<ModalContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let transaction_queue_context = expect_context::<TransactionQueueContext>();
    let (form, set_form) = signal(MemeCookingForm::default());

    let token_symbol_clone = token_symbol.clone();
    let token_name_clone = token_name.clone();
    let token_supply_clone = token_supply.clone();
    let token_image_clone = token_image.clone();
    let original_image_clone = original_image_data_url.clone();

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let token_supply_clone_for_validation = token_supply.clone();
    let token_image_clone_for_validation = token_image.clone();

    let token_image_for_deposit = token_image.clone();
    let token_name_for_deposit = token_name.clone();
    let token_symbol_for_deposit = token_symbol.clone();
    let calculate_deposit = move || {
        let estimated_overhead_bytes = 15000;
        let image_base64_bytes = token_image_for_deposit.len();
        let estimated_size_bytes = image_base64_bytes
            + token_name_for_deposit.len()
            + token_symbol_for_deposit.len()
            + estimated_overhead_bytes;
        let size_bd = BigDecimal::from(estimated_size_bytes as u64);
        let divisor = BigDecimal::from(100_000u64);
        let size_near = size_bd / divisor;
        let size_yoctonear = decimal_to_balance(size_near, 24);
        NearToken::from_yoctonear(size_yoctonear)
    };
    let calculate_deposit_clone = calculate_deposit.clone();

    let is_valid = move || {
        let f = form.get();

        // Validate total supply
        let total_supply_balance =
            decimal_to_balance(token_supply_clone_for_validation.clone(), token_decimals);
        if total_supply_balance < MIN_TOTAL_SUPPLY {
            return false;
        }

        // Validate icon size
        if token_image_clone_for_validation.len() > MAX_ICON_SIZE_BYTES {
            return false;
        }

        if validate_soft_cap(&f.soft_cap_near).is_some() {
            return false;
        }

        if validate_hard_cap(&f.hard_cap_near, &f.soft_cap_near).is_some() {
            return false;
        }

        if validate_x_link(&f.x_link).is_some() {
            return false;
        }

        if validate_telegram_link(&f.telegram_link).is_some() {
            return false;
        }

        if validate_website(&f.website).is_some() {
            return false;
        }

        if f.team_allocation_enabled {
            if validate_team_allocation_percent(&f.team_allocation_percent).is_some() {
                return false;
            }

            if validate_team_cliff_days(&f.team_cliff_days).is_some() {
                return false;
            }

            if validate_team_vesting_days(&f.team_vesting_days).is_some() {
                return false;
            }
        }

        true
    };

    let handle_confirm = move || {
        let form_values = form.get();
        let token_symbol = token_symbol_clone.clone();
        let token_name = token_name_clone.clone();
        let token_supply = token_supply_clone.clone();
        let token_image = token_image_clone.clone();
        let original_image = original_image_clone.clone();
        let add_transaction = transaction_queue_context.add_transaction;
        let signer_id = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id;
        let calculate_deposit = calculate_deposit.clone();

        on_confirm();
        close_modal();

        spawn_local(async move {
            let Some(signer_id) = signer_id else {
                log::error!("No account selected");
                return;
            };

            let image_source = if let Some(orig) = original_image {
                orig
            } else {
                token_image.clone()
            };

            match process_image(image_source.clone(), 80).await {
                Ok(image_80_data_url) => {
                    if let Some(base64_data) = image_80_data_url.split(',').nth(1) {
                        match base64::Engine::decode(
                            &base64::engine::general_purpose::STANDARD,
                            base64_data,
                        ) {
                            Ok(image_bytes) => {
                                let reference = serde_json::json!({
                                    "description": "",
                                    "twitterLink": if form_values.x_link.is_empty() { "" } else { &form_values.x_link },
                                    "telegramLink": if form_values.telegram_link.is_empty() { "" } else { &form_values.telegram_link },
                                    "website": if form_values.website.is_empty() { "" } else { &form_values.website },
                                });
                                let reference_json = serde_json::to_vec(&reference).unwrap();

                                match upload_to_meme_cooking(image_bytes, reference_json).await {
                                    Ok(reference_cid) => {
                                        log::info!("Uploaded to meme.cooking: {reference_cid}");

                                        let soft_cap =
                                            parse_near_amount(&form_values.soft_cap_near).unwrap();
                                        let hard_cap =
                                            parse_near_amount(&form_values.hard_cap_near).unwrap();
                                        let duration_ms =
                                            form_values.duration_minutes as u64 * 60 * 1000;
                                        let total_supply_balance = decimal_to_balance(
                                            token_supply.clone(),
                                            token_decimals,
                                        );

                                        let team_allocation = if form_values.team_allocation_enabled
                                        {
                                            let allocation_basis_points = form_values
                                                .team_allocation_percent
                                                .parse::<u32>()
                                                .unwrap()
                                                * 100;
                                            let vesting_ms = form_values
                                                .team_vesting_days
                                                .parse::<u64>()
                                                .unwrap()
                                                * 24
                                                * 60
                                                * 60
                                                * 1000;
                                            let cliff_ms =
                                                form_values.team_cliff_days.parse::<u64>().unwrap()
                                                    * 24
                                                    * 60
                                                    * 60
                                                    * 1000;
                                            serde_json::json!([
                                                allocation_basis_points,
                                                vesting_ms,
                                                cliff_ms,
                                            ])
                                        } else {
                                            serde_json::json!(null)
                                        };

                                        let deposit = calculate_deposit();

                                        let args = serde_json::json!({
                                            "duration_ms": duration_ms.to_string(),
                                            "name": token_name,
                                            "symbol": token_symbol,
                                            "icon": token_image,
                                            "reference": reference_cid,
                                            "reference_hash": "",
                                            "deposit_token_id": "wrap.near",
                                            "soft_cap": soft_cap,
                                            "hard_cap": hard_cap,
                                            "team_allocation": team_allocation,
                                            "decimals": token_decimals,
                                            "reference_hash": "",
                                            "total_supply": total_supply_balance.to_string(),
                                        });

                                        let action =
                                            Action::FunctionCall(Box::new(FunctionCallAction {
                                                method_name: "create_meme".to_string(),
                                                args: serde_json::to_vec(&args).unwrap(),
                                                gas: NearGas::from_tgas(300).into(),
                                                deposit,
                                            }));

                                        let meme_cooking_account: AccountId =
                                            "meme-cooking.near".parse().unwrap();

                                        let (rx, transaction) = EnqueuedTransaction::create(
                                            format!("Launch {token_symbol} on Meme Cooking"),
                                            signer_id.clone(),
                                            meme_cooking_account,
                                            vec![action],
                                            false,
                                        );

                                        add_transaction.update(|txs| txs.push(transaction));

                                        match rx.await {
                                            Ok(Ok(tx_details)) => {
                                                if let Some(outcome) =
                                                    tx_details.final_execution_outcome
                                                {
                                                    let tx_hash =
                                                        outcome.final_outcome.transaction.hash;
                                                    match outcome.final_outcome.status {
                                                        FinalExecutionStatus::SuccessValue(_) => {
                                                            log::info!(
                                                                "Meme Cooking launch successful: {tx_hash}"
                                                            );
                                                            modal_context.modal.set(Some(Box::new(move || {
                                                                view! { <MemeCookingSuccessModal token_symbol=token_symbol.clone() /> }.into_any()
                                                            })));
                                                        }
                                                        FinalExecutionStatus::Failure(_) => {
                                                            log::error!(
                                                                "Meme Cooking launch failed: {tx_hash}"
                                                            );
                                                            modal_context.modal.set(Some(Box::new(move || {
                                                                view! { <MemeCookingErrorModal tx_hash=tx_hash /> }.into_any()
                                                            })));
                                                        }
                                                        _ => {
                                                            log::error!(
                                                                "Unexpected transaction status"
                                                            );
                                                        }
                                                    }
                                                }
                                            }
                                            Ok(Err(e)) => {
                                                log::error!("Transaction failed: {e}");
                                            }
                                            Err(_) => {
                                                log::error!("Transaction cancelled");
                                            }
                                        }
                                    }
                                    Err(e) => {
                                        log::error!("Failed to upload to meme.cooking: {e}");
                                    }
                                }
                            }
                            Err(e) => {
                                log::error!("Failed to decode base64 image: {e}");
                            }
                        }
                    }
                }
                Err(e) => {
                    log::error!("Failed to process 80% image: {e}");
                }
            }
        });
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
                    <h2 class="text-xl font-semibold">"Launch on Meme Cooking"</h2>
                    <button
                        on:click=move |_| close_modal()
                        class="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                    >
                        <Icon icon=icondata::LuX width="20" height="20" />
                    </button>
                </div>

                <div class="text-sm text-gray-400 mb-4">
                    "Fair launch platform. Best for flexible, professional launches."
                </div>

                <div class="flex flex-col gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    // Duration
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Duration: " <span class="text-red-400">"*"</span> " " <br />
                            {move || get_duration_label(form.get().duration_minutes)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="14"
                            step="1"
                            prop:value=move || {
                                minutes_to_slider_index(form.get().duration_minutes).to_string()
                            }
                            on:input=move |ev| {
                                let slider_index = event_target_value(&ev)
                                    .parse::<usize>()
                                    .unwrap_or(8);
                                let minutes = slider_index_to_minutes(slider_index);
                                set_form.update(|f| f.duration_minutes = minutes);
                            }
                            class="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            "Time for people to join the fair sale"
                        </div>
                    </div>

                    // Soft Cap
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Soft Cap (NEAR) " <span class="text-red-400">"*"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().soft_cap_near
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.soft_cap_near = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="100"
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            {move || {
                                let soft_cap_str = form.get().soft_cap_near;
                                if let Some(soft_cap) = parse_near_amount(&soft_cap_str) {
                                    format!(
                                        "The Soft Cap of {soft_cap} is the minimum required to launch once the duration is over. Otherwise, the launch is failed and everyone is refunded.",
                                    )
                                } else {
                                    "Enter a valid amount".to_string()
                                }
                            }}
                        </div>
                        {move || {
                            if let Some(error_msg) = validate_soft_cap(&form.get().soft_cap_near) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // Hard Cap
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Hard Cap (NEAR) " <span class="text-red-400">"*"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().hard_cap_near
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.hard_cap_near = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="500"
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            {move || {
                                let hard_cap_str = form.get().hard_cap_near;
                                if let Some(hard_cap) = parse_near_amount(&hard_cap_str) {
                                    format!(
                                        "If the Hard Cap of {hard_cap} is reached, it will trigger an immediate launch without waiting full duration.",
                                    )
                                } else {
                                    "Enter a valid amount".to_string()
                                }
                            }}
                        </div>
                        {move || {
                            let f = form.get();
                            if let Some(error_msg) = validate_hard_cap(
                                &f.hard_cap_near,
                                &f.soft_cap_near,
                            ) {
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
                            "X Link "
                            <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().x_link
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.x_link = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="https://x.com/..."
                        />
                        {move || {
                            if let Some(error_msg) = validate_x_link(&form.get().x_link) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // Telegram Link
                    <div>
                        <label class="flex text-sm font-medium mb-1 items-center gap-2">
                            <Icon icon=icondata::SiTelegram width="16" height="16" />
                            "Telegram Link "
                            <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().telegram_link
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.telegram_link = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="https://t.me/..."
                        />
                        {move || {
                            if let Some(error_msg) = validate_telegram_link(
                                &form.get().telegram_link,
                            ) {
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
                            placeholder="https://..."
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

                    // Team Allocation
                    <div class="border border-neutral-700 rounded p-4">
                        <label class="flex items-center gap-2 mb-2 cursor-pointer">
                            <input
                                type="checkbox"
                                prop:checked=move || form.get().team_allocation_enabled
                                on:change=move |ev| {
                                    let checked = event_target_checked(&ev);
                                    set_form.update(|f| f.team_allocation_enabled = checked);
                                }
                                class="w-4 h-4 cursor-pointer"
                            />
                            <span class="text-sm font-medium">"Enable Team Allocation"</span>
                        </label>

                        {move || {
                            if form.get().team_allocation_enabled {
                                view! {
                                    <div class="flex flex-col gap-3 mt-3">
                                        <div>
                                            <label class="block text-sm font-medium mb-1">
                                                "Allocation (%)"
                                            </label>
                                            <input
                                                type="text"
                                                prop:value=move || form.get().team_allocation_percent
                                                on:input=move |ev| {
                                                    let value = event_target_value(&ev);
                                                    set_form.update(|f| f.team_allocation_percent = value);
                                                }
                                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                placeholder="10"
                                            />
                                            <div class="text-xs text-gray-500 mt-1">
                                                "From 1% to 90%"
                                            </div>
                                            {move || {
                                                if let Some(error_msg) = validate_team_allocation_percent(
                                                    &form.get().team_allocation_percent,
                                                ) {
                                                    view! {
                                                        <div class="text-xs text-red-400 mt-1">{error_msg}</div>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }
                                            }}
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium mb-1">
                                                "Cliff (days)"
                                            </label>
                                            <input
                                                type="text"
                                                prop:value=move || form.get().team_cliff_days
                                                on:input=move |ev| {
                                                    let value = event_target_value(&ev);
                                                    set_form.update(|f| f.team_cliff_days = value);
                                                }
                                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                placeholder="30"
                                            />
                                            <div class="text-xs text-gray-500 mt-1">"Min: 2 days"</div>
                                            {move || {
                                                if let Some(error_msg) = validate_team_cliff_days(
                                                    &form.get().team_cliff_days,
                                                ) {
                                                    view! {
                                                        <div class="text-xs text-red-400 mt-1">{error_msg}</div>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }
                                            }}
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium mb-1">
                                                "Vesting Duration (days)"
                                            </label>
                                            <input
                                                type="text"
                                                prop:value=move || form.get().team_vesting_days
                                                on:input=move |ev| {
                                                    let value = event_target_value(&ev);
                                                    set_form.update(|f| f.team_vesting_days = value);
                                                }
                                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                placeholder="180"
                                            />
                                            <div class="text-xs text-gray-500 mt-1">"Min: 5 days"</div>
                                            {move || {
                                                if let Some(error_msg) = validate_team_vesting_days(
                                                    &form.get().team_vesting_days,
                                                ) {
                                                    view! {
                                                        <div class="text-xs text-red-400 mt-1">{error_msg}</div>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }
                                            }}
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
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
                            {move || {
                                let total_supply_balance = decimal_to_balance(
                                    token_supply.clone(),
                                    token_decimals,
                                );
                                if total_supply_balance < MIN_TOTAL_SUPPLY {
                                    view! {
                                        <div class="flex gap-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-300">
                                            <div class="flex-shrink-0 mt-0.5">
                                                <Icon
                                                    icon=icondata::LuTriangleAlert
                                                    width="16"
                                                    height="16"
                                                />
                                            </div>
                                            <span>
                                                "Total supply or decimals is too low for meme.cooking."
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                            {move || {
                                if token_image.len() > MAX_ICON_SIZE_BYTES {
                                    view! {
                                        <div class="flex gap-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-300">
                                            <div class="flex-shrink-0 mt-0.5">
                                                <Icon
                                                    icon=icondata::LuTriangleAlert
                                                    width="16"
                                                    height="16"
                                                />
                                            </div>
                                            <span>
                                                "Icon is too large. Please decrease image quality. It will not affect the image displayed on meme.cooking."
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>
                    </div>

                    // Buttons
                    <div class="flex gap-2 mt-4">
                        <button
                            on:click=move |_| handle_confirm()
                            disabled=move || !is_valid()
                            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded cursor-pointer"
                        >
                            {move || format!("Confirm ({})", calculate_deposit_clone())}
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
fn MemeCookingSuccessModal(token_symbol: String) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();

    let close_modal = move || {
        modal_context.modal.set(None);
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
                    <div class="w-16 h-16 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center text-green-400">
                        <Icon icon=icondata::LuCheck width="32" height="32" />
                    </div>
                    <h2 class="text-xl font-semibold">"Token Launched Successfully!"</h2>
                    <p class="text-center text-gray-400">
                        "Your token " <span class="font-semibold text-white">{token_symbol}</span>
                        " has been launched on Meme Cooking."
                    </p>
                    <a
                        href="https://meme.cooking"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center cursor-pointer"
                    >
                        "View on Meme Cooking"
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
fn MemeCookingErrorModal(tx_hash: CryptoHash) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let nearblocks_url = format!("https://nearblocks.io/txns/{tx_hash}");

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
                    <p class="text-center text-gray-400">
                        "There was an error launching your token on Meme Cooking."
                    </p>
                    <a
                        href=nearblocks_url
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center cursor-pointer"
                    >
                        "View Transaction Details"
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

async fn upload_to_meme_cooking(
    image_bytes: Vec<u8>,
    reference_json: Vec<u8>,
) -> Result<String, String> {
    #[derive(serde::Serialize)]
    struct UploadRequest {
        image: String,
        reference: String,
    }

    let image_base64 =
        base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &image_bytes);
    let reference_base64 =
        base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &reference_json);

    let request_body = UploadRequest {
        image: image_base64,
        reference: reference_base64,
    };

    let nft_proxy_service = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
    let response = reqwest::Client::new()
        .post(format!("{nft_proxy_service}/meme-cooking-create"))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    #[derive(Debug, Deserialize)]
    struct CreateResponse {
        #[serde(rename = "referenceCID")]
        reference_cid: String,
    }

    let value = response
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::from_value::<CreateResponse>(value)
        .map_err(|e| e.to_string())?
        .reference_cid)
}
