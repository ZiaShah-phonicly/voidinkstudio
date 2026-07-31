import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getAuth } from '../../utils/authApi'
import { adminLogin } from '../../utils/adminApi'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const existing = getAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (existing?.access && existing.is_staff) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await adminLogin({ email, password })
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-shell admin-login-shell">
      <div className="admin-login-card">
        <p className="admin-kicker">Team access</p>
        <h1>VOIDINK Admin</h1>
        <p className="admin-sub">Sign in to review order form submissions.</p>

        <form onSubmit={onSubmit} className="admin-form">
          <label>
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Enter admin'}
          </button>
        </form>

        <p className="admin-foot">
          <Link to="/">← Back to site</Link>
        </p>
      </div>
    </div>
  )
}
