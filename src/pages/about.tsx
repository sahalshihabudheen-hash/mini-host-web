import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import Nav from '../components/Nav'
import PageHeader from '../components/PageHeader'
import DiscordCard from '../components/DiscordCard'
import ReportForm from '../components/ReportForm'
import Footer from '../components/Footer'
import { AUTHOR } from '../data/seo'

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav current="about" />
      <main id="main">
        <PageHeader
          eyebrow="About & Contact"
          title="One developer, one server in your pocket"
          lead={`MiniHost is built and maintained solo by ${AUTHOR.name} — the same person who answers when you report a bug.`}
        />

        <section className="section">
          <div className="section__inner about">
            <div className="about__prose">
              <h2>Who is behind MiniHost</h2>
              <p>
                MiniHost is built by <strong>{AUTHOR.name}</strong>, who goes by{' '}
                <strong>{AUTHOR.handle}</strong> — the same name you will see on the GitHub
                repositories, the APK releases and the Discord replies. It is a one-person project:
                the app, this website and the support inbox are all written and maintained by the
                same developer, so there is no team to be passed around when something breaks.
              </p>
              <h2>Why it exists</h2>
              <p>
                Hosting a Minecraft server normally means leaving a PC running, or pasting shell
                commands into Termux and hoping nothing breaks. MiniHost removes all of that: the app
                downloads its own Java runtime, installs Paper, and starts the world on the phone you
                already carry.
              </p>
              <p>
                Everything on this site was written from the app itself rather than from a marketing
                brief, so if a feature is listed it ships. Where something could not be confirmed, the
                FAQ says so instead of guessing.
              </p>
              <h2>What happens to your message</h2>
              <p>
                The form below posts straight into the developer&rsquo;s Discord — no mailing list, no
                ticket system, and nothing is stored on this website. The fastest route is still the{' '}
                <strong>“Suggestion or bug?”</strong> option inside the app, because it can attach the
                exact server logs involved.
              </p>
              <p className="about__note">
                Please do not use this form to share passwords, IP addresses or anything else private.
              </p>
            </div>

            <aside className="about__side">
              <h2 className="about__side-title">Live now</h2>
              <DiscordCard />
            </aside>
          </div>
        </section>

        <section className="section section--alt">
          <div className="section__inner">
            <p className="section__eyebrow">Send a report</p>
            <h2 className="section__title">Suggestion, bug, or anything else</h2>
            <p className="section__lead">
              One box, straight to Discord. Screenshots cannot be attached here — for those, use the
              in-app option.
            </p>
            <ReportForm />
          </div>
        </section>
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
