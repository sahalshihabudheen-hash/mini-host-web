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
├── features.html / screenshots.html / how.html / download.html / faq.html
│                               # one shell page each — the site is multi-page
├── public/
│   ├── MiniHost-v5.1.1.apk     # the real APK served by the download button
│   ├── logo.png                # the app's official logo (used for branding + favicon)
│   └── images/                 # the seven Minecraft artwork images (URL-safe names)
├── src/
│   ├── pages/                  # entry per page: home, features, screenshots, how, download, faq
│   ├── styles.css              # all styling (dark charcoal + Minecraft green)
│   ├── data/site.ts            # all copy: features, gallery, steps, FAQ, APK info
│   └── components/             # Nav, Hero, Features, Gallery, HowItWorks, Download, Faq, Footer, PageHeader
└── vite.config.ts              # lists all six HTML pages as build inputs
```

Navigation between pages uses plain `.html` links (no router), so every page works as
a standalone static file.

## Deploying

`npm run build` produces a plain `dist/` folder. Upload it to any static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, a plain web server…). Nothing
server-side is required. The APK and images are copied into `dist/` automatically.

## Replacing the APK (new version)

1. Drop the new APK file into `public/` (e.g. `MiniHost-v5.2.0.apk`).
2. Update the download link in **one place**: `src/data/site.ts` — set `APK.url`,
   `APK.name` and `APK.version`. The version and size shown on the Download buttons
   across the page update automatically.
3. Rebuild with `npm run build`.

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
