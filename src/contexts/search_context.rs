use leptos::prelude::*;

#[derive(Clone)]
pub struct SearchContext {
    pub query: ReadSignal<String>,
    pub set_query: WriteSignal<String>,
}

pub fn provide_search_context() {
    let (query, set_query) = signal("".to_string());
    provide_context(SearchContext { query, set_query });
}
