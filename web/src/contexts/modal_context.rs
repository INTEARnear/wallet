use leptos::prelude::*;

#[derive(Clone)]
pub struct ModalContext {
    pub modal: RwSignal<Option<Box<dyn Fn() -> AnyView>>, LocalStorage>,
}

pub fn provide_modal_context() {
    let modal = RwSignal::new_local(None);
    provide_context(ModalContext { modal });
}
