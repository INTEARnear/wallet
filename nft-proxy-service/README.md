# NFT Proxy Service

This service acts as a proxy for NFT images. It enhances user privacy by hiding their IP address, improves performance by caching images, and reduces bandwidth by resizing and converting images to compressed WebP format.

## Features

- **IP Anonymization**: Hides the end-user's IP address from the original media source.
- **Caching**: Caches successful responses and error responses to avoid re-fetching from the origin.
- **Image Optimization**: Resizes images to 512x512 and converts them to the highly compressed WebP format before caching and serving them to the user.

## Running Locally

Copy `.env.example` to `.env` and

```bash
cd nft-proxy-service
cargo run
```
