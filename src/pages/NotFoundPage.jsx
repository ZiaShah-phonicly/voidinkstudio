import { Link, useLocation } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFoundPage() {
  const location = useLocation()
  const path = location.pathname

  usePageMeta({
    title: 'Page Not Found — VOIDINK Studios',
    robots: 'noindex, nofollow',
    description: 'This page does not exist on VOIDINK Studios.',
    canonical: 'none',
  })

  return (
    <section className="nf-page" aria-labelledby="nf-title">
      <div className="container nf-inner">
        <p className="section-label">✦ 404</p>
        <p className="nf-code" aria-hidden="true">
          404
        </p>
        <h1 id="nf-title" className="section-title">
          Lost in the <span className="gt">void</span>
        </h1>
        <p className="section-sub nf-sub">
          This page doesn&apos;t exist — or it drifted off into the dark. The link may be old, mistyped, or never
          belonged here.
        </p>
        {path && path !== '/' ? (
          <p className="nf-path">
            Requested: <code>{path}</code>
          </p>
        ) : null}
        <div className="nf-actions">
          <Link to="/" className="nav-cta">
            Back to Home
          </Link>
          <Link to="/#services" className="nav-cta nav-cta-ghost">
            Browse Services
          </Link>
          <Link to="/track" className="nav-cta nav-cta-ghost">
            Track Order
          </Link>
          <Link to="/faq" className="nav-cta nav-cta-ghost">
            FAQ
          </Link>
        </div>
      </div>
    </section>
  )
}
