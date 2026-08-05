import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import SiteFooter from '../../components/SiteFooter'
import SiteHeader from '../../components/SiteHeader'
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
    <div className="admin-shell">
      <SiteHeader />
      <main className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <p className="admin-kicker">Staff access only</p>
            <h1>
              VOIDINK <span className="gt">Admin</span>
            </h1>
            <p className="admin-sub">Sign in to review order form submissions.</p>
          </div>

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

          <p className="admin-login-note">
            This is the official VOIDINK Studios staff portal on <strong>voidinkstudios.com</strong>. Never enter your
            VOIDINK password on any other site.
          </p>

          <p className="admin-foot">
            <Link to="/">← Back to site</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
