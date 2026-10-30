import { APK } from '../data/site'
import { AUTHOR } from '../data/seo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <a className="brand" href="/index.html" aria-label="Back to home">
          <img className="brand__logo" src="/logo.png" alt="" width="32" height="32" />
          <span className="brand__word">
            Mini<span className="brand__accent">Host</span>
          </span>
        </a>
        <nav className="footer__links" aria-label="Footer">
          <a href="/features.html">Features</a>
          <a href="/screenshots.html">Screenshots</a>
          <a href="/how.html">How it works</a>
          <a href="/faq.html">FAQ</a>
          <a href="/about.html">About &amp; Contact</a>
          <a href="/download.html">Download APK</a>
          <a href={APK.url} download={APK.name}>
            APK v{APK.version}
          </a>
        </nav>
        <p className="footer__legal">
          © {new Date().getFullYear()} MiniHost — built by{' '}
          <a href="/about.html">{AUTHOR.name}</a>, who goes by {AUTHOR.handle}. Not affiliated with,
          endorsed by, or associated with Mojang or Microsoft.
        </p>
      </div>
    </footer>
  )
}
