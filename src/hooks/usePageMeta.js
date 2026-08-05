import { useEffect } from 'react'

/**
 * The SPA ships a single index.html, so per-route <title> and robots rules have
 * to be applied at runtime. Static view-source will still show the homepage
 * tags — nginx sends X-Robots-Tag for /admin so crawlers get the directive
 * without executing JS. Previous values are restored on unmount.
 */
export default function usePageMeta({ title, robots } = {}) {
  useEffect(() => {
    if (!title) return undefined
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])

  useEffect(() => {
    if (!robots) return undefined

    let meta = document.querySelector('meta[name="robots"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }

    const previous = meta.getAttribute('content')
    meta.setAttribute('content', robots)

    return () => {
      if (created) {
        meta.remove()
        return
      }
      if (previous == null) meta.removeAttribute('content')
      else meta.setAttribute('content', previous)
    }
  }, [robots])
}
