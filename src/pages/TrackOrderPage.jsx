import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import JsonLd from '../components/JsonLd'
import usePageMeta from '../hooks/usePageMeta'
import { pageTitle, sitePageSchema } from '../data/seo'
import { trackOrder } from '../utils/trackOrder'

const STATUS_LABELS = {
  new: 'Received',
  reviewing: 'Reviewing',
  quoted: 'Quoted',
  in_progress: 'In progress',
  done: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_HINTS = {
  new: 'We got your request and will review it shortly.',
  reviewing: 'Our team is reviewing your brief and requirements.',
  quoted: 'A quote is ready — we may reach out on email.',
  in_progress: 'Your project is actively being worked on.',
  done: 'Project complete. Thanks for working with VOIDINK.',
  cancelled: 'This order was cancelled. Contact us if you need help.',
}

function formatWhen(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

const TRACK_DESCRIPTION = 'Track your VOIDINK Studios commission with your VI- tracking ID.'

export default function TrackOrderPage() {
  const { trackingId: routeId } = useParams()
  const [searchParams] = useSearchParams()
  const initial = routeId || searchParams.get('id') || ''
  usePageMeta({
    title: pageTitle('Track Order'),
    description: TRACK_DESCRIPTION,
  })

  const [input, setInput] = useState(initial)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(Boolean(initial))

  const lookup = async (raw) => {
    const code = String(raw || '').trim()
    if (!code) {
      setError('Enter your tracking ID.')
      setOrder(null)
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await trackOrder(code)
      setOrder(result)
      setInput(result.tracking_id || code)
    } catch (err) {
      setOrder(null)
      setError(err.message || 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initial) lookup(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  const onSubmit = (event) => {
    event.preventDefault()
    lookup(input)
  }

  const status = order?.status || 'new'
  const customPhase = String(order?.phase || '').trim()
  const workStepKey = customPhase ? 'phase' : 'in_progress'
  const barSteps = [
    { key: 'new', label: STATUS_LABELS.new },
    { key: 'reviewing', label: STATUS_LABELS.reviewing },
    { key: 'quoted', label: STATUS_LABELS.quoted },
    { key: workStepKey, label: customPhase || STATUS_LABELS.in_progress },
    { key: 'done', label: STATUS_LABELS.done },
  ]
  const currentBarStep =
    status === 'in_progress' ? workStepKey : status
  const currentBarIndex = barSteps.findIndex((step) => step.key === currentBarStep)
  const cancelled = status === 'cancelled'
  const statusBadgeLabel =
    status === 'in_progress' && customPhase
      ? customPhase
      : STATUS_LABELS[status] || status.replace('_', ' ')

  return (
    <section className="section track-page">
      <JsonLd
        data={sitePageSchema({
          path: '/track',
          name: pageTitle('Track Order'),
          description: TRACK_DESCRIPTION,
          breadcrumbName: 'Track Order',
        })}
      />
      <div className="container">
        <header className="track-hero">
          <div className="track-hero-copy">
            <nav className="sp-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="sp-breadcrumb-current">Track Order</span>
            </nav>
            <div className="section-label">✦ Project tracking</div>
            <h1 className="section-title">
              Track your <span className="gt">order</span>
            </h1>
            <p className="section-sub">
              Paste the tracking ID from your form confirmation to see live status, package details,
              and progress.
            </p>
          </div>

          <form className="track-search" onSubmit={onSubmit} noValidate>
            <label className="sr-only" htmlFor="track-id">
              Tracking ID
            </label>
            <input
              id="track-id"
              className="track-search-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="VI-A7K2M9XQ"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="track-search-btn" disabled={loading}>
              {loading ? 'Looking up…' : 'Track order'}
            </button>
          </form>
          {error ? (
            <p className="track-error" role="alert">
              {error}
            </p>
          ) : null}
        </header>

        {order ? (
          <div className="track-panel">
            <div className="track-panel-top">
              <div>
                <p className="track-kicker">Tracking ID</p>
                <h2 className="track-id">{order.tracking_id}</h2>
                <p className="track-hint">{STATUS_HINTS[status] || ''}</p>
                {customPhase ? (
                  <div className="track-current-phase">
                    <span className="track-current-phase-label">Current phase</span>
                    <strong>{customPhase}</strong>
                  </div>
                ) : null}
              </div>
              <span className={`track-status status-${status}`}>
                {statusBadgeLabel}
              </span>
            </div>

            {!cancelled ? (
              <ol className="track-steps" aria-label="Order progress">
                {barSteps.map((step, index) => {
                  const done = currentBarIndex >= 0 && index <= currentBarIndex
                  const current = step.key === currentBarStep
                  return (
                    <li key={step.key} className={`${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                      <span className="track-dot" aria-hidden="true" />
                      <span className="track-step-label">{step.label}</span>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <p className="track-cancelled">{STATUS_HINTS.cancelled}</p>
            )}

            <div className="track-grid">
              <div className="track-card">
                <h3>Order details</h3>
                <dl className="track-dl">
                  <div>
                    <dt>Name</dt>
                    <dd>{order.name || '—'}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{order.email || '—'}</dd>
                  </div>
                  <div>
                    <dt>Service</dt>
                    <dd>{order.service || '—'}</dd>
                  </div>
                  <div>
                    <dt>Package</dt>
                    <dd>{order.package || '—'}</dd>
                  </div>
                  <div>
                    <dt>Price / budget</dt>
                    <dd>{order.price || order.budget || '—'}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{order.deadline || '—'}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatWhen(order.created_at)}</dd>
                  </div>
                  <div>
                    <dt>Last update</dt>
                    <dd>{formatWhen(order.updated_at)}</dd>
                  </div>
                </dl>
              </div>

              <div className="track-card track-card-brief">
                <h3>Project brief</h3>
                <p>{order.description || 'No brief was provided with this order.'}</p>
                <p className="track-help">
                  Need changes? Email{' '}
                  <a href="mailto:support@voidinkstudios.com">support@voidinkstudios.com</a> with your
                  tracking ID, or <Link to="/#query">submit a new query</Link>.
                </p>
              </div>
            </div>
          </div>
        ) : !loading && !error ? (
          <div className="track-empty">
            <p>Your order status will show up here after you track an ID.</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
