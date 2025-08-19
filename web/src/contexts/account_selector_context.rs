use leptos::prelude::*;

use crate::components::account_selector::ModalState;

#[derive(Copy, Clone)]
pub struct AccountSelectorContext {
    pub swipe_progress: ReadSignal<f64>,
    pub set_swipe_progress: WriteSignal<f64>,
    pub is_expanded: ReadSignal<bool>,
    pub set_expanded: WriteSignal<bool>,
    pub modal_state: ReadSignal<ModalState>,
    pub set_modal_state: WriteSignal<ModalState>,
}

pub fn provide_account_selector_context() {
    let (swipe_progress, set_swipe_progress) = signal(0.0);
    let (is_expanded, set_expanded) = signal(false);
    let (modal_state, set_modal_state) = signal(ModalState::AccountList);
    provide_context(AccountSelectorContext {
        swipe_progress,
        set_swipe_progress,
        is_expanded,
        set_expanded,
        modal_state,
        set_modal_state,
    });
}
