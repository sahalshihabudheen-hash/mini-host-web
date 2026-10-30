import { useState } from 'react'
import { faqs } from '../data/site'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section section--alt">
      <div className="section__inner faq__inner">
        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
                <h3>
                  <button
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq__chevron" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                {/* The answer stays in the markup and is hidden by the browser's
                    [hidden] rule: collapsed-by-default accordions otherwise leave
                    search engines with only the first answer to read. */}
                <p id={`faq-a-${i}`} className="faq__a" hidden={!isOpen}>
                  {f.a}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
