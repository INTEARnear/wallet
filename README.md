# Intear Wallet

An open source wallet that can be accessed at [wallet.intear.tech](https://wallet.intear.tech).


## Running Locally

You need to set up some env variables in `.env` to external services, and if you don't use `.env.prod`, you'd need to set up history-service and account-creation-service in their respective directories in this repo.

To build, install `cargo install trunk` and use `trunk build` or `trunk build --release`. To serve and watch for changes, use `trunk serve`.

Built with [Leptos](https://leptos.dev), [TailwindCSS](https://tailwindcss.com), and `near-min-api` (an upcoming wasm-ready crate).


## Contributing

Feel free to create an issue or PR with the feature you want added in the wallet. Some places you might be interested in contributing to:

- [`history.rs`](src/pages/history.rs): Add custom rendering of interactions with your dapp on the History page.
- [`explore_components.rs`](src/components/explore_components.rs), [`learn.rs`](src/data/learn.rs), and [`protocols.rs`](src/data/protocols.rs): Add your dapp / article / custom sections on the Explore page.
