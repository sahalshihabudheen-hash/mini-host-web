/**
 * Build step: turn the client-rendered pages into real HTML.
 *
 * Vite emits an empty shell per page and React draws the content afterwards, so a
 * crawler that does not run JavaScript sees nothing. This runs each page's component
 * tree through React's server renderer and writes the result into the built HTML, then
 * adds the canonical link, structured data and sitemap.xml.
 *
 * Runs after `vite build`, so it reads and rewrites files in dist/.
 */
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { execFileSync } from 'node:child_process'
import { readFile, writeFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const dist = path.join(root, 'dist')

const PAGES = [
  { file: 'index.html', entry: 'home' },
  { file: 'features.html', entry: 'features' },
  { file: 'screenshots.html', entry: 'screenshots' },
  { file: 'how.html', entry: 'how' },
  { file: 'download.html', entry: 'download' },
  { file: 'faq.html', entry: 'faq' },
  { file: 'about.html', entry: 'about' },
]

/** Sources that feed a page, for the sitemap's lastmod. */
function sourcesFor(page) {
  return [page.file, `src/pages/${page.entry}.tsx`, 'src/components', 'src/data', 'src/styles.css']
}

function gitDate(paths) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
      cwd: root,
      encoding: 'utf8',
    }).trim()
    return out ? new Date(out) : null
  } catch {
    return null
  }
}

async function fileDate(p) {
  try {
    return (await stat(path.join(root, p))).mtime
  } catch {
    return null
  }
}

async function lastmodFor(page) {
  const paths = sourcesFor(page)
  const dates = (await Promise.all(paths.map(fileDate))).filter(Boolean)
  const git = gitDate(paths)
  if (git) dates.push(git)
  const newest = dates.sort((a, b) => b - a)[0] ?? new Date()
  return newest.toISOString().slice(0, 10)
}

/** Only characters that matter inside a <script> block; text nodes are already escaped. */
const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

/** index.html is served at /, so that is the URL search engines should be pointed at. */
const publicUrl = (file) => (file === 'index.html' ? `${seo.ORIGIN}/` : `${seo.ORIGIN}/${file}`)

const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
})

const seo = await server.ssrLoadModule('/src/data/seo.ts')

const rows = []

for (const page of PAGES) {
  const file = path.join(dist, page.file)
  const before = await readFile(file, 'utf8')

  const mod = await server.ssrLoadModule(`/src/pages/${page.entry}.tsx`)
  if (typeof mod.App !== 'function') throw new Error(`${page.entry}.tsx must export App`)

  const markup = renderToStaticMarkup(createElement(mod.App))
  if (!markup.trim()) throw new Error(`${page.file} rendered empty`)

  let html = before.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
  if (html === before) throw new Error(`${page.file}: no empty #root to fill — did the build change?`)

  const canonical = `<link rel="canonical" href="${publicUrl(page.file)}" />`
  const author = `<meta name="author" content="${seo.AUTHOR.name}" />`
  const blocks = seo.ldFor(page.file, await lastmodFor(page))
  const structured = blocks.map((b) => `<script type="application/ld+json">${jsonLd(b)}</script>`).join('\n    ')

  html = html.replace('</head>', `  ${author}\n  ${canonical}\n    ${structured}\n  </head>`)

  const words = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  await writeFile(file, html)
  rows.push({ page: page.file, shell: before.length, html: html.length, words })
}

const dates = Object.fromEntries(await Promise.all(PAGES.map(async (p) => [p.file, await lastmodFor(p)])))
const today = new Date().toISOString().slice(0, 10)

const urls = PAGES.map(
  (p) => `  <url>\n    <loc>${publicUrl(p.file)}</loc>\n    <lastmod>${dates[p.file]}</lastmod>\n  </url>`,
).join('\n')

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)

await server.close()

const widest = Math.max(...rows.map((r) => r.page.length))
console.log('\nPrerendered pages')
for (const r of rows) console.log(`  ${r.page.padEnd(widest)}  ${String(r.shell).padStart(6)} -> ${String(r.html).padStart(6)} B   ${String(r.words).padStart(4)} words of text`)
console.log(`  sitemap.xml  ${PAGES.length} urls (built ${today})\n`)
