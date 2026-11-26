# Clothing Store Website

A simple storefront: browse products, pick colour and size, and send the order on WhatsApp.

## Tech

Next.js, React, TypeScript, Tailwind CSS, Framer Motion.

## Run locally

Needs Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other commands:

```bash
pnpm build
pnpm start
pnpm typecheck
```

## Products

Products live in `data/products.ts`. Photos and videos go in `public/products/`.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` to allow search engines (default `false`) |
