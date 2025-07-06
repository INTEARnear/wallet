use crate::contexts::accounts_context::{AccountsContext, LedgerSigningState};
use crate::contexts::transaction_queue_context::{
    OverlayMode, TransactionQueueContext, TransactionStage,
};
use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn TransactionQueueOverlay() -> impl IntoView {
    let TransactionQueueContext {
        queue,
        current_index,
        overlay_mode,
        signing_tx_id,
        ..
    } = expect_context::<TransactionQueueContext>();
    let AccountsContext {
        ledger_signing_state,
        ..
    } = expect_context::<AccountsContext>();

    Effect::new(move |_| {
        let queue_len = queue.read().len();
        if queue_len == 0 {
            overlay_mode.set(OverlayMode::Modal);
        }
    });

    let progress = move || {
        let queue_len = queue.read().len();
        if queue_len == 0 {
            0.0
        } else {
            let stage_progress_sum = queue
                .read()
                .iter()
                .take(current_index.get() + 1)
                .map(|tx| match &tx.stage {
                    TransactionStage::Preparing => 0,
                    TransactionStage::Publishing => 25,
                    TransactionStage::Included => 70,
                    TransactionStage::Doomslug => 90,
                    TransactionStage::Finalized => 100,
                    TransactionStage::Failed(_) => 0,
                })
                .sum::<u32>();
            (stage_progress_sum / queue_len as u32) as f64
        }
    };

    let modal_icon = move |stage: &TransactionStage| {
        let stage_cloned = stage.clone();
        let spinner_class = move || match stage_cloned {
            TransactionStage::Preparing => "border-neutral-500",
            TransactionStage::Publishing => "border-yellow-500",
            TransactionStage::Included => "border-cyan-500",
            TransactionStage::Doomslug => "border-green-500",
            TransactionStage::Finalized => "border-green-500",
            TransactionStage::Failed(_) => "border-red-500",
        };

        view! {
            <div class="flex items-center gap-2">
                {match stage {
                    TransactionStage::Finalized => {
                        view! {
                            <Icon icon=icondata::LuCircleCheckBig attr:class="text-green-500" />
                        }
                            .into_any()
                    }
                    TransactionStage::Doomslug => {
                        view! {
                            <Icon icon=icondata::LuCircleCheckBig attr:class="text-green-300" />
                        }
                            .into_any()
                    }
                    TransactionStage::Preparing => {
                        view! { <Icon icon=icondata::LuClock attr:class="text-neutral-500" /> }
                            .into_any()
                    }
                    TransactionStage::Failed(_) => {
                        view! { <Icon icon=icondata::LuCircleX attr:class="text-red-500" /> }
                            .into_any()
                    }
                    TransactionStage::Publishing | TransactionStage::Included => {
                        view! {
                            <div class=move || {
                                format!(
                                    "animate-spin rounded-full h-4 w-4 border-b-2 transition-colors duration-150 {}",
                                    spinner_class(),
                                )
                            } />
                        }
                            .into_any()
                    }
                }}
            </div>
        }
            .into_any()
    };

    view! {
        <Show
            when=move || {
                overlay_mode.get() == OverlayMode::Background && !queue.read().is_empty()
            }
            attr:class="relative top-0 pt-2 w-full lg:rounded-t-3xl bg-neutral-900/90 text-white text-sm font-medium transition-all duration-200 cursor-pointer"
            on:click=move |_| overlay_mode.set(OverlayMode::Modal)
        >
            <div class="w-full pt-2">
                <div class="flex items-center justify-between gap-2 px-4">
                    <div class="flex items-center gap-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white transition-colors duration-150" />
                        <span>
                            {move || {
                                format!(
                                    "Transaction{}",
                                    if queue.read().len() > 1 {
                                        format!(
                                            " {}/{}",
                                            (current_index.get() + 1).min(queue.read().len()),
                                            queue.read().len(),
                                        )
                                    } else {
                                        "".to_string()
                                    },
                                )
                            }}
                        </span>
                    </div>
                    <div class="p-1">
                        <Icon icon=icondata::LuChevronDown width="20" height="20" />
                    </div>
                </div>
                <div class="h-0.5 bg-neutral-700 mt-2 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-green-500 transition-all duration-200"
                        style=move || format!("width: {}%", progress())
                    />
                </div>
            </div>
        </Show>

        <Show
            when=move || overlay_mode.get() == OverlayMode::Modal && !queue.read().is_empty()
            attr:class="fixed inset-0 bg-black/50 transition-opacity duration-200 z-100 text-white"
            on:click=move |_| overlay_mode.set(OverlayMode::Background)
        >
            <div>
                <div
                    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] lg:w-[500px] bg-neutral-900 rounded-xl p-4 shadow-xl"
                    on:click=|ev| ev.stop_propagation()
                >
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-medium">Transaction Queue</h2>
                        <div class="flex items-center gap-2">
                            <button
                                on:mouseup=move |_| overlay_mode.set(OverlayMode::Background)
                                on:touchend=move |_| overlay_mode.set(OverlayMode::Background)
                                class="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <Icon icon=icondata::LuChevronUp width="20" height="20" />
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-[60vh] overflow-y-auto">
                        {move || {
                            queue
                                .read()
                                .iter()
                                .map(|tx| {
                                    let tx_id = tx.id;
                                    view! {
                                        <div class="flex flex-col p-2 bg-neutral-800/50 rounded-lg">
                                            <div class="flex items-center justify-between">
                                                <span class="text-sm">{tx.description.clone()}</span>
                                                {modal_icon(&tx.stage)}
                                            </div>
                                            {match &tx.stage {
                                                TransactionStage::Failed(error) => {
                                                    view! {
                                                        <span class="text-sm text-red-400 mt-1">
                                                            {error.clone()}
                                                        </span>
                                                    }
                                                        .into_any()
                                                }
                                                _ => ().into_any(),
                                            }}
                                            <Show when=move || {
                                                signing_tx_id.get() == Some(tx_id)
                                            }>
                                                {move || {
                                                    match ledger_signing_state.get() {
                                                        LedgerSigningState::Idle => ().into_any(),
                                                        LedgerSigningState::WaitingForSignature { .. } => {
                                                            view! {
                                                                <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                                    <Icon icon=icondata::LuUsb width="24" height="24" />
                                                                    <p class="text-sm font-bold">"Waiting for Ledger"</p>
                                                                    <p class="text-xs">
                                                                        "Please confirm the transaction on your Ledger device."
                                                                    </p>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }
                                                        LedgerSigningState::Error { id, error } => {
                                                            view! {
                                                                <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                                    <Icon
                                                                        icon=icondata::LuTriangleAlert
                                                                        width="24"
                                                                        height="24"
                                                                        attr:class="text-red-500"
                                                                    />
                                                                    <p class="text-sm font-bold">"Ledger Error"</p>
                                                                    <p class="text-xs max-w-xs break-words">{error.clone()}</p>
                                                                    <div class="flex gap-4 mt-2">
                                                                        <button
                                                                            class="px-3 py-1 text-xs bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors cursor-pointer"
                                                                            on:click=move |_| {
                                                                                ledger_signing_state
                                                                                    .set(LedgerSigningState::WaitingForSignature {
                                                                                        id,
                                                                                    })
                                                                            }
                                                                        >
                                                                            "Retry"
                                                                        </button>
                                                                        <button
                                                                            class="px-3 py-1 text-xs bg-red-800 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                                                                            on:click=move |_| {
                                                                                ledger_signing_state.set(LedgerSigningState::Idle)
                                                                            }
                                                                        >
                                                                            "Cancel"
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }
                                                    }
                                                }}
                                            </Show>
                                        </div>
                                    }
                                })
                                .collect_view()
                        }}
                    </div>
                </div>
            </div>
        </Show>
    }
}
