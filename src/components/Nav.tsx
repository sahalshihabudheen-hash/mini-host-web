import { useEffect, useState } from 'react'
import { APK } from '../data/site'

const links = [
  { href: '/index.html', label: 'Home', page: 'home' },
  { href: '/features.html', label: 'Features', page: 'features' },
  { href: '/screenshots.html', label: 'Screenshots', page: 'screenshots' },
  { href: '/how.html', label: 'How it works', page: 'how' },
  { href: '/faq.html', label: 'FAQ', page: 'faq' },
  { href: '/about.html', label: 'About', page: 'about' },
]

export default function Nav({ current }: { current: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a className="brand" href="/index.html" aria-label="MiniHost home">
          <img className="brand__logo" src="/logo.png" alt="" width="40" height="40" />
          <span className="brand__word">
            Mini<span className="brand__accent">Host</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} aria-current={l.page === current ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--primary nav__download" href="/download.html">
          Download APK
        </a>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="nav__mobile">
          <nav aria-label="Mobile">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="/download.html" onClick={() => setOpen(false)}>
              Download APK
            </a>
          </nav>
          <a className="btn btn--primary" href={APK.url} download={APK.name} onClick={() => setOpen(false)}>
            Get {APK.version} now
          </a>
        </div>
      )}
    </header>
  )
}
