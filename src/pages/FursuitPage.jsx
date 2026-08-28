import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import Reveal, { RevealItem } from '../components/Reveal'
import PricingCard from '../components/PricingCard'
import ImageLightbox from '../components/ImageLightbox'
import LazyVideo from '../components/LazyVideo'
import ServiceCardBg from '../components/ServiceCardBg'
import useOutsideClose from '../hooks/useOutsideClose'
import usePageMeta from '../hooks/usePageMeta'
import JsonLd from '../components/JsonLd'
import { pageTitle, serviceDefinition, serviceMetaDescription, servicePageSchema } from '../data/seo'
import { getRelatedServices, getServiceBySlug } from '../data/serviceDetails'
import { getServiceGallery, isVideoSrc } from '../data/serviceGalleries'
import { getFursuitFormServiceForPackage, pricingCategories } from '../data/voidinkData'
import NotFoundPage from './NotFoundPage'

const ORDER_STORAGE_KEY = 'voidink_pending_order'
const FURSUIT_SLUG = 'fursuits'

export default function FursuitPage() {
  const navigate = useNavigate()
  const { setCursorHover = () => {}, setChatOpen = () => {} } = useOutletContext() ?? {}
  const [openFaq, setOpenFaq] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const faqListRef = useRef(null)
  const service = getServiceBySlug(FURSUIT_SLUG)

  usePageMeta({
    title: service ? pageTitle(service.title) : undefined,
    description: service ? serviceMetaDescription(service) : undefined,
  })

  const closeFaq = useCallback(() => setOpenFaq(null), [])
  useOutsideClose(faqListRef, openFaq !== null, closeFaq)

  if (!service) {
    return <NotFoundPage />
  }

  const pricing = pricingCategories.find((cat) => cat.id === service.pricingCategoryId)
  const related = getRelatedServices(service.slug)
  const gallery = getServiceGallery(FURSUIT_SLUG)
  const fursuitLd = servicePageSchema(service, { path: `/services/${FURSUIT_SLUG}` })

  const goToContact = (event) => {
    event.preventDefault()
    navigate('/#query')
  }

  const handleOrderClick = (event, order) => {
    event.preventDefault()
    const payload = {
      ...order,
      service: getFursuitFormServiceForPackage(order.packageName) || service.formService,
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

  const headline = service.heroHeadline

  return (
    <main id="main-content" className="service-page fursuit-page">
      <JsonLd data={fursuitLd} />
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
                <p className="section-label">{service.heroEyebrow || '✦ Custom Fursuit Commissions'}</p>
              </div>
            </div>

            <h1 className="sp-title">
              {headline ? (
                <>
                  {headline.before}
                  <span className="gt">{headline.accent}</span>
                  {headline.after}
                </>
              ) : (
                service.title
              )}
            </h1>
            {service.tagline && <p className="sp-tagline">{service.tagline}</p>}
            <p className="sp-overview">
              Key takeaway: {service.overview}
            </p>
            {service.trustLine && <p className="sp-trust-line">{service.trustLine}</p>}

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
                <span>Shipping</span>
                <strong>DHL Express</strong>
              </div>
            </div>

            <div className="hero-act sp-hero-actions">
              <a href="/#query" className="bp" onClick={goToContact}>
                Get a Free Quote <span aria-hidden="true">→</span>
              </a>
              <a href="#fursuit-packages" className="bs">
                View Packages
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
                {serviceDefinition(service)} First-hand samples on{' '}
                <a href="https://x.com/voidinkstudios" target="_blank" rel="noopener noreferrer">
                  X @voidinkstudios
                </a>{' '}
                and{' '}
                <a href="https://www.instagram.com/voidinkstudios/" target="_blank" rel="noopener noreferrer">
                  Instagram @voidinkstudios
                </a>
                .
              </p>
            </Reveal>
            <div className="shot-g sp-shot-g">
              {gallery.map((item, index) => (
                <RevealItem
                  key={`${item.image}-${item.title}`}
                  as="button"
                  type="button"
                  delay={index * 40}
                  className="shot shot-open"
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                  onClick={() => setLightboxIndex(index)}
                  onContextMenu={(event) => event.preventDefault()}
                >
                  <span className="shot-media">
                    {isVideoSrc(item.image) ? (
                      <LazyVideo src={item.image} ariaLabel={item.title || 'Portfolio video'} />
                    ) : (
                      <img
                        src={item.image}
                        alt={
                          item.title
                            ? `${item.title} — ${service.title} sample`
                            : `${service.title} portfolio sample`
                        }
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        onContextMenu={(event) => event.preventDefault()}
                        onDragStart={(event) => event.preventDefault()}
                      />
                    )}
                    <span className="shot-hover">{isVideoSrc(item.image) ? 'Play' : 'View shot'}</span>
                  </span>
                  <span className="shot-info">
                    <span className="shot-text">
                      <span className="shot-name">{item.title}</span>
                      {item.meta ? <span className="shot-meta">{item.meta}</span> : null}
                    </span>
                  </span>
                </RevealItem>
              ))}
            </div>
          </div>
        </section>
      )}

      <ImageLightbox
        items={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />

      {pricing && (
        <section className="section sp-pricing" id="fursuit-packages">
          <div className="container">
            <Reveal>
              <div className="section-label">✦ Fursuit Packages</div>
              <h2 className="section-title">
                Heads, partials & <span className="gt">full suits</span>
              </h2>
              <p className="section-sub">
                {serviceDefinition(service)} Best for: head (first suit), partial (cons), full suit (performers).
                First-hand examples and WIP screenshots on{' '}
                <a href="https://x.com/voidinkstudios" target="_blank" rel="noopener noreferrer">
                  X @voidinkstudios
                </a>
                {' '}and{' '}
                <a href="https://www.instagram.com/voidinkstudios/" target="_blank" rel="noopener noreferrer">
                  Instagram @voidinkstudios
                </a>
                .
              </p>
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
            <p className="legal-note legal-note-center">
              All packages subject to our <Link to="/terms-of-service">Terms of Service</Link>.
            </p>
          </div>
        </section>
      )}

      {service.addons?.length > 0 && (
        <section className="section sp-addons" style={{ background: 'var(--bg2)' }}>
          <div className="container">
            <Reveal>
              <div className="section-label">✦ Customization Add-Ons</div>
              <h2 className="section-title">
                Extra details, <span className="gt">your way</span>
              </h2>
            </Reveal>
            <div className="sp-addon-list">
              {service.addons.map((addon, index) => (
                <RevealItem key={addon.name} delay={index * 50} className="sp-addon-row">
                  <span>{addon.name}</span>
                  <span className="sp-addon-dots" aria-hidden="true" />
                  <strong>{addon.price}</strong>
                </RevealItem>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section sp-process">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ How We Craft Your Suit</div>
            <h2 className="section-title">
              From reference to <span className="gt">finished fursona</span>
            </h2>
            <p className="section-sub">How to commission: Design → Sculpt → Fur → Finish.</p>
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

      {service.faqs?.length > 0 && (
        <section id="faq" className="section sp-faq" style={{ background: 'var(--bg2)' }}>
          <div className="container">
            <Reveal>
              <div className="section-label">✦ Fursuit FAQ</div>
              <h2 className="section-title">
                Common questions about <span className="gt">fursuit commissions</span>
              </h2>
              <p className="section-sub">
                Looking for more?{' '}
                <Link to="/faq" className="sp-faq-more">
                  View all FAQs
                </Link>
              </p>
            </Reveal>

            <div className="sp-faq-list" ref={faqListRef}>
              {service.faqs.map((faq, index) => {
                const open = openFaq === index
                return (
                  <RevealItem as="div" key={faq.q} delay={index * 80} className={`faq-acc${open ? ' active' : ''}`}>
                    <h3 className="faq-acc-heading">
                      <button
                        type="button"
                        className="faq-acc-q"
                        aria-expanded={open}
                        onClick={() => setOpenFaq(open ? null : index)}
                      >
                        <span className="faq-acc-text">{faq.q}</span>
                        <span className="faq-acc-icon" aria-hidden="true" />
                      </button>
                    </h3>
                    <div className="faq-acc-a">
                      <div>
                        <div className="faq-acc-a-inner">
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {service.trustSignals?.length > 0 && (
        <section className="section sp-trust-signals">
          <div className="container">
            <Reveal>
              <div className="section-label">✦ Why Choose VOIDINK for Your Suit?</div>
              <h2 className="section-title">
                Built for collectors & <span className="gt">performers</span>
              </h2>
              <p className="section-sub">
                Use cases: fursona debuts, conventions, and content — when you need a wearable character, not just art.
              </p>
            </Reveal>
            <div className="sp-trust-grid">
              {service.trustSignals.map((item, index) => (
                <RevealItem key={item.title} delay={index * 60} className="sp-trust-card">
                  <span className="sp-trust-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </RevealItem>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section sp-related" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Related Services</div>
            <h2 className="section-title">
              Design the character, <span className="gt">then the suit</span>
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
                <ServiceCardBg
                  slug={item.slug}
                  fallbackImage={item.cardImage}
                  delayMs={index * 280}
                  alt={`${item.title} portfolio sample`}
                />
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
                {service.cta?.eyebrow || '✦ Ready to Become Your Fursona?'}
              </div>
              <h2 className="section-title">
                {service.cta?.title || 'Commission slots open soon'}
              </h2>
              <p className="section-sub">{service.cta?.subtitle || 'Join our waitlist or inquire now.'}</p>
              {service.cta?.contacts?.length > 0 && (
                <ul className="sp-cta-contacts">
                  {service.cta.contacts.map((contact) => (
                    <li key={contact.value}>
                      <a href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                        <span aria-hidden="true">{contact.icon}</span> {contact.value}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/#query" className="bp" onClick={goToContact}>
                  {service.cta?.buttonLabel || 'Get a Free Quote'} <span aria-hidden="true">→</span>
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
