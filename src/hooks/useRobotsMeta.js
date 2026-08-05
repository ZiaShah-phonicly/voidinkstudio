import { useEffect } from 'react'

/**
 * SPA shares one index.html, so route-level robots must be set at runtime.
 * Restores the previous meta content on unmount.
 */
export default function useRobotsMeta(content) {
  useEffect(() => {
    if (!content) return undefined

    let meta = document.querySelector('meta[name="robots"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
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
  }, [content])
}
