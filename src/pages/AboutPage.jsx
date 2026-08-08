import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import Reveal, { RevealItem } from '../components/Reveal'
import usePageMeta from '../hooks/usePageMeta'
import { pageTitle } from '../data/seo'
import { studioStats, studioStatsCopy } from '../data/voidinkData'

const whyChoose = [
  {
    icon: '🎨',
    title: `${studioStats.services}+ Services Under One Roof`,
    text: 'Art, design, AI, development — everything you need in one place. No need to hire multiple freelancers or agencies.',
  },
  {
    icon: '⚡',
    title: 'Fast Turnaround',
    text: 'Most projects delivered within days, not weeks. Clear delivery timelines on every package. We respect your time.',
  },
  {
    icon: '📈',
    title: 'Results-Driven Design',
    text: "Art that doesn't just look good — it performs. More engagement, more sales, more impact.",
  },
  {
    icon: '💰',
    title: 'Affordable Pricing',
    text: 'Premium quality at fair prices. No hidden fees, no surprise charges. Transparent pricing on every service.',
  },
  {
    icon: '🌍',
    title: 'Global Clients',
    text: 'We work with clients across all timezones worldwide. Clear communication, professional workflow, on-time delivery — every single project.',
  },
  {
    icon: '🔒',
    title: '100% Ownership & Confidentiality',
    text: 'Everything we create belongs to you. Full commercial rights, source files included, and complete confidentiality on every project. NDAs available.',
  },
]

const stats = [
  { value: `${studioStats.projects}+`, label: 'Projects Delivered' },
  { value: `${studioStats.clients}+`, label: `clients in ${studioStats.countries} countries` },
  { value: `${studioStats.services}+`, label: 'Creative & Tech Services' },
  { value: `${studioStats.satisfaction}%`, label: 'Client Satisfaction Rate' },
  { value: `${studioStats.rating}★`, label: 'Average Rating' },
]

const designServices =
  'Website Design, Branding & Logo, Mascot Design, Comic Book Art, Cover Art, Custom Character Design, DnD Character Art, Furry Art, Fursuit Commissions, NSFW Art, 2D VTuber Models, 3D Models, Animation'
const techServices =
  'Website Development, App Development, AI Chatbots, Voice Agents, Business Automations'

export default function AboutPage() {
  const navigate = useNavigate()
  const { setChatOpen = () => {} } = useOutletContext() ?? {}
  usePageMeta({
    title: pageTitle('About'),
    description:
      'VOIDINK Studios is a remote-first creative studio for custom art, branding, websites, apps, and AI. Also known as Voidink Studio or voidinkstudio.',
  })

  const goTo = (event, path) => {
    event.preventDefault()
    navigate(path)
  }

  return (
    <main id="main-content" className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="container">
          <nav className="sp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="sp-breadcrumb-current">About</span>
          </nav>

          <Reveal>
            <p className="section-label">✦ About VOIDINK Studios</p>
            <h1 className="about-title">
              Art Born From The Void — <span className="gt">Who We Are</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section about-intro">
        <div className="container">
          <Reveal>
            <div className="about-prose">
              <p>
                At VOIDINK Studios, we turn bold ideas into powerful digital experiences. We are a world-class creative
                studio specializing in art, design, AI solutions, and development — helping brands, creators, and
                businesses build work that stands out, connects, and leaves a lasting impression. People also search for
                us as Voidink Studio or voidinkstudio; our official name is VOIDINK Studios.
              </p>
              <p>
                From custom websites, AI chatbots, voice agents, and mobile apps to comic book art, 3D models, VTuber
                models, mascot design, branding, animation, character art, and cover art — we bring creativity and
                technology together under one roof with {studioStats.services}+ professional services.
              </p>
              <p>
                Every project we take on is built with attention to detail, clear communication, and a deep focus on
                quality. We don&apos;t do templates. We don&apos;t do shortcuts. Every pixel, every line, every
                interaction is crafted to match your vision — because your project deserves nothing less.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-mission">
        <div className="container">
          <Reveal>
            <p className="section-label">✦ Purpose</p>
            <h2 className="section-title">Our Mission</h2>
            <p className="about-mission-text">
              To make world-class creative and technical services accessible to everyone — from solo creators and
              startups to established brands and businesses worldwide. We believe great work should be affordable,
              original, and delivered on time, every single time.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section about-why">
        <div className="container">
          <Reveal>
            <p className="section-label">✦ Why Choose Us</p>
            <h2 className="section-title">Why Choose VOIDINK Studios</h2>
          </Reveal>
          <div className="about-why-grid">
            {whyChoose.map((item, index) => (
              <RevealItem key={item.title} delay={index * 60} className="about-why-card">
                <div className="about-why-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-studio">
        <div className="container">
          <Reveal>
            <p className="section-label">✦ The Studio</p>
            <h2 className="section-title">The Studio Behind The Work</h2>
            <div className="about-prose">
              <p>
                VOIDINK Studios was founded with one simple belief — great creative work should be accessible to
                everyone. What started as a small design studio has grown into a full-service creative and technology
                partner {studioStatsCopy.trustedBy.toLowerCase()} across {studioStats.projects}+ delivered projects.
              </p>
              <p>
                We combine human creativity with modern tools and technology to deliver results that are not just
                visually stunning but strategically effective. Whether you&apos;re a streamer needing a VTuber model, a
                startup launching a brand, a business automating with AI, or an author creating a comic book —
                we&apos;ve got you covered.
              </p>
              <p>
                Our team lives and breathes creativity. We stay ahead of trends, adopt the latest tools, and constantly
                push the boundaries of what&apos;s possible in digital art, design, and technology.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-stats">
        <div className="container">
          <Reveal>
            <p className="section-label">✦ By The Numbers</p>
            <h2 className="section-title">Our Numbers Speak</h2>
          </Reveal>
          <div className="about-stats-grid">
            {stats.map((stat, index) => (
              <RevealItem key={stat.label} delay={index * 50} className="about-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-glance">
        <div className="container">
          <Reveal>
            <p className="section-label">✦ Services</p>
            <h2 className="section-title">What We Do — At A Glance</h2>
          </Reveal>
          <div className="about-glance-grid">
            <RevealItem className="about-glance-card">
              <h3>Design & Art Services:</h3>
              <p>{designServices}</p>
            </RevealItem>
            <RevealItem delay={80} className="about-glance-card">
              <h3>Tech & AI Services:</h3>
              <p>{techServices}</p>
            </RevealItem>
          </div>
        </div>
      </section>

      <section className="section about-cta">
        <div className="container">
          <Reveal>
            <div className="about-cta-box">
              <p className="section-label">✦ Let&apos;s Build</p>
              <h2 className="section-title">Ready To Create Something Amazing?</h2>
              <p className="section-sub">
                Whether you have a clear vision or just a rough idea — we&apos;re here to bring it to life. Let&apos;s
                build something extraordinary together.
              </p>
              <div className="hero-act about-cta-actions">
                <a href="/#query" className="bp" onClick={(e) => goTo(e, '/#query')}>
                  Get Quote <span aria-hidden="true">→</span>
                </a>
                <a href="/#query" className="bs" onClick={(e) => goTo(e, '/#query')}>
                  Start Project
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
