import { APK, faqs, features } from './site'

/**
 * Public origin of the production site. Canonical links, the sitemap and every
 * structured-data URL below are built from this one value — change it here if the
 * domain ever moves, then rebuild, and all three stay consistent.
 */
export const ORIGIN = 'https://mini-host-web.vercel.app'

export const SITE_NAME = 'MiniHost'

/**
 * The person behind the app. Google can only rank a page for a name that appears
 * on it, so this feeds the byline, the footer and the `Person` structured data.
 * `sameAs` is the one link verified from this repo's git remote — add profile URLs
 * there, never guessed ones, because they become machine-readable claims.
 */
export const AUTHOR = {
  name: 'Sahal Shihabudheen',
  handle: 'sahal_pro',
  sameAs: ['https://github.com/sahalshihabudheen-hash'],
}

export const DESCRIPTION =
  'MiniHost is an Android app that hosts Minecraft: Java Edition servers directly on your phone. No PC, no Termux — start a server, add plugins, and let friends join from anywhere.'

const PERSON_ID = `${ORIGIN}/about.html#author`

const person = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: AUTHOR.name,
  alternateName: AUTHOR.handle,
  url: `${ORIGIN}/about.html`,
  sameAs: AUTHOR.sameAs,
  jobTitle: 'Developer',
  worksFor: { '@id': `${ORIGIN}/#organization` },
})

const org = () => ({
  '@type': 'Organization',
  '@id': `${ORIGIN}/#organization`,
  name: SITE_NAME,
  url: `${ORIGIN}/`,
  logo: `${ORIGIN}/logo.png`,
  founder: { '@id': PERSON_ID },
})

const app = (updated: string) => ({
  '@type': 'MobileApplication',
  '@id': `${ORIGIN}/download.html#app`,
  name: SITE_NAME,
  description: DESCRIPTION,
  url: `${ORIGIN}/`,
  operatingSystem: `${APK.minAndroid} or later, ${APK.arch}`,
  softwareVersion: APK.version,
  fileSize: `${APK.sizeMB} MB`,
  downloadUrl: `${ORIGIN}${APK.url}`,
  installUrl: `${ORIGIN}${APK.url}`,
  applicationCategory: 'GameApplication',
  dateModified: updated,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@id': PERSON_ID },
  publisher: { '@id': `${ORIGIN}/#organization` },
  featureList: features.map((f) => f.title),
})

const webSite = () => ({
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  url: `${ORIGIN}/`,
  name: SITE_NAME,
  alternateName: 'mini-host',
  description: DESCRIPTION,
  publisher: org(),
  author: { '@id': PERSON_ID },
})

const faqPage = () => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

/** Structured data to inject into each page, keyed by the built HTML filename. */
export function ldFor(file: string, updated: string) {
  switch (file) {
    case 'index.html':
      return [webSite(), app(updated), person()]
    case 'download.html':
      return [app(updated)]
    case 'faq.html':
      return [faqPage()]
    case 'about.html':
      return [org(), person()]
    default:
      return []
  }
}
