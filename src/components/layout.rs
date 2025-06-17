#![allow(clippy::float_arithmetic)] // Not important for UI layout

use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::{
    components::*,
    hooks::{use_location, use_navigate},
};
use rand::{rngs::OsRng, Rng};
use std::time::Duration;
use web_sys::TouchEvent;

use crate::components::{transaction_queue_overlay::TransactionQueueOverlay, PasswordUnlock};
use crate::contexts::account_selector_swipe_context::AccountSelectorSwipeContext;
use crate::{
    components::wallet_header::WalletHeader,
    contexts::network_context::{Network, NetworkContext},
};

/// Height of the bottom navbar with buttons
const BOTTOM_NAV_HEIGHT_PX: u32 = 64;
/// Don't perform horizontal tab swipe if swipe Y is at least this amount
const SWIPE_Y_THRESHOLD_PX: f64 = 75.0;
/// Only perform horizontal tab swipe if swipe X is at least this amount
const SWIPE_X_THRESHOLD_PX: f64 = 75.0;
/// Distance from left edge to trigger account selector - scales with viewport width up to a maximum
fn left_edge_threshold() -> f64 {
    let viewport_width = web_sys::window()
        .unwrap()
        .inner_width()
        .unwrap()
        .as_f64()
        .unwrap();
    (viewport_width * 0.25).min(120.0)
}

fn get_random_background() -> String {
    let mut rng = OsRng;
    let random_num = rng.gen_range(1..=12);
    format!("/bg{}.webp", random_num)
}

#[derive(Clone, Copy, PartialEq, Debug)]
enum MovementDirection {
    Horizontal,
    Vertical,
}

#[derive(Clone)]
struct NavItem {
    path: &'static str,
    icon: icondata::Icon,
}

#[component]
pub fn Layout(children: Children) -> impl IntoView {
    let location = use_location();
    let navigate = use_navigate();
    let (slide_direction, set_slide_direction) = signal("");
    let (prev_path, set_prev_path) = signal("".to_string());
    let (touch_start_x, set_touch_start_x) = signal(0.0);
    let (touch_start_y, set_touch_start_y) = signal(0.0);
    let (swipe_progress, set_swipe_progress) = signal(0.0);
    let (initial_movement_direction, set_initial_movement_direction) =
        signal(Option::<MovementDirection>::None);
    let (is_left_edge_swipe, set_is_left_edge_swipe) = signal(false);
    let random_background = get_random_background();
    let AccountSelectorSwipeContext {
        progress: _,
        set_progress: set_account_selector_progress,
        state: _,
        set_state: set_account_selector_state,
    } = expect_context::<AccountSelectorSwipeContext>();
    let NetworkContext { network } = expect_context::<NetworkContext>();

    const HOME_ITEM: &NavItem = &NavItem {
        path: "/",
        icon: icondata::LuWallet,
    };
    const SWAP_ITEM: &NavItem = &NavItem {
        path: "/swap",
        icon: icondata::LuRefreshCw,
    };
    const HISTORY_ITEM: &NavItem = &NavItem {
        path: "/history",
        icon: icondata::LuHistory,
    };
    const EXPLORE_ITEM: &NavItem = &NavItem {
        path: "/explore",
        icon: icondata::LuCompass,
    };
    let nav_items = move || match network.get() {
        Network::Mainnet => {
            vec![HOME_ITEM, SWAP_ITEM, HISTORY_ITEM, EXPLORE_ITEM]
        }
        Network::Testnet => {
            vec![HOME_ITEM, HISTORY_ITEM, EXPLORE_ITEM]
        }
    };

    let handle_touch_start = move |event: TouchEvent| {
        if let Some(touch) = event.touches().get(0) {
            let touch_x = touch.client_x() as f64;
            let touch_y = touch.client_y() as f64;
            set_touch_start_x(touch_x);
            set_touch_start_y(touch_y);
            set_initial_movement_direction(None);
            set_is_left_edge_swipe(touch_x <= left_edge_threshold());
        }
    };

    let handle_touch_move = move |event: TouchEvent| {
        if let Some(touch) = event.touches().get(0) {
            let touch_x = touch.client_x() as f64;
            let touch_y = touch.client_y() as f64;
            let delta_x = touch_x - touch_start_x.get();
            let delta_y = touch_y - touch_start_y.get();

            // Skip horizontal swipe handling in settings pages
            if location.pathname.get().starts_with("/settings") {
                return;
            }

            // Determine initial movement direction if not already set
            if initial_movement_direction.get().is_none() {
                let total_movement = (delta_x * delta_x + delta_y * delta_y).sqrt();
                if total_movement > 0.0 {
                    let direction = if delta_x.abs() > delta_y.abs() {
                        MovementDirection::Horizontal
                    } else {
                        MovementDirection::Vertical
                    };
                    set_initial_movement_direction(Some(direction));
                }
            }

            // If we've determined this is a horizontal swipe, prevent default scrolling
            if initial_movement_direction.get() == Some(MovementDirection::Horizontal) {
                event.prevent_default();
            }

            // Handle left edge swipe for account selector
            if is_left_edge_swipe.get()
                && initial_movement_direction.get() == Some(MovementDirection::Horizontal)
            {
                set_account_selector_progress((delta_x / SWIPE_X_THRESHOLD_PX).clamp(0.0, 1.0));
                return;
            }

            // Only process horizontal swipes if the initial movement was horizontal
            if initial_movement_direction.get() == Some(MovementDirection::Horizontal) {
                let current_index = nav_items()
                    .iter()
                    .position(|item| item.path == location.pathname.get().as_str())
                    .unwrap_or(0);

                // Calculate swipe progress
                let progress = match delta_x {
                    -100.0..=100.0 => delta_x,
                    ..-100.0 => -(-delta_x - 100.0).powf(0.75) - 100.0,
                    100.0.. => (delta_x - 100.0).powf(0.75) + 100.0,
                    _ => 0.0,
                };

                // Only allow swiping if we're not at the edge
                if (delta_x < 0.0 && current_index < nav_items().len() - 1)
                    || (delta_x > 0.0 && current_index > 0)
                {
                    set_swipe_progress(progress);
                }
            }
        }
    };

    let handle_touch_end = move |event: TouchEvent| {
        if let Some(touch) = event.changed_touches().get(0) {
            let touch_end_x = touch.client_x() as f64;
            let touch_end_y = touch.client_y() as f64;
            let delta_x = touch_end_x - touch_start_x.get();
            let delta_y = touch_end_y - touch_start_y.get();

            // Skip horizontal swipe handling in settings pages
            if location.pathname.get().starts_with("/settings") {
                set_initial_movement_direction(None);
                return;
            }

            // Handle left edge swipe for account selector
            if is_left_edge_swipe.get()
                && initial_movement_direction.get() == Some(MovementDirection::Horizontal)
            {
                if delta_x > SWIPE_X_THRESHOLD_PX {
                    set_account_selector_state(true);
                    set_account_selector_progress(0.0);
                }
                set_is_left_edge_swipe(false);
            } else if initial_movement_direction.get() == Some(MovementDirection::Horizontal)
                && delta_y.abs() < SWIPE_Y_THRESHOLD_PX
                && delta_x.abs() > SWIPE_X_THRESHOLD_PX
            {
                let current_index = nav_items()
                    .iter()
                    .position(|item| item.path == location.pathname.get().as_str())
                    .unwrap_or(0);

                if delta_x < 0.0 && current_index < nav_items().len() - 1 {
                    // Swipe left - go to next page
                    let next_path = nav_items()[current_index + 1].path;
                    navigate(next_path, Default::default());
                } else if delta_x > 0.0 && current_index > 0 {
                    // Swipe right - go to previous page
                    let prev_path = nav_items()[current_index - 1].path;
                    navigate(prev_path, Default::default());
                }
            }
            set_swipe_progress(0.0);
        }
        set_initial_movement_direction(None);
    };

    Effect::new(move |_| {
        let current_path = location.pathname.get();
        let prev = prev_path.get_untracked();

        // Skip animation for settings tab changes
        if current_path.starts_with("/settings") && prev.starts_with("/settings") {
            set_slide_direction("");
            set_prev_path(current_path);
            return;
        }

        if !prev.is_empty() {
            let current_index = nav_items()
                .iter()
                .position(|item| item.path == current_path.as_str())
                .unwrap_or(0);
            let prev_index = nav_items()
                .iter()
                .position(|item| item.path == prev.as_str())
                .unwrap_or(0);

            if current_index > prev_index {
                set_slide_direction("slide-in-enter");
            } else {
                set_slide_direction("slide-out-enter");
            }

            set_timeout(
                move || {
                    if current_index > prev_index {
                        set_slide_direction("slide-in");
                    } else {
                        set_slide_direction("slide-out");
                    }
                },
                Duration::from_millis(0),
            );
        } else {
            set_slide_direction("slide-in");
        }

        set_prev_path(current_path);
    });

    view! {
        <ErrorBoundary fallback=|errors| {
            view! {
                <h1>"Something went wrong!"</h1>
                <p>"Errors: "</p>
                <ul>
                    {move || {
                        errors
                            .get()
                            .into_iter()
                            .map(|(_, e)| view! { <li>{e.to_string()}</li> })
                            .collect_view()
                    }}
                </ul>
            }
        }>
            <div
                class="flex justify-center items-center h-screen overflow-hidden bg-black lg:bg-[linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)),var(--bg-image)] lg:bg-cover lg:bg-center lg:bg-no-repeat"
                style=format!("--bg-image: url('{}')", random_background)
            >
                <div
                    class="h-[100dvh] absolute top-0 lg:top-[30px] bottom-0 w-full lg:h-[calc(100%-60px)] lg:w-[600px] bg-neutral-950 lg:rounded-3xl transition-all duration-150 flex flex-col"
                    on:touchstart=handle_touch_start
                    on:touchmove=handle_touch_move
                    on:touchend=handle_touch_end
                >
                    <PasswordUnlock />
                    <TransactionQueueOverlay />
                    <div class="p-2 sm:p-4">
                        <WalletHeader />
                    </div>
                    <div class="flex-1 overflow-y-auto overflow-x-hidden px-4 transition-all duration-100 pb-4 h-full *:h-full">
                        <div
                            class=slide_direction
                            style=move || {
                                format!(
                                    "transform: translateX(calc({}px + var(--slide-transform))); opacity: min({}, var(--slide-opacity))",
                                    swipe_progress.get(),
                                    1.0 - swipe_progress.get().abs() / 250.0,
                                )
                            }
                        >
                            {children()}
                        </div>
                    </div>
                    {move || {
                        let current_path = location.pathname.get();
                        if !current_path.starts_with("/settings/") && current_path != "/connect"
                            && current_path != "/send-transactions"
                            && current_path != "/sign-message"
                        {
                            view! {
                                <div
                                    class="flex bg-black lg:rounded-b-3xl transition-all duration-150 shadow-[0_-4px_8px_rgba(50,50,100,0.25)]"
                                    style=format!("height: {BOTTOM_NAV_HEIGHT_PX}px")
                                >
                                    <div
                                        class="absolute bg-neutral-700 transition-all duration-150"
                                        class:nav-indicator-first=move || {
                                            let current_index = nav_items()
                                                .iter()
                                                .position(|item| {
                                                    item.path == location.pathname.get().as_str()
                                                })
                                                .unwrap_or(0);
                                            current_index == 0
                                        }
                                        class:nav-indicator-last=move || {
                                            let current_index = nav_items()
                                                .iter()
                                                .position(|item| {
                                                    item.path == location.pathname.get().as_str()
                                                })
                                                .unwrap_or(0);
                                            current_index == nav_items().len() - 1
                                        }
                                        style=move || {
                                            let current_index = nav_items()
                                                .iter()
                                                .position(|item| {
                                                    item.path == location.pathname.get().as_str()
                                                })
                                                .unwrap_or(0);
                                            format!(
                                                "left: calc({}% - {}px); height: {BOTTOM_NAV_HEIGHT_PX}px; width: calc(100% / {})",
                                                current_index as f64 * 100.0 / nav_items().len() as f64,
                                                swipe_progress.get() / 4.0,
                                                nav_items().len(),
                                            )
                                        }
                                    />
                                    {move || {
                                        nav_items()
                                            .iter()
                                            .copied()
                                            .map(|item| {
                                                view! {
                                                    <A
                                                        href=item.path
                                                        attr:class="flex flex-col items-center justify-center cursor-pointer z-10"
                                                        attr:style=format!(
                                                            "width: calc(100% / {}); {}",
                                                            nav_items().len(),
                                                            if location.pathname.get() == item.path {
                                                                "color: white"
                                                            } else {
                                                                "color: #808080"
                                                            },
                                                        )
                                                    >
                                                        <Icon icon=item.icon width="24" height="24" />
                                                    </A>
                                                }
                                            })
                                            .collect_view()
                                    }}
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}
                </div>
            </div>
        </ErrorBoundary>
    }
}
