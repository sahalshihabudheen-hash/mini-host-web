import { APK } from '../data/site'

export default function Download() {
  return (
    <section className="section download">
      <div className="download__bg" aria-hidden="true" />
      <div className="section__inner download__inner">
        <div className="download__copy">
          <p className="section__eyebrow">Download</p>
          <h2 className="section__title">Get MiniHost for Android</h2>
          <p className="download__lead">
            MiniHost is a free Android app that turns your phone into a Minecraft: Java Edition
            server — with plugins, backups, crossplay and a tunnel for friends, all in one APK.
          </p>

          <div className="download__card">
            <div className="download__appinfo">
              <img src="/logo.png" alt="MiniHost logo" width="56" height="56" />
              <div>
                <p className="download__appname">MiniHost</p>
                <p className="download__appmeta">
                  v{APK.version} · {APK.sizeMB} MB · {APK.minAndroid}+ · {APK.arch}
                </p>
              </div>
            </div>
            <a className="btn btn--primary btn--lg download__btn" href={APK.url} download={APK.name}>
              Download APK
            </a>
            <p className="download__note">
              Only download MiniHost from a source you trust — this page serves the APK directly,
              with no redirects or third-party downloaders.
            </p>
          </div>
        </div>

        <div className="download__install">
          <h3>Installing on Android</h3>
          <ol>
            <li>
              Tap <strong>Download APK</strong> and wait for the file to finish.
            </li>
            <li>
              Open the downloaded file. Android may ask you to allow installing apps from this
              source (your browser or file manager) — approve it, since MiniHost isn’t from an app
              store.
            </li>
            <li>Confirm the install, then open MiniHost and follow the first-time setup.</li>
          </ol>
          <p>
            Later, when the app offers an update, you can install it from inside MiniHost itself —
            you’ll see what’s new before you confirm.
          </p>
        </div>
      </div>
    </section>
  )
}
