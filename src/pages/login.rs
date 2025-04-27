use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::{use_location, use_navigate};
use near_min_api::types::{
    near_crypto::PublicKey, AccessKey, AccessKeyPermission, Action, AddKeyAction,
};

use crate::{
    components::DangerConfirmInput,
    contexts::{
        accounts_context::AccountsContext,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
};

#[component]
pub fn Login() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let navigate = use_navigate();
    let (is_confirmed, set_is_confirmed) = signal(false);
    let (is_loading, set_is_loading) = signal(false);
    let (error, set_error) = signal::<Option<String>>(None);

    let public_key = Memo::new(move |_| {
        let params = use_location().query.get();
        if let Some(public_key) = params.get("public_key") {
            public_key.parse::<PublicKey>().ok()
        } else {
            None
        }
    });

    let navigate_clone = navigate.clone();

    view! {
        <div class="flex flex-col items-center justify-center min-h-[calc(80vh-100px)] p-4">
            <div class="flex flex-col items-center gap-6 max-w-md w-full">
                <h2 class="text-2xl font-bold text-white mb-2 wrap-anywhere">
                    Add Full Access Key
                </h2>
                <div class="flex flex-col gap-4 w-full">
                    <div class="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 shadow-lg">
                        {move || {
                            let account_id = accounts_context
                                .accounts
                                .get()
                                .selected_account_id
                                .map(|id| id.to_string())
                                .unwrap_or_else(|| "No account selected".to_string());
                            let public_key = public_key
                                .get()
                                .map(|pk| pk.to_string())
                                .unwrap_or_else(|| "Invalid public key".to_string());

                            view! {
                                <div class="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-700/50">
                                    <div class="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                        <span class="text-neutral-300 text-lg">{"🔑"}</span>
                                    </div>
                                    <div>
                                        <p class="text-neutral-400 text-sm">Account</p>
                                        <p class="text-white font-medium wrap-anywhere">
                                            {account_id}
                                        </p>
                                        <p class="text-neutral-400 text-sm mt-2">Public Key</p>
                                        <p class="text-white font-medium wrap-anywhere">
                                            {public_key}
                                        </p>
                                    </div>
                                </div>
                            }
                        }}
                        <DangerConfirmInput
                            set_is_confirmed=set_is_confirmed
                            warning_title="⚠️ Dangerous Operation"
                            warning_message="You are about to give FULL ACCESS to your account. This means the owner of this key will have complete control over your account, including the ability to transfer all funds and delete your account. This should ONLY be done if you're a developer."
                        />
                        {move || {
                            if let Some(error) = error.get() {
                                view! {
                                    <div class="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <div class="flex items-center gap-2 text-red-400">
                                            <Icon
                                                icon=icondata::LuAlertTriangle
                                                width="20"
                                                height="20"
                                            />
                                            <p class="text-white font-medium">{error}</p>
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            } else {
                                view! { <div class="mt-4"></div> }.into_any()
                            }
                        }} <div class="flex gap-2 mt-4">
                            <button
                                class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                                style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)"
                                prop:disabled=move || !is_confirmed.get() || is_loading.get()
                                on:click=move |_| {
                                    let Some(public_key) = public_key.get() else {
                                        set_error.set(Some("Invalid public key".to_string()));
                                        return;
                                    };
                                    let Some(account_id) = accounts_context
                                        .accounts
                                        .get()
                                        .selected_account_id else {
                                        set_error.set(Some("No account selected".to_string()));
                                        return;
                                    };
                                    set_is_loading.set(true);
                                    set_error.set(None);
                                    let action = Action::AddKey(
                                        Box::new(AddKeyAction {
                                            public_key,
                                            access_key: AccessKey {
                                                nonce: 0,
                                                permission: AccessKeyPermission::FullAccess,
                                            },
                                        }),
                                    );
                                    let (details_rx, transaction) = EnqueuedTransaction::create(
                                        "Add Full Access Key".to_string(),
                                        account_id.clone(),
                                        account_id.clone(),
                                        vec![action],
                                    );
                                    add_transaction.update(|queue| queue.push(transaction));
                                    let navigate_clone = navigate_clone.clone();
                                    spawn_local(async move {
                                        match details_rx.await {
                                            Ok(_) => {
                                                navigate_clone("/", Default::default());
                                            }
                                            Err(e) => {
                                                set_error
                                                    .set(Some(format!("Failed to add access key: {}", e)));
                                                set_is_loading.set(false);
                                            }
                                        }
                                    });
                                }
                            >
                                <div
                                    class="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                    style="background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)"
                                ></div>
                                <span class="relative flex items-center justify-center gap-2">
                                    {move || {
                                        if is_loading.get() {
                                            view! {
                                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}Add Full Access Key
                                </span>
                            </button>
                            <button
                                class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                prop:disabled=move || is_loading.get()
                                on:click=move |_| navigate("/", Default::default())
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
