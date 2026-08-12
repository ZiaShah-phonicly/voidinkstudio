import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import GoldTubesBackground from '../components/GoldTubesBackground'
import PricingCard from '../components/PricingCard'
import Reveal, { RevealItem } from '../components/Reveal'
import ImageLightbox from '../components/ImageLightbox'
import ServiceCardBg from '../components/ServiceCardBg'
import useOutsideClose from '../hooks/useOutsideClose'
import usePageMeta from '../hooks/usePageMeta'
import JsonLd from '../components/JsonLd'
import { homeFaqPreview } from '../data/faqData'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_DATE_MODIFIED,
  breadcrumbSchema,
  faqPageSchema,
  graphSchema,
  webPageSchema,
} from '../data/seo'
import { submitToGoogleSheet } from '../utils/submitToGoogleSheet'
import { submitToVoidinkApi } from '../utils/submitToVoidinkApi'
import {
  budgetOptions,
  CUSTOM_PACKAGE,
  deadlineOptions,
  findFormPackageOption,
  formServices,
  fursuitBudgetOptions,
  fursuitSuitTypes,
  getFormPackagesForService,
  getFursuitFormServiceForPackage,
  getFursuitPackageForFormService,
  getFursuitSuitTypeForPackage,
  isFursuitFormService,
  marqueeItems,
  pricingCategories,
  pricingCategoryToFormService,
  processSteps,
  services,
  studioStats,
  studioStatsCopy,
  testimonials,
  workItems,
} from '../data/voidinkData'

const emptyForm = {
  name: '',
  email: '',
  service: '',
  package: '',
  price: '',
  budget: '',
  deadline: '',
  description: '',
  references: '',
  species: '',
  suitType: '',
  referenceSheet: '',
  fursuitBudget: '',
}

const ORDER_STORAGE_KEY = 'voidink_pending_order'

const heroStats = [
  { value: studioStats.projects, suffix: '+', label: 'Projects Delivered' },
  { value: studioStats.clients, suffix: '+', label: `clients in ${studioStats.countries} countries` },
  { value: studioStats.services, suffix: '+', label: 'Creative Services' },
  { value: studioStats.satisfaction, suffix: '%', label: 'Satisfaction Rate' },
]

function StatCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    let frameId = 0
    let timerId = 0
    let started = false

    const run = () => {
      if (started) return
      started = true
      const durationMs = 1200
      const start = performance.now()

      const tick = (now) => {
        const t = Math.min(1, (now - start) / durationMs)
        // ease-out so the final value lands cleanly
        const eased = 1 - (1 - t) ** 3
        const next = Math.round(target * eased)
        setCount(t >= 1 ? target : next)
        if (t < 1) frameId = requestAnimationFrame(tick)
      }

      frameId = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run()
      },
      { threshold: 0.2 },
    )

    observer.observe(el)

    // If already on-screen (common on desktop), don't wait forever on IO quirks
    timerId = window.setTimeout(() => {
      const rect = el.getBoundingClientRect()
      const visible = rect.top < window.innerHeight && rect.bottom > 0
      if (visible) run()
    }, 400)

    return () => {
      observer.disconnect()
      window.clearTimeout(timerId)
      cancelAnimationFrame(frameId)
    }
  }, [target])

  return (
    <div ref={ref}>
      <p className="hero-st-value">
        {count}
        {suffix}
      </p>
    </div>
  )
}

export default function HomePage() {
  const { setCursorHover = () => {}, setChatOpen = () => {} } = useOutletContext() ?? {}
  const navigate = useNavigate()
  const location = useLocation()
  const [pricingTab, setPricingTab] = useState('web')
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [openFaq, setOpenFaq] = useState(null)
  const [workLightboxIndex, setWorkLightboxIndex] = useState(null)
  const homeFaqRef = useRef(null)

  const closeHomeFaq = useCallback(() => setOpenFaq(null), [])
  useOutsideClose(homeFaqRef, openFaq !== null, closeHomeFaq)
  usePageMeta({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  })

  const isCustomPackage = formData.package === CUSTOM_PACKAGE
  const showPackagePrice = Boolean(formData.package && formData.package !== CUSTOM_PACKAGE)
  const servicePackages = getFormPackagesForService(formData.service)
  const isFursuit = isFursuitFormService(formData.service)

  const updateForm = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'service') {
        // Switching service resets package/price so the right options show.
        next.package = ''
        next.price = ''
        next.budget = ''
        next.species = ''
        next.suitType = ''
        next.referenceSheet = ''
        next.fursuitBudget = ''
        if (isFursuitFormService(value)) {
          const mappedPackage = getFursuitPackageForFormService(value)
          next.package = mappedPackage
          next.suitType = getFursuitSuitTypeForPackage(mappedPackage)
          if (mappedPackage && mappedPackage !== CUSTOM_PACKAGE) {
            const matched = findFormPackageOption(value, mappedPackage)
            next.price = matched?.price || ''
          }
        }
      }
      if (field === 'suitType' && isFursuitFormService(prev.service)) {
        const mappedPackage =
          value === 'Head'
            ? 'Custom Head'
            : value === 'Partial'
              ? 'Partial Suit'
              : value === 'Full'
                ? 'Full Suit'
                : CUSTOM_PACKAGE
        next.package = mappedPackage
        next.service = getFursuitFormServiceForPackage(mappedPackage)
        if (mappedPackage === CUSTOM_PACKAGE) {
          next.price = ''
        } else {
          const matched = findFormPackageOption(next.service, mappedPackage)
          next.price = matched?.price || ''
          next.budget = ''
        }
      }
      if (field === 'package' && value === CUSTOM_PACKAGE) {
        next.price = ''
      }
      return next
    })
  }

  const buildOrderDescription = (order, packageLabel) => {
    const lines = [
      `I want to order: ${packageLabel}`,
      `Price: ${order.price || 'N/A'}`,
    ]
    if (order.desc) lines.push(`About this package: ${order.desc}`)

    const featureList = Array.isArray(order.features)
      ? order.features.filter(Boolean)
      : []
    if (featureList.length) {
      lines.push('Includes:')
      featureList.forEach((feature) => lines.push(`• ${feature}`))
    }

    lines.push('')
    lines.push('Extra details / notes:')
    return lines.join('\n')
  }

  const applyOrderToForm = (order) => {
    if (!order) return
    let service =
      order.service ||
      pricingCategoryToFormService[order.categoryId] ||
      ''
    // Keep package value aligned with dropdown options (e.g. "Starter", "Reference Sheet (SFW)")
    const packageValue = order.packageName || CUSTOM_PACKAGE
    if (order.categoryId === 'fursuit' || isFursuitFormService(service)) {
      service = getFursuitFormServiceForPackage(packageValue)
    }
    const matched = findFormPackageOption(service, packageValue)
    const packageLabel = order.categoryLabel
      ? `${order.categoryLabel} — ${packageValue}`
      : packageValue

    let description = buildOrderDescription(
      {
        ...order,
        price: order.price || matched?.price || '',
        desc: order.desc || matched?.desc || '',
        features: order.features || matched?.features || [],
      },
      packageLabel || 'Selected package',
    )
    if (order.brief) {
      description = `${description}\n${order.brief}`
    }

    setFormData((prev) => ({
      ...prev,
      service,
      package: packageValue,
      price: order.price || matched?.price || '',
      budget: '',
      description: '',  // Leave description blank for user to fill in
      suitType: isFursuitFormService(service) ? getFursuitSuitTypeForPackage(packageValue) : '',
      species: order.species || '',
      referenceSheet: order.referenceSheet || '',
      fursuitBudget: '',
    }))
  }

  useEffect(() => {
    let order = location.state?.order
    if (!order) {
      try {
        const raw = sessionStorage.getItem(ORDER_STORAGE_KEY)
        if (raw) {
          order = JSON.parse(raw)
          sessionStorage.removeItem(ORDER_STORAGE_KEY)
        }
      } catch {
        // ignore bad storage
      }
    }
    if (order) {
      applyOrderToForm(order)
      if (location.state?.order) {
        navigate('.', { replace: true, state: null })
      }
    }
  }, [location.state, navigate])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFormSubmitting(true)

    const packageValue = formData.package || CUSTOM_PACKAGE
    const priceValue = showPackagePrice ? formData.price : ''
    const budgetValue = isFursuit
      ? isCustomPackage
        ? formData.fursuitBudget || formData.budget
        : formData.fursuitBudget || formData.price || formData.budget
      : isCustomPackage
        ? formData.budget
        : formData.price || formData.budget

    const fursuitNotes = isFursuit
      ? [
          formData.species && `Species: ${formData.species}`,
          formData.suitType && `Suit Type: ${formData.suitType}`,
          formData.referenceSheet && `Reference Sheet: ${formData.referenceSheet}`,
          formData.fursuitBudget && `Budget Range: ${formData.fursuitBudget}`,
        ].filter(Boolean)
      : []
    const description = fursuitNotes.length
      ? `${fursuitNotes.join('\n')}\n\n${formData.description}`
      : formData.description
    const references = [formData.references, isFursuit ? formData.referenceSheet : '']
      .filter(Boolean)
      .join(' | ')

    try {
      const formPayload = {
        name: formData.name,
        email: formData.email,
        service: formData.service,
        package: packageValue,
        price: priceValue || budgetValue || '',
        budget: budgetValue || '',
        deadline: formData.deadline,
        description,
        references,
      }

      // Temporary: sheet-only mode (VITE_FORM_USE_API=false). Flip to true when Mongo/API is ready again.
      const useApi = String(import.meta.env.VITE_FORM_USE_API || '').toLowerCase() === 'true'
      let result = null

      if (useApi) {
        try {
          result = await submitToVoidinkApi(formPayload)
        } catch (apiError) {
          console.warn('Voidink API submit failed, falling back to Google Sheet:', apiError)
          const sheetResult = await submitToGoogleSheet(formPayload)
          if (sheetResult?.status === 'skipped') {
            throw new Error(
              'Could not save your request right now. Please email support@voidinkstudios.com or try again.',
            )
          }
        }
      } else {
        const sheetResult = await submitToGoogleSheet(formPayload)
        if (sheetResult?.status === 'skipped') {
          throw new Error(
            'Form is not configured yet. Please email support@voidinkstudios.com.',
          )
        }
      }

      const nextTrackingId = result?.tracking_id || result?.order?.tracking_id || ''

      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
      if (webhookUrl) {
        const content = [
          'New VOIDINK Form Submission',
          `Tracking ID: ${nextTrackingId || 'N/A'}`,
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Service: ${formData.service}`,
          `Package: ${packageValue}`,
          `Price: ${priceValue || 'N/A'}`,
          `Budget: ${budgetValue || 'N/A'}`,
          `Deadline: ${formData.deadline || 'N/A'}`,
          `Description: ${description}`,
          `References: ${references || 'None'}`,
        ].join('\n')

        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          })
        } catch (discordError) {
          console.warn('Discord notify failed (order still saved):', discordError)
        }
      }

      setFormSuccess(true)
      setFormData(emptyForm)
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Please email support@voidinkstudios.com')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleAnchorClick = (event, href) => {
    if (href === '#') return
    event.preventDefault()
    const id = href.replace('#', '')
    navigate({ pathname: '/', hash: id })
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleOrderClick = (event, order) => {
    event.preventDefault()
    applyOrderToForm(order)
    navigate({ pathname: '/', hash: 'query' })
    setTimeout(() => document.getElementById('query')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const activePricing = pricingCategories.find((cat) => cat.id === pricingTab) ?? pricingCategories[0]
  const featuredWork = workItems.filter((item) => item.featured).slice(0, 6)

  return (
    <div className="home-page">
      <JsonLd
        data={graphSchema(
          webPageSchema({
            path: '/',
            name: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            dateModified: SITE_DATE_MODIFIED,
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }]),
          faqPageSchema(homeFaqPreview),
        )}
      />
      <GoldTubesBackground />
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb ho1" />
          <div className="hero-orb ho2" />
          <div className="hero-orb ho3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-side-left" aria-hidden="true">
          <div className="side-line" />
          <div className="side-dot" />
          <div className="side-text">VOIDINK STUDIOS</div>
          <div className="side-dot" style={{ animationDelay: '1s' }} />
          <div className="side-line" />
        </div>
        <div className="hero-side-right" aria-hidden="true">
          <div className="side-line" />
          <div className="side-dot" style={{ animationDelay: '0.5s', background: 'var(--pink)' }} />
          <div className="side-text">ART • DESIGN • CODE</div>
          <div className="side-dot" style={{ animationDelay: '1.5s', background: 'var(--blue)' }} />
          <div className="side-line" />
        </div>
        <div className="hero-vis" aria-hidden="true">
          <div className="hr hr1">
            <div className="hrd" />
          </div>
          <div className="hr hr2">
            <div className="hrd" style={{ background: 'var(--pink)' }} />
          </div>
          <div className="hr hr3">
            <div className="hrd" style={{ background: 'var(--blue)' }} />
          </div>
          <div className="hero-center-glow" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hbd" aria-hidden="true" />
              Open for commissions • {studioStatsCopy.trustedBy}!
            </div>
            <div className="hero-ey">✦ World-Class Art, Design & Development Studio</div>
            <h1 className="hero-t" id="hero-title">
              Art, Logo &amp; Web — Born From The <span className="vt">VOID</span>
            </h1>
            <div className="hero-tg">— Where Imagination Has No Limits —</div>
            <p className="hero-takeaway">
              <strong>Key takeaway:</strong> VOIDINK Studios is a remote creative and technology studio for brands,
              creators, startups, and streamers who need custom logos, comic art, AI agents, websites, and apps —
              transparent packages from $39 with full ownership on delivery.
            </p>
            <p className="hero-d">
              In short: we help indie creators, streamers, startups, and established brands worldwide ship
              pixel-perfect art and production-ready tech — from first brief to final files. Explore our process on{' '}
              <a href="https://www.instagram.com/voidinkstudios/" target="_blank" rel="noopener noreferrer">
                Instagram @voidinkstudios
              </a>
              .
            </p>
            <p className="hero-updated">
              <time dateTime={SITE_DATE_MODIFIED}>Last updated August 12, 2026</time>
            </p>
            <div className="hero-act">
              <a href="#query" className="bp" onClick={(e) => handleAnchorClick(e, '#query')}>
                Get Quote <span aria-hidden="true">→</span>
              </a>
              <a href="#query" className="bs" onClick={(e) => handleAnchorClick(e, '#query')}>
                Start Project
              </a>
            </div>
            <div className="hero-trust">
              {/* <div className="trust-badge">
                <span style={{ fontSize: '0.85rem' }} aria-hidden="true">
                  🛡️
                </span>
                <div>
                  <div className="trust-score" style={{ fontSize: '0.75rem' }}>
                    100% Money-Back Guarantee
                  </div>
                </div>
              </div> */}
              <div className="trust-badge">
                <span style={{ fontSize: '0.85rem' }} aria-hidden="true">
                  🌍
                </span>
                <div>
                  <div className="trust-score" style={{ fontSize: '0.75rem' }}>
                    {studioStatsCopy.clientsCountriesTitle}
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-st">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <StatCounter target={stat.value} suffix={stat.suffix} />
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mq" aria-hidden="true">
        <div className="mq-w">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={`${item}-${index}`} className="mq-i">
              {item} <span className="mq-d" />
            </div>
          ))}
        </div>
      </div>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Our Services</div>
              <h2 className="section-title" id="services-title">
                {studioStats.services} Creative & tech services <br />
                <span className="gt">under one roof</span>
              </h2>
            <p className="section-sub">
              Built for brands, creators, startups, and streamers — from pixel-perfect art to AI-powered products under
              one studio.
            </p>
          </Reveal>
          <div className="sv-g">
            {services.map((service, index) => (
              <RevealItem
                key={service.title}
                as={Link}
                to={`/services/${service.slug}`}
                delay={index * 70}
                className="sv-c sv-c-link"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <ServiceCardBg
                  slug={service.slug}
                  fallbackImage={service.cardImage}
                  delayMs={index * 280}
                  alt={`${service.title} portfolio sample`}
                />
                {service.isNew && <div className="sv-new">NEW</div>}
                <div className="sv-i" aria-hidden="true">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Selected Work</div>
            <h2 className="section-title">
              Selected work across <span className="gt">web, apps & design</span>
            </h2>
            <p className="section-sub">
              A snapshot of our best projects. Explore each service page for the full portfolio.
            </p>
          </Reveal>

          <div className="shot-g">
            {featuredWork.map((item, index) => (
              <RevealItem
                key={item.id}
                as="button"
                type="button"
                delay={index * 40}
                className="shot shot-open"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                onClick={() => setWorkLightboxIndex(index)}
              >
                <span className="shot-media">
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <span className="shot-hover">View shot</span>
                </span>
                <span className="shot-info">
                  <span className="shot-text">
                    <span className="shot-name">{item.title}</span>
                    <span className="shot-meta">{item.meta}</span>
                  </span>
                </span>
              </RevealItem>
            ))}
          </div>
          <ImageLightbox
            items={featuredWork}
            index={workLightboxIndex}
            onClose={() => setWorkLightboxIndex(null)}
            onChange={setWorkLightboxIndex}
          />

          <Reveal>
            <div className="work-more">
              <p>Want to see more work samples?</p>
              <a href="#services" className="bs" onClick={(e) => handleAnchorClick(e, '#services')}>
                Browse Services &amp; Portfolios <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="process">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Our Process</div>
            <h2 className="section-title">
              How we bring ideas <span className="gt">to life</span>
            </h2>
            <p className="section-sub">
              Direct answer: every project follows four steps — Discovery, Concept, Refine, and Deliver — so you know
              what happens after you submit a brief.
            </p>
          </Reveal>
          <div className="pr-g">
            {processSteps.map((step, index) => (
              <RevealItem
                key={step.num}
                delay={index * 70}
                className="pr-c"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <div className="pr-n">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Pricing</div>
            <h2 className="section-title">
              Transparent pricing, <span className="gt">no surprises</span>
            </h2>
            <p className="section-sub">Clear packages, fixed delivery times, and 100% ownership rights.</p>
          </Reveal>
          <Reveal>
            <div className="pt-tabs" role="tablist">
              {pricingCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={pricingTab === cat.id}
                  className={`pt-tab ${pricingTab === cat.id ? 'a' : ''}`}
                  onClick={() => setPricingTab(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="pc a">
            <div className="pg">
              {activePricing.packages.map((pkg, index) => (
                <PricingCard
                  key={pkg.name}
                  pkg={pkg}
                  categoryId={activePricing.id}
                  categoryLabel={activePricing.label}
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
        </div>
      </section>

      <section className="section sp-faq home-faq" id="home-faq">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ FAQ</div>
            <h2 className="section-title">
              Frequently Asked <span className="gt">Questions</span>
            </h2>
            <p className="section-sub">Quick answers to the questions clients ask most before starting a project.</p>
          </Reveal>

          <div className="sp-faq-list" ref={homeFaqRef}>
            {homeFaqPreview.map((faq, index) => {
              const open = openFaq === index
              return (
                <RevealItem as="div" key={faq.q} delay={index * 70} className={`faq-acc${open ? ' active' : ''}`}>
                  <button
                    type="button"
                    className="faq-acc-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span className="faq-acc-text">
                      <h3 className="faq-acc-heading">{faq.q}</h3>
                    </span>
                    <span className="faq-acc-icon" aria-hidden="true" />
                  </button>
                  <div className="faq-acc-a" inert={!open}>
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

          <Reveal>
            <div className="work-more">
              <Link to="/faq" className="bs">
                View All FAQs <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="testimonials">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Reviews</div>
            <h2 className="section-title">
              What clients <span className="gt">say about us</span>
            </h2>
            <p className="section-sub">
              Bottom line: clients hire VOIDINK for clear communication, on-time delivery, and final files they fully
              own.
            </p>
          </Reveal>
          <div className="tm-g">
            {testimonials.map((item, index) => (
              <RevealItem
                key={item.name}
                delay={index * 70}
                className="tm-c"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <div className="tm-s">{item.stars}</div>
                <p className="tm-t">{item.text}</p>
                <div className="tm-a">
                  <div className="tm-av">{item.initials}</div>
                  <div>
                    <div className="tm-n">{item.name}</div>
                    <div className="tm-r">{item.role}</div>
                    {item.meta && <div className="tm-meta">{item.meta}</div>}
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section form-s" id="query">
        <div className="container">
          <Reveal>
            <div className="section-label">✦ Get In Touch</div>
            <h2 className="section-title">
              Tell us about <span className="gt">your project</span>
            </h2>
            <p className="section-sub">Fill out the form and we'll respond Asap!</p>
          </Reveal>
          <div className="fm-g">
            <Reveal>
              <form id="qf" onSubmit={handleFormSubmit} noValidate>
                <div className="fr">
                  <div className="fg">
                    <label className="fl" htmlFor="fn">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="fi"
                      id="fn"
                      placeholder="John Doe"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={updateForm('name')}
                    />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fe">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="fi"
                      id="fe"
                      placeholder="john@example.com"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={updateForm('email')}
                    />
                  </div>
                </div>
                <div className="fg">
                  <label className="fl" htmlFor="fsv">
                    Service *
                  </label>
                  <select className="fsl" id="fsv" required value={formData.service} onChange={updateForm('service')}>
                    <option value="">Select service...</option>
                    {formServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl" htmlFor="fpkg">
                    Package *
                  </label>
                  <select
                    className="fsl"
                    id="fpkg"
                    required
                    value={formData.package || ''}
                    disabled={!formData.service}
                    onChange={(event) => {
                      const value = event.target.value
                      if (value === CUSTOM_PACKAGE || value === '') {
                        setFormData((prev) => ({
                          ...prev,
                          package: value,
                          price: '',
                          budget: value === CUSTOM_PACKAGE ? prev.budget : '',
                          ...(isFursuitFormService(prev.service)
                            ? {
                                service: getFursuitFormServiceForPackage(value),
                                suitType: getFursuitSuitTypeForPackage(value),
                              }
                            : {}),
                        }))
                        return
                      }
                      const matched =
                        servicePackages.find((opt) => opt.value === value) ||
                        findFormPackageOption(formData.service, value)
                      setFormData((prev) => ({
                        ...prev,
                        package: value,
                        price: matched?.price || '',
                        budget: '',
                        ...(isFursuitFormService(prev.service)
                          ? {
                              service: getFursuitFormServiceForPackage(value),
                              suitType: getFursuitSuitTypeForPackage(value),
                            }
                          : {}),
                      }))
                    }}
                  >
                    <option value="">
                      {formData.service ? 'Select package...' : 'Select a service first...'}
                    </option>
                    <option value={CUSTOM_PACKAGE}>{CUSTOM_PACKAGE}</option>
                    {servicePackages.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} — {opt.price}
                      </option>
                    ))}
                    {/* Keep Order Now / legacy values selectable if not in current list */}
                    {formData.package &&
                      formData.package !== CUSTOM_PACKAGE &&
                      !servicePackages.some((opt) => opt.value === formData.package) && (
                        <option value={formData.package}>{formData.package}</option>
                      )}
                  </select>
                  {showPackagePrice && (
                    <p className="form-hint">Price auto-filled from our packages — switch to Custom for a quote.</p>
                  )}
                  {formData.service && servicePackages.length === 0 && (
                    <p className="form-hint">No fixed packages for this service — choose Custom / Need a quote.</p>
                  )}
                </div>
                {isFursuit && (
                  <>
                    <div className="fr">
                      <div className="fg">
                        <label className="fl" htmlFor="fspecies">
                          Species
                        </label>
                        <input
                          type="text"
                          className="fi"
                          id="fspecies"
                          placeholder="Wolf, fox, dragon..."
                          value={formData.species}
                          onChange={updateForm('species')}
                        />
                      </div>
                      <div className="fg">
                        <label className="fl" htmlFor="fsuit">
                          Suit Type
                        </label>
                        <select className="fsl" id="fsuit" value={formData.suitType} onChange={updateForm('suitType')}>
                          <option value="">Select type...</option>
                          {fursuitSuitTypes.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="fg">
                      <label className="fl" htmlFor="frefsheet">
                        Reference Sheet (link)
                      </label>
                      <input
                        type="text"
                        className="fi"
                        id="frefsheet"
                        placeholder="https://... or Google Drive / FurAffinity link"
                        value={formData.referenceSheet}
                        onChange={updateForm('referenceSheet')}
                      />
                    </div>
                  </>
                )}
                {showPackagePrice ? (
                  <div className="fr">
                    <div className="fg">
                      <label className="fl" htmlFor="fprice">
                        Package Price
                      </label>
                      <input
                        type="text"
                        className="fi"
                        id="fprice"
                        value={formData.price}
                        readOnly
                        aria-readonly="true"
                      />
                    </div>
                    <div className="fg">
                      <label className="fl" htmlFor="fd">
                        Deadline
                      </label>
                      <select className="fsl" id="fd" value={formData.deadline} onChange={updateForm('deadline')}>
                        <option value="">Select timeline...</option>
                        {deadlineOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="fr">
                    <div className="fg">
                      <label className="fl" htmlFor={isFursuit ? 'fb-fursuit' : 'fb'}>
                        Budget {isCustomPackage ? '*' : ''}
                      </label>
                      <select
                        className="fsl"
                        id={isFursuit ? 'fb-fursuit' : 'fb'}
                        required={isCustomPackage}
                        value={isFursuit ? formData.fursuitBudget : formData.budget}
                        onChange={updateForm(isFursuit ? 'fursuitBudget' : 'budget')}
                      >
                        <option value="">Select budget...</option>
                        {(isFursuit ? fursuitBudgetOptions : budgetOptions).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="fg">
                      <label className="fl" htmlFor="fd">
                        Deadline
                      </label>
                      <select className="fsl" id="fd" value={formData.deadline} onChange={updateForm('deadline')}>
                        <option value="">Select timeline...</option>
                        {deadlineOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {isFursuit && showPackagePrice && (
                  <div className="fg">
                    <label className="fl" htmlFor="fb-fursuit-range">
                      Budget Range (optional)
                    </label>
                    <select
                      className="fsl"
                      id="fb-fursuit-range"
                      value={formData.fursuitBudget}
                      onChange={updateForm('fursuitBudget')}
                    >
                      <option value="">Select range...</option>
                      {fursuitBudgetOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="fg">
                  <label className="fl" htmlFor="fm">
                    Project Description *
                  </label>
                  <textarea
                    className="fta"
                    id="fm"
                    placeholder="Tell us about your project..."
                    required
                    value={formData.description}
                    onChange={updateForm('description')}
                  />
                </div>
                <div className="fg">
                  <label className="fl" htmlFor="fref">
                    References (optional)
                  </label>
                  <input
                    type="text"
                    className="fi"
                    id="fref"
                    placeholder="Pinterest, Artstation links..."
                    value={formData.references}
                    onChange={updateForm('references')}
                  />
                </div>
                <p className="legal-note">
                  By submitting, you agree to our <Link to="/terms-of-service">Terms of Service</Link> and{' '}
                  <Link to="/privacy-policy">Privacy Policy</Link>.
                </p>
                <button
                  type="submit"
                  className="bp"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Submitting...' : 'Submit Query'} {!formSubmitting && <span aria-hidden="true">→</span>}
                </button>
                {formError && (
                  <div role="alert" style={{ textAlign: 'center', padding: '16px', color: '#f87171', fontWeight: 600, marginTop: '12px' }}>
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div id="fs" className="form-success" role="alert">
                    <p className="form-success-title">Thank you — we received your order query and will respond ASAP.</p>
                  </div>
                )}
              </form>
            </Reveal>
            <div className="finfo">
              {[
                { icon: '⚡', title: 'Quick Response', text: 'Avg response: 30 minutes.' },
                { icon: '🔒', title: '100% Confidential', text: 'NDAs available. Full discretion.' },
                { icon: '💬', title: '24/7 AI Support', text: 'Our AI assistant never sleeps.' },
                { icon: '🌍', title: 'Global Clients', text: 'We work across all timezones.' },
                { icon: '✨', title: 'Free Consultation', text: "Not sure? Let's talk first." },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 70}>
                  <div className="fii" style={index === 4 ? { borderBottom: 'none' } : undefined}>
                    <div className="fii-i">{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-s" id="contact">
        <div className="container">
          <Reveal>
            <div className="cta-b">
              <div className="section-label" style={{ justifyContent: 'center' }}>
                ✦ Let's Create
              </div>
              <h2 className="section-title">
                Ready to bring your vision to <span className="gt">life?</span>
              </h2>
              <p className="section-sub">Start your project and experience art born from the void.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="#query" className="bp" onClick={(e) => handleAnchorClick(e, '#query')}>
                  Start a Project <span aria-hidden="true">→</span>
                </a>
                <a href="mailto:support@voidinkstudios.com" className="bs">
                  support@voidinkstudios.com
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
