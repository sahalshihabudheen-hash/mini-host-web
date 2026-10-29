import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import PageHeader from '../components/PageHeader'
import Features from '../components/Features'
import Footer from '../components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav current="features" />
    <main id="main">
      <PageHeader
        eyebrow="Features"
        title="Everything a server needs, in your pocket"
        lead="Every feature below ships in the app today — verified against MiniHost itself, not marketing copy."
      />
      <Features />
    </main>
    <Footer />
  </StrictMode>,
)
