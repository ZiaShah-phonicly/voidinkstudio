import { apiUrl, authHeaders, getAuth, loginUser } from './authApi'

export async function adminLogin(payload) {
  const data = await loginUser(payload)
  if (!data.is_staff) {
    throw new Error(
      `${data.email} is a client account, not a team admin. Ask an admin to grant portal access.`,
    )
  }
  return data
}

export async function fetchAdminCrm({ search = '' } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  params.set('limit', '200')

  const res = await fetch(`${apiUrl('/api/admin/crm/')}?${params}`, {
    headers: authHeaders(),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to load CRM (${res.status})`)
  }
  return data
}

export async function fetchAdminCrmDeal(dealId) {
  const res = await fetch(apiUrl(`/api/admin/crm/deals/${dealId}/`), {
    headers: authHeaders(),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to load deal (${res.status})`)
  }
  return data
}

export async function updateAdminCrmDealStage(dealId, stage) {
  const res = await fetch(apiUrl(`/api/admin/crm/deals/${dealId}/`), {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ stage }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to update deal (${res.status})`)
  }
  return data.deal
}

export async function fetchAdminOrders({ status = '', search = '' } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (search) params.set('search', search)
  params.set('limit', '200')

  const res = await fetch(`${apiUrl('/api/admin/orders/')}?${params}`, {
    headers: authHeaders(),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to load orders (${res.status})`)
  }
  return data
}

export async function fetchAdminOrder(orderId) {
  const res = await fetch(apiUrl(`/api/admin/orders/${orderId}/`), {
    headers: authHeaders(),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to load order (${res.status})`)
  }
  return data.order
}

export async function updateAdminOrderStatus(orderId, status) {
  const res = await fetch(apiUrl(`/api/admin/orders/${orderId}/status/`), {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to update status (${res.status})`)
  }
  return data.order
}

export async function fetchAdminUsers({ search = '', role = '', active = '' } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (role) params.set('role', role)
  if (active) params.set('active', active)
  params.set('limit', '200')

  const res = await fetch(`${apiUrl('/api/admin/users/')}?${params}`, {
    headers: authHeaders(),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to load users (${res.status})`)
  }
  return data
}

export async function updateAdminUser(userId, patch) {
  const res = await fetch(apiUrl(`/api/admin/users/${userId}/`), {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(patch),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Failed to update user (${res.status})`)
  }
  return data.user
}

export function requireStaffAuth() {
  const auth = getAuth()
  if (!auth?.access || !auth.is_staff) return null
  return auth
}
