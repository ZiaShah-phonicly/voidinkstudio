import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function LegalPageShell({ label, title, breadcrumb, subtitle, updated, children }) {
  return (
    <main id="main-content" className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero-bg" aria-hidden="true" />
        <div className="container">
          <nav className="sp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="sp-breadcrumb-current">{breadcrumb}</span>
          </nav>

          <Reveal>
            <p className="section-label">{label}</p>
            <h1 className="legal-title">{title}</h1>
            {subtitle ? <p className="legal-subtitle">{subtitle}</p> : null}
            {updated ? <p className="legal-updated">Last updated: {updated}</p> : null}
          </Reveal>
        </div>
      </section>

      <section className="section legal-body">
        <div className="container">{children}</div>
      </section>
    </main>
  )
}
