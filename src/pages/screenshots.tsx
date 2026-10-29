import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import PageHeader from '../components/PageHeader'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav current="screenshots" />
    <main id="main">
      <PageHeader
        eyebrow="Gallery"
        title="Worlds worth hosting"
        lead="Every survival world is a story waiting to happen. Tap any image to view it full size — arrow keys work too."
      />
      <Gallery />
    </main>
    <Footer />
  </StrictMode>,
)
