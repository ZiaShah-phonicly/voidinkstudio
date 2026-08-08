import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ImageLightbox({ items = [], index, onClose, onChange }) {
  const total = items.length
  const item = index == null || index < 0 || !total ? null : items[index]
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (item == null) {
      setArmed(false)
      return undefined
    }

    const armId = window.setTimeout(() => setArmed(true), 80)
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
      if (event.key === 'ArrowLeft') onChange?.(((index - 1) % total + total) % total)
      if (event.key === 'ArrowRight') onChange?.(((index + 1) % total + total) % total)
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(armId)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [item, index, total, onClose, onChange])

  if (!item || typeof document === 'undefined') return null

  const go = (nextIndex) => {
    if (!total) return
    onChange?.(((nextIndex % total) + total) % total)
  }

  return createPortal(
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      onClick={() => {
        if (armed) onClose?.()
      }}
    >
      <button type="button" className="lb-close" onClick={onClose} aria-label="Close preview">
        ×
      </button>
      {total > 1 && (
        <button
          type="button"
          className="lb-nav lb-prev"
          onClick={(event) => {
            event.stopPropagation()
            go(index - 1)
          }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}
      <div
        className="lb-card"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <img src={item.image} alt={item.title || 'Portfolio image'} />
        <div className="lb-info">
          <p className="lb-kicker">{item.meta || item.category || 'Portfolio'}</p>
          <h3 id="lb-title">{item.title || 'Work sample'}</h3>
          <p className="lb-desc">
            {item.desc ||
              item.description ||
              `${item.title || 'This piece'} — ${item.meta || item.category || 'VOIDINK Studios work sample'}.`}
          </p>
        </div>
      </div>
      {total > 1 && (
        <button
          type="button"
          className="lb-nav lb-next"
          onClick={(event) => {
            event.stopPropagation()
            go(index + 1)
          }}
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>,
    document.body,
  )
}
