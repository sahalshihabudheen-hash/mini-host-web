import { useCallback, useEffect, useState } from 'react'
import { shots, type Shot } from '../data/site'

function GalleryImage({ shot, onOpen }: { shot: Shot; onOpen: () => void }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="shot">
      {failed ? (
        <div className="shot__fallback" role="img" aria-label={shot.alt}>
          <span>Image unavailable</span>
        </div>
      ) : (
        <button
          className="shot__btn"
          onClick={onOpen}
          aria-label={`Open image: ${shot.caption}. ${shot.alt}`}
        >
          <img src={shot.card} alt={shot.alt} loading="lazy" onError={() => setFailed(true)} />
          <figcaption className="shot__caption">{shot.caption}</figcaption>
        </button>
      )}
    </figure>
  )
}

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null)

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? null : (i + d + shots.length) % shots.length)),
    [],
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, close, step])

  const current = index === null ? null : shots[index]

  return (
    <section className="section section--alt">
      <div className="section__inner">
        <div className="gallery">
          {shots.map((s, i) => (
            <GalleryImage key={s.src} shot={s} onOpen={() => setIndex(i)} />
          ))}
        </div>
      </div>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.caption} — enlarged image`}
          onClick={close}
        >
          <button className="lightbox__close" aria-label="Close" onClick={close} autoFocus>
            ✕
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
          >
            ‹
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>
              {current.caption}
              <span className="lightbox__count">
                {index! + 1} / {shots.length}
              </span>
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}
