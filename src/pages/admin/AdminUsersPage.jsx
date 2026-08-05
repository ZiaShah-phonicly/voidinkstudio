import { useEffect, useState } from 'react'
import { getAuth } from '../../utils/authApi'
import { fetchAdminUsers, updateAdminUser } from '../../utils/adminApi'

function formatWhen(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

function displayName(user) {
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  return name || user.email || '—'
}

export default function AdminUsersPage() {
  const me = getAuth()
  const [users, setUsers] = useState([])
  const [counts, setCounts] = useState({})
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [active, setActive] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const applyUsers = (data) => {
    setUsers(data.users || [])
    setCounts(data.counts || {})
  }

  const loadUsers = async (next = {}) => {
    const nextRole = next.role ?? role
    const nextActive = next.active ?? active
    const nextSearch = next.search ?? search
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminUsers({
        search: nextSearch,
        role: nextRole,
        active: nextActive,
      })
      applyUsers(data)
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchAdminUsers()
      .then((data) => {
        if (!cancelled) applyUsers(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load users')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const onSearch = (event) => {
    event.preventDefault()
    loadUsers({ search })
  }

  const filterRole = (nextRole) => {
    setRole(nextRole)
    setActive('')
    loadUsers({ role: nextRole, active: '' })
  }

  const filterActive = (nextActive) => {
    setActive(nextActive)
    setRole('')
    loadUsers({ role: '', active: nextActive })
  }

  const patchUser = async (user, patch) => {
    setBusyId(user.user_id)
    setError('')
    try {
      const updated = await updateAdminUser(user.user_id, patch)
      setUsers((prev) => prev.map((u) => (u.user_id === updated.user_id ? updated : u)))
      // Refresh counts after flag changes.
      const data = await fetchAdminUsers({ search, role, active })
      applyUsers(data)
    } catch (err) {
      setError(err.message || 'Failed to update user')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-head">
        <div>
          <h1>Users</h1>
          <p>Registered accounts — enable, disable, or grant admin access</p>
        </div>
        <button type="button" className="admin-refresh" onClick={() => loadUsers()} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="admin-stat-grid admin-stat-grid-5">
        <button type="button" className={!role && !active ? 'on' : ''} onClick={() => filterRole('')}>
          <span>All accounts</span>
          <strong>{counts.all || 0}</strong>
        </button>
        <button type="button" className={role === 'staff' ? 'on' : ''} onClick={() => filterRole('staff')}>
          <span>Admins</span>
          <strong>{counts.staff || 0}</strong>
        </button>
        <button type="button" className={role === 'client' ? 'on' : ''} onClick={() => filterRole('client')}>
          <span>Clients</span>
          <strong>{counts.clients || 0}</strong>
        </button>
        <button type="button" className={active === 'true' ? 'on' : ''} onClick={() => filterActive('true')}>
          <span>Active</span>
          <strong>{counts.active || 0}</strong>
        </button>
        <button
          type="button"
          className={active === 'false' ? 'on' : ''}
          onClick={() => filterActive('false')}
        >
          <span>Disabled</span>
          <strong>{counts.disabled || 0}</strong>
        </button>
      </div>

      <div className="admin-filters">
        <form onSubmit={onSearch} className="admin-search">
          <input
            type="search"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-users-table-wrap">
        {loading ? <p className="admin-muted">Loading users…</p> : null}
        {!loading && users.length === 0 ? <p className="admin-muted">No users found.</p> : null}
        {!loading && users.length > 0 ? (
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isMe = me?.user_id === user.user_id || me?.email === user.email
                const busy = busyId === user.user_id
                return (
                  <tr key={user.user_id} className={!user.is_active ? 'is-disabled' : ''}>
                    <td>
                      <div className="admin-user-cell">
                        <strong>
                          {displayName(user)}
                          {isMe ? <span className="admin-you">you</span> : null}
                        </strong>
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${user.is_staff ? 'role-admin' : 'role-client'}`}>
                        {user.is_staff ? 'Admin' : 'Client'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${user.is_active ? 'status-done' : 'status-cancelled'}`}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{formatWhen(user.date_joined)}</td>
                    <td>{formatWhen(user.last_login)}</td>
                    <td>
                      <div className="admin-user-actions">
                        <button
                          type="button"
                          className="admin-action-btn"
                          disabled={busy || isMe}
                          onClick={() => patchUser(user, { is_staff: !user.is_staff })}
                          title={isMe ? 'You cannot change your own admin access' : undefined}
                        >
                          {user.is_staff ? 'Revoke admin' : 'Make admin'}
                        </button>
                        <button
                          type="button"
                          className={`admin-action-btn ${user.is_active ? 'danger' : ''}`}
                          disabled={busy || isMe}
                          onClick={() => patchUser(user, { is_active: !user.is_active })}
                          title={isMe ? 'You cannot disable your own account' : undefined}
                        >
                          {user.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}
