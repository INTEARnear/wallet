# Password Storage Service

A trustless (in terms of fake data, not reliability or correctness of time. Should not be relied on) service for password storage.

## Use case

Storing data that times out is not easy. It should not be possible to turn off user's device and extract the password from a temporary file or entry in localStorage. That's why this service exists - users send their encrypted passwords to this service, and trust it to not store / serve them for any longer than the user requested.

## Risks

So the risk is technically increased, but very unlikely, as for a successful attack the hacker would need to have access to both user files (for password identifier and decryption key) and the wallet server (for the encrypted password).

While this risk is higher than no risk of this attack at all, the only viable alternative is to not remember passwords at all, which is a terrible UX. The usage of this option can be toggled in wallet settings, so if some users prefer this option, it's always available.

## Security

Passwords sent and stored on this service are in encrypted (assuming the client side encrypts them, which the official Intear Wallet does). The key is supposed to be completely random with no hope of ever brute forcing it, so even if this database was completely public / transparent, it would not pose any security threats. But to make impossible attacks like this just a bit harder, the passwords are indexed by nanoid, which are random and unguessable by third parties.

Note that by "Passwords" this page means any type of credential. In the official Intear Wallet implementation, it's the already-derived AES-GCM key to eliminate the 200-400ms delay needed for the client side to attempt to derive the password.

## Running Locally

Copy `.env.example` to `.env`.

## Maintenance

It's safe to purge the database when it grows too big, but 1) it shouldn't, since it stores way less than 1kb of data per password, which should be enough for years of work and thousands of users, 2) the data is temporary and all rows will be deleted at some point, 3) auto-login will stop working once (but will continue working after they unlock their password once and the wallet saves it again). 
