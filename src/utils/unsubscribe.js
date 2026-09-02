import { apiUrl } from './authApi'

/**
 * Public opt-out from VOIDINK cold outreach emails.
 */
export async function unsubscribeEmail(email) {
  const addr = String(email || '').trim().toLowerCase()
  if (!addr) {
    throw new Error('Enter your email address.')
  }

  const res = await fetch(apiUrl('/api/voidink/unsubscribe/'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: addr }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Unsubscribe failed (${res.status})`)
  }
  return data
}
