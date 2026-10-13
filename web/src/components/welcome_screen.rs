use leptos::prelude::*;
use leptos_icons::*;

use crate::components::account_selector::{
    AccountCreateParent, AccountCreateRecoveryMethod, ModalState,
};
use crate::contexts::account_selector_context::AccountSelectorContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::translations::TranslationKey;

#[component]
pub fn WelcomeScreen() -> impl IntoView {
    let AccountSelectorContext {
        set_modal_state, ..
    } = expect_context::<AccountSelectorContext>();
    let network = expect_context::<NetworkContext>();

    let features = [
        (
            icondata::LuArrowLeftRight,
            TranslationKey::ComponentsWelcomeScreenFeatureSwapTitle,
            TranslationKey::ComponentsWelcomeScreenFeatureSwapDescription,
        ),
        (
            icondata::LuCoins,
            TranslationKey::ComponentsWelcomeScreenFeatureStakeTitle,
            TranslationKey::ComponentsWelcomeScreenFeatureStakeDescription,
        ),
        (
            icondata::LuWallet,
            TranslationKey::ComponentsWelcomeScreenFeatureLedgerTitle,
            TranslationKey::ComponentsWelcomeScreenFeatureLedgerDescription,
        ),
        (
            icondata::LuCode,
            TranslationKey::ComponentsWelcomeScreenFeatureOpenSourceTitle,
            TranslationKey::ComponentsWelcomeScreenFeatureOpenSourceDescription,
        ),
    ];

    view! {
        <div class="absolute inset-0 bg-neutral-950 lg:rounded-3xl overflow-y-auto">
            <div class="flex items-center justify-center min-h-full">
                <div class="p-8 w-full max-w-md">
                    <div class="flex items-center gap-3 mb-6">
                        <img src="/favicon.svg" alt="" width="40" height="40" class="w-10 h-10" />
                        <span class="text-white text-lg font-semibold">"Intear Wallet"</span>
                    </div>
                    <h1 class="text-white text-3xl font-bold mb-3">
                        {move || TranslationKey::ComponentsWelcomeScreenTitle.format(&[])}
                    </h1>
                    <p class="text-neutral-400 mb-8">
                        {move || TranslationKey::ComponentsWelcomeScreenSubtitle.format(&[])}
                    </p>
                    <ul class="flex flex-col gap-4 mb-8">
                        {features
                            .into_iter()
                            .map(|(icon, title, description)| {
                                view! {
                                    <li class="flex gap-3">
                                        <div class="shrink-0 w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                            <Icon icon=icon width="20" height="20" />
                                        </div>
                                        <div>
                                            <h2 class="text-white font-medium">
                                                {move || title.format(&[])}
                                            </h2>
                                            <p class="text-neutral-400 text-sm">
                                                {move || description.format(&[])}
                                            </p>
                                        </div>
                                    </li>
                                }
                            })
                            .collect_view()}
                    </ul>
                    <div class="flex flex-col gap-3">
                        <button
                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer group"
                            style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)"
                            on:click=move |_| {
                                set_modal_state
                                    .set(ModalState::Creating {
                                        parent: match network.network.get_untracked() {
                                            Network::Mainnet => AccountCreateParent::Mainnet,
                                            Network::Testnet => AccountCreateParent::Testnet,
                                            Network::Localnet { .. } => AccountCreateParent::Mainnet,
                                        },
                                        recovery_method: AccountCreateRecoveryMethod::RecoveryPhrase,
                                    })
                            }
                        >
                            <div
                                class="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                style="background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)"
                            ></div>
                            <span class="relative">
                                {move || {
                                    TranslationKey::ComponentsWelcomeScreenButtonCreateAccount
                                        .format(&[])
                                }}
                            </span>
                        </button>
                        <button
                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer"
                            on:click=move |_| set_modal_state.set(ModalState::LoggingIn)
                        >
                            {move || TranslationKey::ComponentsWelcomeScreenButtonLogIn.format(&[])}
                        </button>
                    </div>
                    <a
                        href="https://intea.rs/wallet"
                        target="_blank"
                        class="block text-center text-sm text-neutral-400 hover:text-white mt-6"
                    >
                        {move || TranslationKey::ComponentsWelcomeScreenLearnMore.format(&[])}
                    </a>
                </div>
            </div>
        </div>
    }
}
