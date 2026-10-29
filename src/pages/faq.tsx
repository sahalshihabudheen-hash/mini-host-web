import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import PageHeader from '../components/PageHeader'
import Faq from '../components/Faq'
import Footer from '../components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav current="faq" />
    <main id="main">
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered"
        lead="The honest version — if something isn’t confirmed, it says so."
      />
      <Faq />
    </main>
    <Footer />
  </StrictMode>,
)
