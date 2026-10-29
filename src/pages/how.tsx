import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import PageHeader from '../components/PageHeader'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav current="how" />
    <main id="main">
      <PageHeader
        eyebrow="How it works"
        title="From download to first join"
        lead="The whole path is guided by the app itself — here is what it looks like, step by step."
      />
      <HowItWorks />
      <section className="section cta cta--tight">
        <div className="section__inner cta__inner">
          <h2>That’s the whole setup</h2>
          <p>Download MiniHost and your server can be live in minutes.</p>
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
