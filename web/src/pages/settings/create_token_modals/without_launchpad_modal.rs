use bigdecimal::BigDecimal;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::components::A;
use near_min_api::{
    QueryFinality,
    types::{
        AccessKey, AccountContract, AccountId, Action, CreateAccountAction, CryptoHash,
        FinalExecutionStatus, Finality, FunctionCallAction, GlobalContractIdentifier, NearGas,
        NearToken, StateRecord, TransferAction, UseGlobalContractAction,
        near_crypto::{KeyType, SecretKey},
    },
};

use crate::{
    contexts::{
        account_selector_context::AccountSelectorContext,
        accounts_context::AccountsContext,
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::{decimal_to_balance, format_account_id},
};

#[derive(Clone, Debug)]
struct WithoutLaunchpadForm {
    contract_address: String,
    mint_tokens_to: String,
}

#[derive(Clone, Debug, PartialEq)]
enum AccountCheckState {
    NotChecked,
    Checking,
    IsParent,
    Exists,
    DoesNotExist,
}

#[component]
pub fn WithoutLaunchpadModal<F>(
    token_symbol: String,
    token_name: String,
    token_supply: BigDecimal,
    token_decimals: u32,
    token_image: String,
    on_confirm: F,
) -> impl IntoView
where
    F: Fn() + 'static,
{
    let modal_context = expect_context::<ModalContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let AccountSelectorContext { set_expanded, .. } = expect_context::<AccountSelectorContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let network_context = expect_context::<NetworkContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    let selected_account = move || accounts_context.accounts.get().selected_account_id;

    let token_image_for_deposit = token_image.clone();
    let token_name_for_deposit = token_name.clone();
    let token_symbol_for_deposit = token_symbol.clone();
    let calculate_deposit = move || {
        let estimated_overhead_bytes = 400;
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

    let (account_check_state, set_account_check_state) = signal(AccountCheckState::NotChecked);

    let token_symbol_for_default = token_symbol.clone();
    let token_symbol_for_effect = token_symbol.clone();

    let initial_account = accounts_context
        .accounts
        .get_untracked()
        .selected_account_id;
    let initial_contract = if let Some(ref account) = initial_account {
        format!(
            "{}.{}",
            token_symbol_for_default.to_lowercase(),
            account.as_str()
        )
    } else {
        "token.account.near".to_string()
    };
    let initial_mint_to = initial_account
        .as_ref()
        .map(|a| a.to_string())
        .unwrap_or_default();

    let (form, set_form) = signal(WithoutLaunchpadForm {
        contract_address: initial_contract,
        mint_tokens_to: initial_mint_to,
    });

    // Update form when account changes
    Effect::new(move || {
        if let Some(account) = selected_account() {
            let contract = format!(
                "{}.{}",
                token_symbol_for_effect.to_lowercase(),
                account.as_str()
            );
            let mint_to = account.to_string();
            set_form.update(|f| {
                f.contract_address = contract;
                f.mint_tokens_to = mint_to;
            });
        }
    });

    // Check if contract address already exists on-chain (for subaccounts only)
    Effect::new(move || {
        let contract_address = form.get().contract_address;

        set_account_check_state.set(AccountCheckState::Checking);

        if contract_address.is_empty() {
            set_account_check_state.set(AccountCheckState::NotChecked);
            return;
        }

        let Ok(contract_id) = contract_address.parse::<AccountId>() else {
            set_account_check_state.set(AccountCheckState::NotChecked);
            return;
        };

        let Some(parent) = selected_account() else {
            set_account_check_state.set(AccountCheckState::NotChecked);
            return;
        };

        let is_subaccount = contract_id.is_sub_account_of(&parent);
        if !is_subaccount {
            set_account_check_state.set(AccountCheckState::IsParent);
            return;
        }

        let rpc_client = client.get();

        spawn_local(async move {
            let account_exists_result = rpc_client
                .view_account(
                    contract_id.clone(),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
                .await
                .is_ok();

            if account_exists_result {
                set_account_check_state.set(AccountCheckState::Exists);
            } else {
                set_account_check_state.set(AccountCheckState::DoesNotExist);
            }
        });
    });

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let is_valid = move || {
        let f = form.get();

        let contract_valid = if let (Ok(contract_id), Some(parent)) =
            (f.contract_address.parse::<AccountId>(), selected_account())
        {
            contract_id.is_sub_account_of(&parent) || contract_id == parent
        } else {
            false
        };

        let mint_to_valid = f.mint_tokens_to.parse::<AccountId>().is_ok();

        let check_state = account_check_state.get();
        let account_check_ok = match check_state {
            AccountCheckState::DoesNotExist => true,
            AccountCheckState::NotChecked => false,
            AccountCheckState::IsParent => true,
            AccountCheckState::Exists => false,
            AccountCheckState::Checking => false,
        };

        contract_valid && mint_to_valid && account_check_ok
    };

    let token_symbol_clone = token_symbol.clone();
    let token_name_clone = token_name.clone();
    let token_supply_clone = token_supply.clone();
    let token_image_clone = token_image.clone();

    let handle_confirm = move || {
        let f = form.get();

        log::info!("=== Launch Without Launchpad ===");
        log::info!("Token Symbol: {token_symbol_clone}");
        log::info!("Token Name: {token_name_clone}");
        log::info!("Token Supply: {token_supply_clone}");
        log::info!("Token Decimals: {token_decimals}");
        log::info!("Token Image: {:?}", token_image_clone);
        log::info!("Contract Address: {}", f.contract_address);
        log::info!("Mint Tokens To: {}", f.mint_tokens_to);

        let Ok(contract_id) = f.contract_address.parse::<AccountId>() else {
            return;
        };
        let Some(selected_account) = selected_account() else {
            return;
        };
        let rpc_client = client.get();

        let token_symbol_clone = token_symbol_clone.clone();
        let token_name_clone = token_name_clone.clone();
        let token_image_clone = token_image_clone.clone();
        let Ok(mint_tokens_to) = f.mint_tokens_to.parse::<AccountId>() else {
            return;
        };
        let total_supply = decimal_to_balance(token_supply_clone.clone(), token_decimals);
        let deposit = calculate_deposit();
        spawn_local(async move {
            let mut actions = vec![];
            if contract_id.is_sub_account_of(&selected_account) {
                actions.push(Action::CreateAccount(CreateAccountAction {}));
                actions.push(Action::Transfer(TransferAction { deposit }));
            }

            match network_context.network.get() {
                Network::Mainnet => {
                    actions.push(Action::UseGlobalContract(Box::new(
                        UseGlobalContractAction {
                            contract_identifier: GlobalContractIdentifier::CodeHash(
                                "8D1NEU2NC2hKhdtCkHyyAz2KVmVXRazm9ZQMC27D97jF"
                                    .parse()
                                    .unwrap(),
                            ),
                        },
                    )));
                }
                Network::Testnet => {
                    actions.push(Action::UseGlobalContract(Box::new(
                        UseGlobalContractAction {
                            contract_identifier: GlobalContractIdentifier::CodeHash(
                                "8D1NEU2NC2hKhdtCkHyyAz2KVmVXRazm9ZQMC27D97jF"
                                    .parse()
                                    .unwrap(),
                            ),
                        },
                    )));
                }
                Network::Localnet(_) => {
                    let token_code = Network::Testnet
                        .default_rpc_client()
                        .view_code(
                            "test.ssedfsdf.testnet".parse().unwrap(),
                            QueryFinality::Finality(Finality::None),
                        )
                        .await
                        .unwrap()
                        .code;
                    let secret_key = SecretKey::from_random(KeyType::ED25519);
                    let records = vec![
                        StateRecord::Account {
                            account_id: contract_id.clone(),
                            account: near_min_api::types::Account::new(
                                NearToken::from_near(1000),
                                NearToken::from_near(0),
                                AccountContract::Local(CryptoHash::hash_bytes(&token_code)),
                                0,
                            ),
                        },
                        StateRecord::Contract {
                            account_id: contract_id.clone(),
                            code: token_code,
                        },
                        StateRecord::AccessKey {
                            account_id: contract_id.clone(),
                            public_key: secret_key.public_key(),
                            access_key: AccessKey::full_access(),
                        },
                    ];
                    match rpc_client.sandbox_patch_state(records).await {
                        Ok(()) => {
                            let actions =
                                vec![Action::FunctionCall(Box::new(FunctionCallAction {
                                    method_name: "new".to_string(),
                                    args: serde_json::to_vec(&serde_json::json!({
                                        "owner_id": mint_tokens_to,
                                        "total_supply": total_supply.to_string(),
                                        "metadata": {
                                            "spec": "ft-1.0.0",
                                            "name": token_name_clone,
                                            "symbol": token_symbol_clone,
                                            "icon": token_image_clone,
                                            "reference": null,
                                            "reference_hash": null,
                                            "decimals": token_decimals,
                                        }
                                    }))
                                    .unwrap(),
                                    gas: NearGas::from_tgas(300).into(),
                                    deposit: NearToken::from_yoctonear(0),
                                }))];
                            let (rx, transaction) = EnqueuedTransaction::create(
                                format!("Deploy {token_symbol_clone} contract"),
                                selected_account.clone(),
                                contract_id.clone(),
                                actions,
                            );
                            add_transaction.update(|txs| txs.push(transaction));
                            match rx.await {
                                Ok(Ok(tx_details)) => {
                                    if let Some(outcome) = tx_details.final_execution_outcome {
                                        let tx_hash = outcome.final_outcome.transaction.hash;
                                        match outcome.final_outcome.status {
                                            FinalExecutionStatus::SuccessValue(_) => {
                                                log::info!(
                                                    "Token contract deployed successfully: {tx_hash}"
                                                );
                                                modal_context.modal.set(Some(Box::new(
                                                    move || {
                                                        view! {
                                                            <WithoutLaunchpadSuccessModal
                                                                token_symbol=token_symbol_clone.clone()
                                                                contract_id=contract_id.clone()
                                                            />
                                                        }.into_any()
                                                    },
                                                )));
                                                return;
                                            }
                                            FinalExecutionStatus::Failure(_) => {
                                                log::error!(
                                                    "Token contract deployment failed: {tx_hash}"
                                                );
                                                modal_context.modal.set(Some(Box::new(move || {
                                                    view! { <WithoutLaunchpadErrorModal tx_hash=tx_hash /> }.into_any()
                                                })));
                                                return;
                                            }
                                            _ => {
                                                log::error!("Unexpected transaction status");
                                                return;
                                            }
                                        }
                                    }
                                }
                                Ok(Err(e)) => {
                                    log::error!("Transaction failed: {e}");
                                    return;
                                }
                                Err(_) => {
                                    log::error!("Transaction cancelled");
                                    return;
                                }
                            }
                        }
                        Err(e) => {
                            log::error!("Failed to deploy token contract: {e}");
                            return;
                        }
                    }
                }
            }

            actions.push(Action::FunctionCall(Box::new(FunctionCallAction {
                method_name: "new".to_string(),
                args: serde_json::to_vec(&serde_json::json!({
                    "owner_id": mint_tokens_to,
                    "total_supply": total_supply.to_string(),
                    "metadata": {
                        "spec": "ft-1.0.0",
                        "name": token_name_clone,
                        "symbol": token_symbol_clone,
                        "icon": token_image_clone,
                        "reference": null,
                        "reference_hash": null,
                        "decimals": token_decimals,
                    }
                }))
                .unwrap(),
                gas: NearGas::from_tgas(300).into(),
                deposit: NearToken::from_yoctonear(0),
            })));

            let (rx, transaction) = EnqueuedTransaction::create(
                format!("Deploy {token_symbol_clone} contract"),
                selected_account.clone(),
                contract_id.clone(),
                actions,
            );
            add_transaction.update(|txs| txs.push(transaction));
            match rx.await {
                Ok(Ok(tx_details)) => {
                    if let Some(outcome) = tx_details.final_execution_outcome {
                        let tx_hash = outcome.final_outcome.transaction.hash;
                        match outcome.final_outcome.status {
                            FinalExecutionStatus::SuccessValue(_) => {
                                log::info!("Token contract deployed successfully: {tx_hash}");
                                modal_context.modal.set(Some(Box::new(move || {
                                    view! {
                                        <WithoutLaunchpadSuccessModal
                                            token_symbol=token_symbol_clone.clone()
                                            contract_id=contract_id.clone()
                                        />
                                    }
                                    .into_any()
                                })));
                            }
                            FinalExecutionStatus::Failure(_) => {
                                log::error!("Token contract deployment failed: {tx_hash}");
                                modal_context.modal.set(Some(Box::new(move || {
                                    view! { <WithoutLaunchpadErrorModal tx_hash=tx_hash /> }
                                        .into_any()
                                })));
                            }
                            _ => {
                                log::error!("Unexpected transaction status");
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
        });

        on_confirm();
        close_modal();
    };

    let default_contract = move || {
        if let Some(account) = selected_account() {
            if let Ok(account_id) = format!(
                "{}.{}",
                token_symbol_for_default.to_lowercase(),
                account.as_str()
            )
            .parse::<AccountId>()
            {
                account_id.to_string()
            } else {
                format!("token.{account}")
            }
        } else {
            "token.account.near".to_string()
        }
    };

    let default_mint_to = move || {
        selected_account()
            .map(|a| a.to_string())
            .unwrap_or_default()
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
                    <h2 class="text-xl font-semibold">"Launch Without Launchpad"</h2>
                    <button
                        on:click=move |_| close_modal()
                        class="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                    >
                        <Icon icon=icondata::LuX width="20" height="20" />
                    </button>
                </div>

                <div class="text-sm text-gray-400 mb-4">"Launch a custom token contract"</div>

                <div class="flex flex-col gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    // Contract Address
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Contract Address " <span class="text-red-400">"*"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().contract_address
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.contract_address = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder=default_contract
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            {move || {
                                if let Some(account) = selected_account() {
                                    format!(
                                        "Can be a subaccount of {account} (e.g., token.{account}) or {account} itself",
                                    )
                                } else {
                                    "Select an account first".to_string()
                                }
                            }}
                        </div>
                        {move || {
                            let f = form.get();
                            let contract_str = f.contract_address;
                            if !contract_str.is_empty() {
                                if let Ok(contract_id) = contract_str.parse::<AccountId>() {
                                    if let Some(parent) = selected_account() {
                                        let is_self: bool = AsRef::<str>::as_ref(&contract_id)
                                            == AsRef::<str>::as_ref(&parent);
                                        let is_subaccount = contract_id.is_sub_account_of(&parent);
                                        if is_self {
                                            view! {
                                                <div class="text-xs text-yellow-400 bg-yellow-950 p-2 rounded border border-yellow-700 mt-1">
                                                    "⚠️ This will deploy the contract on your current account. We recommend using a subaccount unless you know what you are doing."
                                                </div>
                                            }
                                                .into_any()
                                        } else if !is_subaccount {
                                            view! {
                                                <div class="text-xs text-red-400 mt-1">
                                                    "Must be a subaccount (e.g., token." {parent.to_string()}
                                                    ") or " {parent.to_string()} " itself"
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    } else {
                                        ().into_any()
                                    }
                                } else {
                                    view! {
                                        <div class="text-xs text-red-400 mt-1">
                                            "Invalid account ID format"
                                        </div>
                                    }
                                        .into_any()
                                }
                            } else {
                                ().into_any()
                            }
                        }}
                        {move || {
                            match account_check_state.get() {
                                AccountCheckState::Exists => {
                                    view! {
                                        <div class="text-xs text-red-400 bg-red-950 p-2 rounded border border-red-700 mt-1">
                                            "❌ This subaccount already exists. Maybe you have already created it?"
                                        </div>
                                    }
                                        .into_any()
                                }
                                _ => ().into_any(),
                            }
                        }}
                    </div>

                    // Account Selector
                    <div>
                        <label class="block text-sm font-medium mb-1">"Deploy As"</label>
                        {move || {
                            if let Some(selected_account_id) = selected_account() {
                                view! {
                                    <button
                                        class="cursor-pointer w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded hover:bg-neutral-600 transition-all duration-200 flex items-center justify-between gap-3"
                                        on:click=move |_| set_expanded(true)
                                    >
                                        <div class="flex items-center gap-3 flex-1 min-w-0">
                                            <div class="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                                <Icon
                                                    icon=icondata::LuUser
                                                    width="16"
                                                    height="16"
                                                    attr:class="text-blue-400"
                                                />
                                            </div>
                                            <div class="flex flex-col items-start min-w-0 flex-1">
                                                <span class="text-neutral-400 text-xs">
                                                    "Selected Account"
                                                </span>
                                                <div class="text-white text-sm font-medium wrap-anywhere">
                                                    {format_account_id(&selected_account_id)}
                                                </div>
                                            </div>
                                        </div>
                                        <Icon
                                            icon=icondata::LuChevronDown
                                            width="16"
                                            height="16"
                                            attr:class="text-neutral-400"
                                        />
                                    </button>
                                }
                                    .into_any()
                            } else {
                                view! {
                                    <div class="text-sm text-red-400">"No account selected"</div>
                                }
                                    .into_any()
                            }
                        }}
                        <div class="text-xs text-gray-500 mt-1">
                            "The account that will deploy the token contract"
                        </div>
                    </div>

                    // Mint Tokens To
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Mint Tokens To " <span class="text-red-400">"*"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || form.get().mint_tokens_to
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_form.update(|f| f.mint_tokens_to = value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder=default_mint_to
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            "Account that will receive the entire supply of tokens"
                        </div>
                        {move || {
                            let f = form.get();
                            let mint_to_str = f.mint_tokens_to;
                            if !mint_to_str.is_empty() && mint_to_str.parse::<AccountId>().is_err()
                            {
                                view! {
                                    <div class="text-xs text-red-400 mt-1">
                                        "Invalid account ID format"
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
fn WithoutLaunchpadSuccessModal(token_symbol: String, contract_id: AccountId) -> impl IntoView {
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
                    <h2 class="text-xl font-semibold">"Token Deployed Successfully!"</h2>
                    <p class="text-center text-gray-400">
                        "Your token " <span class="font-semibold text-white">{token_symbol}</span>
                        " has been deployed to "
                        <span class="font-mono text-white">{contract_id.to_string()}</span>
                    </p>
                    <A
                        href=format!("/token/{contract_id}")
                        attr:class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center cursor-pointer"
                    >
                        "View"
                    </A>
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
fn WithoutLaunchpadErrorModal(tx_hash: CryptoHash) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();
    let network_context = expect_context::<NetworkContext>();

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let nearblocks_url = move || match network_context.network.get() {
        Network::Mainnet => Some(format!("https://nearblocks.io/txns/{tx_hash}")),
        Network::Testnet => Some(format!("https://testnet.nearblocks.io/txns/{tx_hash}")),
        Network::Localnet(_) => None,
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
                    <h2 class="text-xl font-semibold">"Deployment Failed"</h2>
                    <p class="text-center text-gray-400">
                        "There was an error deploying your token contract."
                    </p>
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
