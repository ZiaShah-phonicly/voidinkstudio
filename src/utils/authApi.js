/**
 * Voidink API base URL.
 * Local: VITE_API_URL=http://127.0.0.1:8002  (or empty to use Vite /api proxy)
 */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

const AUTH_KEY = 'voidink_auth'

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuth(data) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      access: data.access,
      refresh: data.refresh,
      user_id: data.user_id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      is_staff: data.is_staff,
      is_superuser: data.is_superuser,
    }),
  )
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function authHeaders() {
  const auth = getAuth()
  if (!auth?.access) return { 'Content-Type': 'application/json', Accept: 'application/json' }
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${auth.access}`,
  }
}

export async function registerUser(payload) {
  const res = await fetch(apiUrl('/api/register/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Register failed (${res.status})`)
  }
  setAuth(data)
  return data
}

export async function loginUser(payload) {
  const res = await fetch(apiUrl('/api/login/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Login failed (${res.status})`)
  }
  setAuth(data)
  return data
}
