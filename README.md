# Intear Wallet

An open source wallet that can be accessed at [wallet.intear.tech](https://wallet.intear.tech).


## Running Locally

You need both the Rust toolchain and Node installed.

1. Install Rust targets + Trunk + patch-crate if you haven't already:

```bash
cargo install trunk
cargo install patch-crate
rustup target add wasm32-unknown-unknown
```

2. Install JS dependencies:

```bash
npm install -D
```

3. Patch Rust dependencies:
```bash
cargo patch-crate
```

4. Start the development servers (auto-rebuilds Rust, Tailwind and TS):

```bash
npm run dev
```

For a release build:

```bash
npm run build
```

The output will be in `dist/`

You need to set up some env variables in `.env` to external services, and if you don't use `.env.prod`, you'd need to set up history-service, account-creation-service, and other services in their respective directories in this repo.

Built with Leptos, TailwindCSS, Trunk, ESBuild, and `near-min-api` (a wasm-ready crate built for this wallet).


## Contributing

Feel free to create an issue or PR with the feature you want added in the wallet. Some places you might be interested in contributing to:

- [`history.rs`](src/pages/history.rs): Add custom rendering of interactions with your dapp on the History page.
- [`explore_components.rs`](src/components/explore_components.rs), [`learn.rs`](src/data/learn.rs), and [`protocols.rs`](src/data/protocols.rs): Add your dapp / article / custom sections on the Explore page.
