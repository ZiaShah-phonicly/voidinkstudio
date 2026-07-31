import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../utils/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await loginUser({ email, password })
      const auth = JSON.parse(localStorage.getItem('voidink_auth') || '{}')
      navigate(auth.is_staff ? '/admin' : '/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section form-s auth-s">
      <div className="container auth-box">
        <div className="section-label">✦ Account</div>
        <h1 className="section-title">
          Welcome <span className="gt">back</span>
        </h1>
        <p className="section-sub">Log in to your VOIDINK account.</p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="fg">
            <label className="fl" htmlFor="login-email">
              Email *
            </label>
            <input
              id="login-email"
              type="email"
              className="fi"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="fg">
            <label className="fl" htmlFor="login-password">
              Password *
            </label>
            <input
              id="login-password"
              type="password"
              className="fi"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="nav-cta auth-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
