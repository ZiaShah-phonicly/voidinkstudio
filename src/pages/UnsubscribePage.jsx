import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import JsonLd from '../components/JsonLd'
import Reveal from '../components/Reveal'
import usePageMeta from '../hooks/usePageMeta'
import { pageTitle, sitePageSchema } from '../data/seo'
import { unsubscribeEmail } from '../utils/unsubscribe'

const DESCRIPTION =
  'Unsubscribe from VOIDINK Studios outreach emails. We will not send you further cold outreach messages.'

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  usePageMeta({
    title: pageTitle('Unsubscribe'),
    description: DESCRIPTION,
    robots: 'noindex, follow',
  })

  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail)
  }, [initialEmail])

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await unsubscribeEmail(email)
      setDone(true)
    } catch (err) {
      setDone(false)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="main-content" className="unsub-page">
      <JsonLd
        data={sitePageSchema({
          path: '/unsubscribe',
          name: pageTitle('Unsubscribe'),
          description: DESCRIPTION,
          breadcrumbName: 'Unsubscribe',
        })}
      />

      <section className="unsub-hero">
        <div className="unsub-hero-bg" aria-hidden="true" />
        <div className="container">
          <nav className="sp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="sp-breadcrumb-current">Unsubscribe</span>
          </nav>

          <Reveal>
            <p className="section-label">✦ Email preferences</p>
            <h1 className="unsub-title">
              Unsubscribe from <span className="gt">outreach</span>
            </h1>
            <p className="unsub-sub">
              Enter the email address that received our message. We will stop sending you cold outreach
              from VOIDINK Studios. Commission updates and replies to your own inquiries are not affected.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section unsub-body">
        <div className="container">
          <Reveal className="unsub-card">
            {done ? (
              <div className="unsub-success">
                <div className="unsub-success-icon" aria-hidden="true">
                  ✓
                </div>
                <h2>You&apos;re unsubscribed</h2>
                <p>
                  <strong>{email.trim().toLowerCase()}</strong> will not receive further VOIDINK outreach
                  emails. It may take a short time for our system to sync.
                </p>
                <Link to="/" className="btn btn-primary unsub-home-btn">
                  Back to VOIDINK Studios
                </Link>
              </div>
            ) : (
              <form className="unsub-form" onSubmit={onSubmit} noValidate>
                <label htmlFor="unsub-email">Email address</label>
                <input
                  id="unsub-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error ? <p className="unsub-error">{error}</p> : null}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving…' : 'Unsubscribe'}
                </button>
                <p className="unsub-fine">
                  This only opts you out of unsolicited outreach. If you contacted us first or have an active
                  commission, we may still reply about that project.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  )
}
