const paths: Record<string, string> = {
  server: 'M4 4h16v6H4zM4 14h16v6H4z M7 7h.01M7 17h.01',
  phone: 'M7 2h10v20H7zM11 18h2',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9z',
  bridge: 'M3 20h18M6 20V9l6-5 6 5v11M10 20v-5h4v5',
  puzzle: 'M10 4h4v2a2 2 0 104 0h2v4h-2a2 2 0 100 4h2v4h-4v-2a2 2 0 10-4 0v2H6v-4h2a2 2 0 100-4H6V6h4z',
  cube: 'M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12L3 7M12 12v10',
  shield: 'M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5zM12 8v6',
  wand: 'M5 19L17 7M15 5l2 2M19 3l1 1-2 2-1-1zM7 17l2 2',
}

function Icon({ name }: { name: string }) {
  return (
    <svg className="feature__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name] ?? paths.server} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

import { features } from '../data/site'

export default function Features() {
  return (
    <section className="section">
      <div className="section__inner">
        <div className="features__grid">
          {features.map((f) => (
            <article key={f.title} className="feature">
              <Icon name={f.icon} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
