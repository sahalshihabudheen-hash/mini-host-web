import { APK } from '../data/site'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__tag">Minecraft: Java Edition · Paper server · On Android</p>
          <h1 className="hero__title">
            Your Minecraft Server.
            <br />
            Your Phone.
            <br />
            <span className="hero__title-accent">Your World.</span>
          </h1>
          <p className="hero__sub">
            Discover MiniHost, an Android app designed to make hosting Minecraft servers from your
            phone easier. No PC, no Termux — just a phone, Wi-Fi, and your imagination.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={APK.url} download={APK.name}>
              Download APK
              <span className="btn__meta">v{APK.version} · {APK.sizeMB} MB</span>
            </a>
            <a className="btn btn--ghost btn--lg" href="/features.html">
              Explore Features
            </a>
          </div>
          <ul className="hero__proof">
            <li>Runs Paper servers</li>
            <li>Friends join over the internet</li>
            <li>Bedrock crossplay via Geyser</li>
          </ul>
        </div>

        <div className="hero__mock" aria-hidden="true">
          <div className="phone">
            <div className="phone__notch" />
            <div className="phone__screen">
              <div className="phone__status">
                <span>12:30</span>
                <span className="phone__status-right">▮▮▮ 87%</span>
              </div>
              <div className="phone__app">
                <div className="phone__apphead">
                  <img src="/logo.png" alt="" width="26" height="26" />
                  <span>
                    Mini<span className="text-green">Host</span>
                  </span>
                  <span className="phone__dot" />
                </div>
                <div className="phone__card">
                  <p className="phone__label">Server control</p>
                  <p className="phone__servername">My Survival World</p>
                  <div className="phone__btnrow">
                    <span className="phone__btn phone__btn--start">Start server</span>
                  </div>
                  <p className="phone__hint">Share the address that appears with your friends</p>
                </div>
                <div className="phone__card phone__console">
                  <p className="phone__label">Console</p>
                  <p className="phone__line">[Server] Done (3.412s)!</p>
                  <p className="phone__line">[App] Tunnel connected</p>
                  <p className="phone__line phone__line--green">Steve joined the game</p>
                </div>
              </div>
            </div>
          </div>
          <p className="hero__mocknote">Illustration of the app — not a screenshot.</p>
        </div>
      </div>
    </section>
  )
}
