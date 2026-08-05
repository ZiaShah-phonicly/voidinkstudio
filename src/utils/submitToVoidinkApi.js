/**
 * Saves Voidink form to Django/MongoDB backend (email-linked user + inquiry).
 * Used alongside Google Sheets — sheet stays; DB gets a linked copy.
 *
 * Local (Vite proxy): leave VITE_API_URL empty → posts to /api/... on same origin
 * Direct / production: VITE_API_URL=http://127.0.0.1:8000  (or your API host)
 */
export async function submitToVoidinkApi(payload) {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  const url = base ? `${base}/api/voidink/submit/` : '/api/voidink/submit/'

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: payload.name || '',
      email: payload.email || '',
      service: payload.service || '',
      package: payload.package || '',
      price: payload.price || '',
      budget: payload.budget || '',
      deadline: payload.deadline || '',
      description: payload.description || '',
      references: payload.references || '',
      source: 'voidink_website',
    }),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok || (data && data.ok === false)) {
    throw new Error((data && data.error) || `API error (${res.status})`)
  }

  return data
}
