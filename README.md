# Brand Hub Mens Wear – Kopargaon

Website for **Brand Hub Mens Wear**, Prashant Palace, Juna Bhaji Market Road, Kopargaon.
Customers browse new arrivals (real photos and reels from the shop), pick colour and size, and send the order on WhatsApp. No payment gateway: orders go to **8605339900** on WhatsApp and are picked up from the shop.

> **Status: demo.** It is hidden from Google (`noindex`) until the shop approves it. See [Going live](#going-live).

## Tech

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + hand-written CSS in `app/globals.css`
- Framer Motion for animations
- Fonts are self-hosted from npm (`@fontsource/*`): Anton, Archivo, Noto Sans Devanagari
- No database, no backend: all products live in `data/products.ts`

## Run it on your computer

Needs **Node.js 20.9 or newer** and **pnpm**.

```bash
npm install -g pnpm        # once, if you don't have pnpm
pnpm install
pnpm dev                   # http://localhost:3000
```

Other commands:

```bash
pnpm build       # production build (run this before pushing to catch errors)
pnpm start       # serve the production build locally
pnpm typecheck   # TypeScript check only
```

## Project structure

```
app/
  layout.tsx          site metadata, fonts, shop details for Google (JSON-LD)
  page.tsx            home page
  p/[slug]/page.tsx   one page per product (/p/premium-plain-shirt …)
  robots.ts           blocks search engines while it's a demo
  sitemap.ts          sitemap for Google once live
  globals.css         all styling
components/
  shop-front.tsx      home page: hero, reels, new arrivals, WhatsApp bag
  product-detail.tsx  product page
  whatsapp.tsx        shop WhatsApp number + WhatsApp icon
data/
  products.ts         the product catalogue (edit this to change stock)
lib/
  site.ts             site URL + indexing switch (from env variables)
public/products/      product photos and reels, one folder per product
```

## Updating products

Everything is in **`data/products.ts`**. Each product is one block:

```ts
{
  slug: 'premium-plain-shirt',          // used in the URL: /p/premium-plain-shirt
  name: 'Premium Plain Shirt',
  tagline: 'Premium quality, plain colour',
  category: 'Shirts',                   // Shirts | Jackets | Trousers | Winter accessories | Jeans | Ethnic | T-shirts
  price: null,                          // number like 799, or null to show "Ask for price"
  sizes: ['M', 'L', 'XL'],
  colours: [
    c('plain-shirt', 'Maroon', '#5a1f24', 'maroon'),   // folder, colour name, swatch colour, photo file name
  ],
  reel: '/products/plain-shirt/reel.mp4',              // optional
  isNew: true,                          // shows the yellow NEW stamp
  postedAt: '2026-11-25',
  image: '/products/plain-shirt/maroon.jpg',           // main photo
  labelLines: ['NEW PATTERN', 'PREMIUM QUALITY SHIRTS', '7 COLOUR', 'SIZE M–XL'],
  fit: 'Sizes M to XL',
}
```

- The **first product** in the list is the big "Latest drop" at the top of the home page. Put the newest article first.
- Lines marked `// confirm` are guesses (sizes, colour names) to check with the shop.

### Adding photos and reels

1. Make a folder: `public/products/<product-folder>/`
2. Photos: **portrait 4:5** (e.g. 1080×1350), JPG, one per colour, named after the colour: `navy.jpg`, `wine.jpg` …
   Keep each under ~200 KB (Squoosh.app or any compressor works).
3. Reel: **vertical 9:16** MP4 (H.264), under ~5 MB, named `reel.mp4`. Then set `reel: '/products/<folder>/reel.mp4'`.
   To shrink a big phone video with ffmpeg:
   ```bash
   ffmpeg -i input.mp4 -vf "scale=720:1280,fps=30" -c:v libx264 -crf 27 -c:a aac -b:a 96k -movflags +faststart reel.mp4
   ```
4. Ask the shop for the **original** photos/videos, not ones forwarded on WhatsApp (they are heavily compressed).

### Changing the WhatsApp number or shop details

- WhatsApp number for orders: `components/whatsapp.tsx` (`SHOP_WHATSAPP`, format `91` + 10 digits)
- Call buttons, address, map link: search for `8605339900` and `Prashant Palace` in `components/` and `app/layout.tsx`

## Deploy for free on Vercel

### 1. Put the code on GitHub

```bash
cd brandhub-mens-wear          # the unzipped project folder
git init
git add .
git commit -m "Brand Hub Mens Wear website"
git branch -M main
```

Create an **empty private repository** on github.com (no README, no .gitignore), then:

```bash
git remote add origin https://github.com/<your-username>/brandhub-mens-wear.git
git push -u origin main
```

`node_modules`, `.next` and `.env*` files are already ignored by `.gitignore`.

### 2. Import it on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub (the free **Hobby** plan is enough for a demo).
2. **Add New… → Project** → pick the `brandhub-mens-wear` repository → **Import**.
3. Vercel detects everything automatically:
   - Framework preset: **Next.js**
   - Install command: `pnpm install` (from `pnpm-lock.yaml`)
   - Build command: `next build`
   - Leave all of these as they are.
4. **Environment Variables** (optional for the demo):

   | Name | Value | Why |
   |---|---|---|
   | `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | keeps the demo out of Google (this is also the default) |
   | `NEXT_PUBLIC_SITE_URL` | leave empty | Vercel's own `*.vercel.app` URL is used automatically |

5. Click **Deploy**. In 1–2 minutes you get a link like `https://brandhub-mens-wear.vercel.app`.
6. Optional: **Settings → Domains** lets you rename it, e.g. `brandhub-kopargaon.vercel.app`.

### 3. Updating the site

Every `git push` to `main` redeploys automatically:

```bash
git add .
git commit -m "Add new jackets"
git push
```

Pushes to other branches get their own **preview link**, handy for showing changes to the shop before they go on the main link.

If a deploy fails, open the deployment in Vercel → **Build Logs**. Running `pnpm build` locally first catches most errors.

## Going live

When the shop approves:

1. Fill in real prices, sizes and colour names in `data/products.ts` (remove the `// confirm` guesses).
2. Add the shop's logo and timings.
3. Optional: buy a domain (e.g. `brandhubkopargaon.in`) and add it in Vercel → **Settings → Domains**.
4. In Vercel → **Settings → Environment Variables** set:
   - `NEXT_PUBLIC_ALLOW_INDEXING` = `true`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain` (or the vercel.app URL)
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the new values are used.
6. Submit the site in [Google Search Console](https://search.google.com/search-console) and add the link to the shop's Google Business Profile, Instagram bio and WhatsApp Business profile.

Note: Vercel's Hobby plan is for non-commercial use. For a paying client's live shop website, move it to the shop's own Vercel account or a Pro plan (or another host) at that point.

## Ideas for later

- Admin page so the shop can add new arrivals from a phone (needs a small database, e.g. Supabase, plus image storage)
- WhatsApp Business catalogue sync
- Festive/wedding collection page with its own reels
