use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn TransactionSuccessModal(
    on_close: impl Fn() + 'static + Clone,
    message: String,
) -> impl IntoView {
    let on_close2 = on_close.clone();
    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| on_close()
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuCheck
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">"Transaction Successful!"</h3>
                        <p class="text-gray-400 text-sm">{message}</p>
                    </div>

                    <button
                        class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| on_close2()
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn TransactionErrorModal(
    on_close: impl Fn() + 'static + Clone,
    error: String,
) -> impl IntoView {
    let on_close2 = on_close.clone();
    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| on_close()
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuX
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">"Transaction Failed"</h3>
                        <p class="text-gray-400 text-sm">{error}</p>
                    </div>

                    <button
                        class="w-full mt-6 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| on_close2()
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}
