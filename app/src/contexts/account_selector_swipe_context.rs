use leptos::prelude::*;

#[derive(Copy, Clone)]
pub struct AccountSelectorSwipeContext {
    pub progress: ReadSignal<f64>,
    pub set_progress: WriteSignal<f64>,
    pub state: ReadSignal<bool>,
    pub set_state: WriteSignal<bool>,
}

pub fn provide_account_selector_swipe_context() {
    let (progress, set_progress) = signal(0.0);
    let (state, set_state) = signal(false);
    provide_context(AccountSelectorSwipeContext {
        progress,
        set_progress,
        state,
        set_state,
    });
}
