# NFT Proxy Service

This service acts as a proxy for NFT images. It enhances user privacy by hiding their IP address, improves performance by caching images, and reduces bandwidth by resizing and converting images to compressed WebP format.

## Features

- **IP Anonymization**: Hides the end-user's IP address from the original media source.
- **Caching**: Caches successful responses and error responses to avoid re-fetching from the origin.
- **Image Optimization**: Resizes images to 512x512 and converts them to the highly compressed WebP format before caching and serving them to the user.
- **SVG Rasterization**: SVGs are rasterized with `resvg` and then go through the same resize and WebP pipeline. Local file references inside the SVG are blocked, and `<text>` is not rendered because no fonts are loaded. SVGs that fail to parse return `422`.

## Running Locally

Copy `.env.example` to `.env` and

```bash
cd nft-proxy-service
cargo run
```
