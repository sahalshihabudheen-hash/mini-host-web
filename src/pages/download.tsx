import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import Download from '../components/Download'
import Footer from '../components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav current="download" />
    <main id="main">
      <Download />
    </main>
    <Footer />
  </StrictMode>,
)
