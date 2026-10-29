# MiniHost Website

The official landing page for **MiniHost** — an Android app that hosts Minecraft: Java Edition
servers (Paper) directly on your phone. Built with React, TypeScript and Vite. Fully static,
ready for any static host.

## Quick start

```bash
npm install       # install dependencies
npm run dev       # start dev server (default http://localhost:5173)
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
├── index.html                  # Home page shell (title, meta, social tags, fonts)
├── features.html / screenshots.html / how.html / download.html / faq.html / about.html
│                               # one shell page each — the site is multi-page
├── api/report.js               # Vercel serverless function: forwards the contact form
│                               # to a Discord webhook (the only server-side piece)
├── public/
│   ├── MiniHost.apk            # the real APK served by the download button (stable name)
│   ├── logo.png                # the app's official logo (used for branding + favicon)
│   ├── og-image.png            # 1200×630 share card shown when the site is pasted into Discord
│   └── images/                 # the ten Minecraft artwork images (URL-safe names)
├── src/
│   ├── pages/                  # entry per page: home, features, screenshots, how, download, faq, about
│   ├── styles.css              # all styling (dark charcoal + Minecraft green)
│   ├── data/site.ts            # all copy: features, gallery, steps, FAQ, APK info, DISCORD_ID
│   └── components/             # Nav, Hero, Features, Gallery, HowItWorks, Download, Faq, Footer,
│                               # PageHeader, DiscordCard, ReportForm
├── vercel.json                 # build settings + APK download headers
└── vite.config.ts              # lists all seven HTML pages as build inputs
```

Navigation between pages uses plain `.html` links (no router), so every page works as
a standalone static file.

## Deploying

`npm run build` produces a plain `dist/` folder. The pages, APK and images are fully
static and can go on any static host (Netlify, GitHub Pages, Cloudflare Pages…).

The **one exception is the contact form** on the About page: it needs the
`api/report.js` function, so that page only works end-to-end on Vercel (or another host
that runs serverless functions). Everywhere else the form shows a friendly error and
points people to the in-app option.

## Setting up the About & Contact page

Two values are needed before this page is live. Both are yours alone.

**1. Your Discord user ID** (drives the live presence card) — already set to your ID

- Discord → Settings → Advanced → enable **Developer Mode**
- Right-click your own profile → **Copy User ID**
- Paste it into `DISCORD_ID` in `src/data/site.ts`
- Join https://discord.gg/lanyard once — Lanyard only exposes presence for members of
  that server. Until then the card shows a "not being monitored" message.

**2. A Discord webhook** (where reports land)

- In your Discord server: Channel → Edit → Integrations → Webhooks → **New Webhook**
- Copy the webhook URL
- In Vercel: your project → Settings → **Environment Variables** → add
  `DISCORD_WEBHOOK_URL` with that URL → redeploy

Never put the webhook URL in this repository or in `src/` — it is readable by anyone who
views the site, and they could then post into your channel. It stays server-side in the
function, which is why the form needs Vercel at all.

**Note on abuse:** the form is public and has a honeypot plus length caps, but no real
rate limit — expect occasional spam in that channel. Anyone can also submit it by hand
with curl. If it becomes a problem, delete the webhook and recreate it, then update the
environment variable.

## Replacing the APK (new version)

The APK is served from one stable address — `/MiniHost.apk` — so a new release never
means editing links anywhere.

1. Overwrite `public/MiniHost.apk` with the new build (keep the filename).
2. Update the label in `src/data/site.ts`: `APK.version` and `APK.sizeMB`. The version and
   size shown on every Download button come from there.
3. `npm run build`, then deploy. Old links people shared keep working and always hand out
   the newest file.

If you ever want the filename itself to carry the version again, change `APK.url` and
`APK.name` in that same file and rename the file in `public/`.

## Link preview when the site is shared

Each HTML shell declares Open Graph tags pointing at `public/og-image.png` (1200×630,
logo + headline baked in) with **absolute** URLs, because Discord ignores relative
`og:image` values and shows an embed with no picture or branding.

Two things to know:

- The URLs are hardcoded to `https://mini-host-web.vercel.app`. If the project is ever
  renamed or moved to a custom domain, update `og:url`, `og:image` and `twitter:image`
  in all seven `.html` files, or the preview image breaks.
- Discord caches the preview of a link. After changing the tags, re-sharing may still show
  the old card for a while.

## Replacing or adding gallery images

1. Put the image in `public/images/` (use a URL-safe filename, e.g. `new-shot.jpg`).
2. Add an entry to `shots` in `src/data/site.ts` with `src`, descriptive `alt` text
   and a short `caption`. The gallery grid and lightbox handle the rest.

## Notes on accuracy

Every feature, step and FAQ answer on the page was verified against the MiniHost app
source (it runs Paper, downloads its own Java runtime, installs Modrinth plugins,
supports Geyser/Floodgate crossplay, bore/playit tunnels, WorldEdit schematics,
backups and in-app updates). Nothing on the site claims uptime, player counts or
performance numbers. Known requirements stated on the page: Android 8.0+, 64-bit
(arm64) devices, Minecraft: Java Edition server with Bedrock players able to join
through Geyser crossplay.
