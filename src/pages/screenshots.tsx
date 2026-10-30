import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import PageHeader from '../components/PageHeader'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav current="screenshots" />
      <main id="main">
        <PageHeader
          eyebrow="Gallery"
          title="Worlds worth hosting"
          lead="The first three are me and my brothers — the rest is the kind of thing a server like this turns into. Tap any image to view it full size, arrow keys work too."
        />
        <Gallery />
      </main>
      <Footer />
    </>
  )
}

if (typeof document !== 'undefined') {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
