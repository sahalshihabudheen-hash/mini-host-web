import { useEffect, useState, type CSSProperties } from 'react'
import { APK, shots } from '../data/site'

const ROTATE_MS = 7000

/**
 * Both banner crops are handed to CSS as custom properties and the stylesheet picks one
 * at the 720px breakpoint. Choosing in JavaScript instead made a phone fetch the desktop
 * banner on first paint and the phone banner a moment later.
 */
const slideVars = (s: (typeof shots)[number]) =>
  ({
    '--hero-desktop': `url(${s.hero})`,
    '--hero-phone': `url(${s.heroMobile})`,
  }) as CSSProperties

export default function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const motionOk =
    typeof window !== 'undefined' &&
    (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (paused || !motionOk) return
    const t = setInterval(() => setActive((i) => (i + 1) % shots.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, motionOk])

  const current = shots[active]

  return (
    <section id="home" className="hero">
      <div className="hero__stage">
        {shots.map((s, i) => (
          <div
            key={s.src}
            className={`hero__slide ${i === active ? 'hero__slide--active' : ''}`}
            style={slideVars(s)}
            aria-hidden={i === active ? undefined : 'true'}
          />
        ))}
        <div className="hero__scrim" aria-hidden="true" />

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
                <span className="btn__meta">
                  v{APK.version} · {APK.sizeMB} MB
                </span>
              </a>
              <a className="btn btn--ghost btn--lg" href="/features.html">
                Explore Features
              </a>
            </div>
          </div>
        </div>

        <div
          className="hero__rail"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <p className="hero__caption">{current.caption}</p>
          <div className="hero__thumbs" role="group" aria-label="Choose a banner image">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={`hero__thumb ${i === active ? 'hero__thumb--active' : ''}`}
                style={{ backgroundImage: `url(${s.thumb})` }}
                aria-label={s.caption}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
