import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

const pages = [
  {
    title: 'Features',
    text: 'Paper servers, tunnels, Bedrock crossplay, Modrinth plugins, schematics and backups.',
    href: '/features.html',
    cta: 'See all features',
  },
  {
    title: 'Screenshots',
    text: 'A look at the worlds and moments MiniHost is made for.',
    href: '/screenshots.html',
    cta: 'Open the gallery',
  },
  {
    title: 'How it works',
    text: 'From downloading the APK to your first friend joining — four steps.',
    href: '/how.html',
    cta: 'Walk through it',
  },
  {
    title: 'FAQ',
    text: 'Requirements, data use, mods and the honest answers to the common questions.',
    href: '/faq.html',
    cta: 'Read the FAQ',
  },
]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav current="home" />
    <main id="main">
      <Hero />

      <section className="section">
        <div className="section__inner">
          <p className="section__eyebrow">Explore</p>
          <h2 className="section__title">Pick where to start</h2>
          <p className="section__lead">
            Everything has its own page — no endless scrolling to find it.
          </p>
          <div className="features__grid">
            {pages.map((p) => (
              <article key={p.href} className="feature feature--link">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <a className="feature__cta" href={p.href}>
                  {p.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="section__inner cta__inner">
          <h2>Ready to host your world?</h2>
          <p>One APK. Five megabytes. Your own Minecraft server.</p>
          <div className="hero__actions cta__actions">
            <a className="btn btn--primary btn--lg" href="/download.html">
              Download MiniHost
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </StrictMode>,
)
