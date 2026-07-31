import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../utils/authApi'

const empty = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await registerUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        source: 'voidink_website',
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section form-s auth-s">
      <div className="container auth-box">
        <div className="section-label">✦ Account</div>
        <h1 className="section-title">
          Create your <span className="gt">account</span>
        </h1>
        <p className="section-sub">Register to track projects and stay connected with VOIDINK.</p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="fr">
            <div className="fg">
              <label className="fl" htmlFor="reg-first">
                First name *
              </label>
              <input
                id="reg-first"
                type="text"
                className="fi"
                required
                autoComplete="given-name"
                value={form.first_name}
                onChange={update('first_name')}
                placeholder="John"
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="reg-last">
                Last name *
              </label>
              <input
                id="reg-last"
                type="text"
                className="fi"
                required
                autoComplete="family-name"
                value={form.last_name}
                onChange={update('last_name')}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="fg">
            <label className="fl" htmlFor="reg-email">
              Email *
            </label>
            <input
              id="reg-email"
              type="email"
              className="fi"
              required
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
          </div>
          <div className="fg">
            <label className="fl" htmlFor="reg-password">
              Password *
            </label>
            <input
              id="reg-password"
              type="password"
              className="fi"
              required
              minLength={6}
              autoComplete="new-password"
              value={form.password}
              onChange={update('password')}
              placeholder="At least 6 characters"
            />
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="nav-cta auth-submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
