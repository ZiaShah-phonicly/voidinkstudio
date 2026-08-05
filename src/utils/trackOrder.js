import { apiUrl } from './authApi'

/**
 * Public order lookup by tracking ID (e.g. VI-A7K2M9XQ).
 */
export async function trackOrder(trackingId) {
  const code = String(trackingId || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
  if (!code) {
    throw new Error('Enter your tracking ID.')
  }

  const path = code.startsWith('VI-') ? code : `VI-${code}`
  const res = await fetch(apiUrl(`/api/voidink/track/${encodeURIComponent(path)}/`), {
    headers: { Accept: 'application/json' },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Tracking lookup failed (${res.status})`)
  }
  return data.order
}
