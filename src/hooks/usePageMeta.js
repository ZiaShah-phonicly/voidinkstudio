import { useEffect } from 'react'

const CANONICAL_NONE = 'none'

function applyMetaContent(selector, attrName, attrValue, content) {
  let meta = document.querySelector(selector)
  const created = !meta
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attrName, attrValue)
    document.head.appendChild(meta)
  }

  const previous = meta.getAttribute('content')
  meta.setAttribute('content', content)

  return () => {
    if (created) {
      meta.remove()
      return
    }
    if (previous == null) meta.removeAttribute('content')
    else meta.setAttribute('content', previous)
  }
}

/**
 * The SPA ships a single index.html, so per-route title/robots/description/
 * canonical have to be applied at runtime. Static view-source will always show
 * the homepage tags — nginx also sends X-Robots-Tag for /admin so crawlers get
 * the directive without executing JS. Previous values are restored on unmount.
 *
 * Pass canonical: 'none' to drop the tag entirely (correct for noindex pages).
 */
export default function usePageMeta({ title, robots, description, canonical } = {}) {
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
    return applyMetaContent('meta[name="robots"]', 'name', 'robots', robots)
  }, [robots])

  useEffect(() => {
    if (!description) return undefined
    return applyMetaContent('meta[name="description"]', 'name', 'description', description)
  }, [description])

  useEffect(() => {
    if (!canonical) return undefined

    const link = document.querySelector('link[rel="canonical"]')
    if (!link) return undefined

    const previous = link.getAttribute('href')
    if (canonical === CANONICAL_NONE) {
      link.remove()
    } else {
      link.setAttribute('href', canonical)
    }

    return () => {
      if (canonical === CANONICAL_NONE) {
        link.setAttribute('href', previous)
        document.head.appendChild(link)
        return
      }
      if (previous == null) link.removeAttribute('href')
      else link.setAttribute('href', previous)
    }
  }, [canonical])
}
