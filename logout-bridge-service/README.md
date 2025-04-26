# Logout Bridge Service

A trustless (in terms of fake data, not reliability. Should not be relied on) service for session synchronization.

## Use cases:

1. The user taps "Disconnect" on a dapp. Showing a pop-up and asking to enter password is terrible UX, so this service stores the data about the state of connection (connected, logged out, and if logged out, whether it's done in wallet or dapp). When the user logs in to their wallet next time, the change will reflect on `/connected-apps` page and the function call key will be removed lazily. This is technically not the most secure way to remove a key, but we already trust the frontend to notify the service, and not many apps actually use sign in with function call key, so slime is willing to sacrifice this small risk for better UX.
2. Real-time log-out. When you're on `/connected-apps` and click "Log Out", the dapp on the other tab immediately refreshes and logs you out.
3. Deferred log-out. When you're on `/connected-apps`, click "Log Out", but the dapp is not open, the dapp will check if the session is active or logged out when it loads next time.

## Reason for a centralized service

Too many centralized services is never good, but I tried many options with popups, invisible iframes, PWA service workers, but I don't think it's possible to make it work in Firefox-based browsers with Enhanced Tracking Protection, which makes iframes of websites have separate copies of localStorage / BroadcastChannel that are not connected to the same website (wallet) open as a normal tab, which makes it impossible to share data between tabs / origins using purely client-sided options.

## Security

Almost all messages use signatures to verify that only the real account is signing in, that only relevant wallet or app can view information about their sessions, only wallet or app can log the user out. The exact protocol is subject to change and is not documented, but fully available in this repo.

## Running Locally

Copy `.env.example` to `.env` and optionally add your own RPCs that the service will use to check that the first (sign in) message was signed using a full access key.

## Maintenance

It's safe to purge the database when it grows too big, but 1) it shouldn't, since it stores way less than 1kb of data per user connection, which should be enough for years of work and thousands of users, 2) logout synchronization for sessions where log-in was performed before the wipe will fail. If deleting the database, it's recommended to (somehow) delete only entries that have already been logged out to avoid disruption of service for recent connections. Though there will still be a little disruption of service for sessions that have been logged out on one side but haven't synchronized on the other side (wallet logged out -> dapp not loaded since, dapp logged out -> wallet not loaded since). 
