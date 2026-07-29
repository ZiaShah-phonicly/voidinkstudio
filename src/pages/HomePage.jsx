import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import Partners from '../components/Partners'
import PricingCard from '../components/PricingCard'
import Reveal, { RevealItem } from '../components/Reveal'
import useOutsideClose from '../hooks/useOutsideClose'
import { homeFaqPreview } from '../data/faqData'
import { submitToGoogleSheet } from '../utils/submitToGoogleSheet'
import {
  budgetOptions,
  CUSTOM_PACKAGE,
  deadlineOptions,
  formServices,
  marqueeItems,
  pricingCategories,
  pricingCategoryToFormService,
  processSteps,
  services,
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
}

const ORDER_STORAGE_KEY = 'voidink_pending_order'

const heroStats = [
  { value: 500, suffix: '+', label: 'Projects Delivered' },
  { value: 200, suffix: '+', label: 'clients in 25 countries' },
  { value: 14, suffix: '+', label: 'Creative Services' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
]

function StatCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        let current = 0
        const increment = target / 60
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, 30)
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref}>
      <h3>
        {count}
        {suffix}
      </h3>
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
  const homeFaqRef = useRef(null)

  const closeHomeFaq = useCallback(() => setOpenFaq(null), [])
  useOutsideClose(homeFaqRef, openFaq !== null, closeHomeFaq)

  const isCustomPackage = formData.package === CUSTOM_PACKAGE
  const showPackagePrice = Boolean(formData.package && formData.package !== CUSTOM_PACKAGE)

  const updateForm = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
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
    if (order.original) lines.push(`Was: ${order.original}`)
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
    const service =
      order.service ||
      pricingCategoryToFormService[order.categoryId] ||
      ''
    const packageLabel = order.categoryLabel
      ? `${order.categoryLabel} — ${order.packageName}`
      : order.packageName

    setFormData((prev) => ({
      ...prev,
      service,
      package: packageLabel || CUSTOM_PACKAGE,
      price: order.price || '',
      budget: '',
      description: buildOrderDescription(order, packageLabel || order.packageName || 'Selected package'),
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
    const budgetValue = isCustomPackage ? formData.budget : formData.price || formData.budget

    try {
      await submitToGoogleSheet({
        name: formData.name,
        email: formData.email,
        service: formData.service,
        package: packageValue,
        price: priceValue || budgetValue || '',
        budget: budgetValue || '',
        deadline: formData.deadline,
        description: formData.description,
        references: formData.references,
      })

      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
      if (webhookUrl) {
        const content = [
          'New VOIDINK Form Submission',
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Service: ${formData.service}`,
          `Package: ${packageValue}`,
          `Price: ${priceValue || 'N/A'}`,
          `Budget: ${budgetValue || 'N/A'}`,
          `Deadline: ${formData.deadline || 'N/A'}`,
          `Description: ${formData.description}`,
          `References: ${formData.references || 'None'}`,
        ].join('\n')

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })
      }

      setFormSuccess(true)
      setFormData(emptyForm)
      setTimeout(() => setFormSuccess(false), 5000)
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Please email voidinkstudios1@gmail.com')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleAnchorClick = (event, href) => {
    if (href === '#') return
    event.preventDefault()
    navigate({ pathname: '/', hash: href.replace('#', '') })
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
    <>
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
              Open for commissions • Trusted by 200+ clients in 25 countries!
            </div>
            <div className="hero-ey">✦ World-Class Art, Design & Development Studio</div>
            <h1 className="hero-t" id="hero-title">
              Art Born <span className="gt">From The</span> <span className="vt">VOID</span>
            </h1>
            <div className="hero-tg">— Where Imagination Has No Limits —</div>
            <p className="hero-d">
              We craft world-class logos, illustrations, comic books, AI agents, websites, apps, and digital art that
              leave lasting impressions and drive real results.
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
                    200+ Clients in 25 Countries
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

      <Partners />

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
                14 Creative & tech services <br />
                <span className="gt">under one roof</span>
              </h2>
            <p className="section-sub">
              From pixel-perfect art to AI-powered solutions — we handle every creative and technical challenge.
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
                {service.cardImage && (
                  <img className="sv-shadow" src={service.cardImage} alt="" aria-hidden="true" loading="lazy" />
                )}
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

      <section className="section" id="work" style={{ background: 'var(--bg2)' }}>
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
                delay={index * 40}
                className="shot"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <a href="#query" className="shot-media" onClick={(e) => handleAnchorClick(e, '#query')}>
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <span className="shot-hover">View project</span>
                </a>
                <div className="shot-info">
                  <div className="shot-text">
                    <h3>{item.title}</h3>
                    <p>{item.meta}</p>
                  </div>
                  <div className="shot-likes" aria-label={`${item.likes} likes`}>
                    ♥ {item.likes}
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>

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

      <section className="section" id="pricing" style={{ background: 'var(--bg2)' }}>
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
                    <span className="faq-acc-text">{faq.q}</span>
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
                    onChange={(event) => {
                      const value = event.target.value
                      setFormData((prev) => ({
                        ...prev,
                        package: value,
                        price: value === CUSTOM_PACKAGE || value === '' ? '' : prev.price,
                        budget: value === CUSTOM_PACKAGE ? prev.budget : '',
                      }))
                    }}
                  >
                    <option value="">Select package...</option>
                    <option value={CUSTOM_PACKAGE}>{CUSTOM_PACKAGE}</option>
                    {formData.package && formData.package !== CUSTOM_PACKAGE && (
                      <option value={formData.package}>{formData.package}</option>
                    )}
                  </select>
                  {showPackagePrice && <p className="form-hint">Auto-filled from pricing — switch to Custom if you need something else.</p>}
                </div>
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
                      <label className="fl" htmlFor="fb">
                        Budget {isCustomPackage ? '*' : ''}
                      </label>
                      <select
                        className="fsl"
                        id="fb"
                        required={isCustomPackage}
                        value={formData.budget}
                        onChange={updateForm('budget')}
                      >
                        <option value="">Select budget...</option>
                        {budgetOptions.map((option) => (
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
                  <div id="fs" role="alert" style={{ textAlign: 'center', padding: '16px', color: '#4ade80', fontWeight: 600, marginTop: '12px' }}>
                    ✅ Thank you! We'll respond ASAP!
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
                <a href="mailto:voidinkstudios1@gmail.com" className="bs">
                  voidinkstudios1@gmail.com
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
