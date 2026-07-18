import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Reveal, { RevealItem } from '../components/Reveal'
import PricingCard from '../components/PricingCard'
import { getRelatedServices, getServiceBySlug } from '../data/serviceDetails'
import { getServiceGallery } from '../data/serviceGalleries'
import { pricingCategories } from '../data/voidinkData'

const ORDER_STORAGE_KEY = 'voidink_pending_order'

export default function ServicePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { setCursorHover = () => {}, setChatOpen = () => {} } = useOutletContext() ?? {}
  const service = getServiceBySlug(slug)

  if (!service) {
    return <Navigate to="/" replace />
  }

  const pricing = pricingCategories.find((cat) => cat.id === service.pricingCategoryId)
  const related = getRelatedServices(service.slug)
  const gallery = getServiceGallery(service.slug)

  const goToContact = (event) => {
    event.preventDefault()
    navigate('/#query')
  }

  const handleOrderClick = (event, order) => {
    event.preventDefault()
    const payload = {
      ...order,
      service: service.formService,
      categoryId: pricing?.id || service.pricingCategoryId,
      categoryLabel: pricing?.label || service.title,
    }
    try {
      sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }
    navigate({ pathname: '/', hash: 'query' }, { state: { order: payload } })
  }

  return (
    <main id="main-content" className="service-page">
      <section className="sp-hero">
        <div className="sp-hero-bg" style={{ background: service.gradient }} aria-hidden="true" />
        <div className="container">
          <nav className="sp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/#services">Services</Link>
            <span aria-hidden="true">/</span>
            <span className="sp-breadcrumb-current">{service.title}</span>
          </nav>

          <div className="sp-hero-inner">
            <div className="sp-hero-head">
              <div className="sp-hero-icon" aria-hidden="true">
                {service.icon}
              </div>
              <div className="sp-hero-intro">
                {service.isNew && <span className="sp-new-badge">NEW SERVICE</span>}
                <p className="section-label">✦ Service Details</p>
              </div>
            </div>

            <h1 className="sp-title">{service.title}</h1>
            <p className="sp-tagline">{service.tagline}</p>
            <p className="sp-overview">{service.overview}</p>

            <div className="sp-meta">
              <div className="sp-meta-item">
                <span>Starting at</span>
                <strong>{service.startingPrice}</strong>
              </div>
              <div className="sp-meta-item">
                <span>Turnaround</span>
                <strong>{service.turnaround}</strong>
              </div>
              <div className="sp-meta-item">
                <span>Focus</span>
                <strong>Results-Driven</strong>
              </div>
            </div>

            <div className="hero-act sp-hero-actions">
              <a href="/#query" className="bp" onClick={goToContact}>
                Get Quote <span aria-hidden="true">→</span>
              </a>
              <a href="/#query" className="bs" onClick={goToContact}>
                Start Project
              </a>
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section sp-gallery">
          <div className="container">
            <Reveal>
              <div className="section-label">✦ Portfolio</div>
              <h2 className="section-title">
                {service.title} <span className="gt">work samples</span>
              </h2>
              <p className="section-sub">
                Recent samples for this service — real project looks and style directions we ship for clients.
              </p>
            </Reveal>
            <div className="shot-g sp-shot-g">
              {gallery.map((item, index) => (
                <RevealItem
                  key={`${item.image}-${item.title}`}
                  delay={index * 40}
                  className="shot"
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                >
                  <div className="shot-media">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                    <span className="shot-hover">View shot</span>
                  </div>
                  <div className="shot-info">
                    <div className="shot-text">
                      <h3>{item.title}</h3>
                      <p>{item.meta}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section sp-highlights" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">
              Why choose our <span className="gt">{service.title.split(' ')[0]}</span> service
            </h2>
          </Reveal>
          <div className="sp-highlight-grid">
            {service.highlights.map((item, index) => (
              <RevealItem key={item} delay={index * 60} className="sp-highlight-card">
                <span className="sp-check">✓</span>
                <p>{item}</p>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section sp-details">
        <div className="container sp-detail-grid">
          <Reveal>
            <div className="sp-detail-block">
              <h3>What's Included</h3>
              <ul className="sp-list">
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="sp-detail-block">
              <h3>Deliverables</h3>
              <ul className="sp-list">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="sp-detail-block">
              <h3>Ideal For</h3>
              <ul className="sp-list">
                {service.idealFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section sp-process" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Our Process</div>
            <h2 className="section-title">
              How we deliver <span className="gt">{service.title.toLowerCase()}</span>
            </h2>
          </Reveal>
          <div className="pr-g">
            {service.process.map((step, index) => (
              <RevealItem
                key={step.step}
                delay={index * 70}
                className="pr-c"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <div className="pr-n">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {pricing && (
        <section className="section sp-pricing">
          <div className="container">
            <Reveal>
              <div className="section-label">✦ Pricing</div>
              <h2 className="section-title">
                {service.title} <span className="gt">packages</span>
              </h2>
              <p className="section-sub">Fixed delivery times and 100% ownership rights on every package.</p>
            </Reveal>
            <div className="pg">
              {pricing.packages.map((pkg, index) => (
                <PricingCard
                  key={pkg.name}
                  pkg={pkg}
                  categoryId={pricing.id}
                  categoryLabel={pricing.label}
                  delay={index * 70}
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                  onOrder={handleOrderClick}
                  onChat={() => setChatOpen(true)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section sp-faq" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <div className="section-label">✦ FAQ</div>
            <h2 className="section-title">
              Common questions about <span className="gt">{service.title.toLowerCase()}</span>
            </h2>
          </Reveal>
          <div className="sp-faq-grid">
            {service.faqs.map((faq, index) => (
              <RevealItem key={faq.q} delay={index * 70} className="sp-faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section sp-related">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Related Services</div>
            <h2 className="section-title">
              Explore more <span className="gt">services</span>
            </h2>
          </Reveal>
          <div className="sv-g">
            {related.map((item, index) => (
              <RevealItem
                key={item.slug}
                as={Link}
                to={`/services/${item.slug}`}
                delay={index * 70}
                className="sv-c sv-c-link"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                {item.cardImage && (
                  <img className="sv-shadow" src={item.cardImage} alt="" aria-hidden="true" loading="lazy" />
                )}
                {item.isNew && <div className="sv-new">NEW</div>}
                <div className="sv-i" aria-hidden="true">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.shortText}</p>
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-s">
        <div className="container">
          <Reveal>
            <div className="cta-b">
              <div className="section-label" style={{ justifyContent: 'center' }}>
                ✦ Ready to Start
              </div>
              <h2 className="section-title">
                Let's build your <span className="gt">{service.title.toLowerCase()}</span> project
              </h2>
              <p className="section-sub">Tell us about your vision — we respond within 2 hours.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/#query" className="bp" onClick={goToContact}>
                  Start a Project <span aria-hidden="true">→</span>
                </a>
                <Link to="/#services" className="bs">
                  View All Services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
