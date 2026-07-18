import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import { LogoMark } from './LogoMark'
import { serviceDetails } from '../data/serviceDetails'

const artServiceSlugs = ['custom-character-design', 'mascot-design', 'comic-book-art', 'dnd-character-art', 'furry-art', '2d-vtuber-models']
const techServiceSlugs = ['website-design-development', 'ai-agents-chatbots', 'app-development', 'branding-logo', '3d-models', 'animation']

const artServices = artServiceSlugs.map((slug) => serviceDetails.find((s) => s.slug === slug)).filter(Boolean)
const techServices = techServiceSlugs.map((slug) => serviceDetails.find((s) => s.slug === slug)).filter(Boolean)

const navLinks = [
  { to: '/#services', label: 'Services' },
  { to: '/#work', label: 'Portfolio' },
  { to: '/#process', label: 'Process' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/#testimonials', label: 'Reviews' },
]

const navActions = [
  { to: '/about', label: 'About Us', className: 'nav-cta nav-cta-ghost' },
  { to: '/#query', label: 'Contact Us', className: 'nav-cta nav-cta-ghost' },
  { to: '/#query', label: 'Get Quote', className: 'nav-cta' },
]

export default function SiteLayout() {
  const [loading, setLoading] = useState(true)
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [particles, setParticles] = useState([])
  const [cursorHover, setCursorHover] = useState(false)
  const cursorRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      duration: Math.random() * 18 + 12,
      delay: Math.random() * 10,
      color: ['#7C3AED', '#D946EF', '#6366F1', '#22D3EE'][Math.floor(Math.random() * 4)],
    }))
    setParticles(items)
  }, [])

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (window.innerWidth <= 768) return undefined
    const moveCursor = (event) => {
      if (!cursorRef.current) return
      cursorRef.current.style.left = `${event.clientX}px`
      cursorRef.current.style.top = `${event.clientY}px`
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    const isInnerPage =
      location.pathname.startsWith('/services') || location.pathname.startsWith('/about')
    document.documentElement.classList.toggle('is-service-page', isInnerPage)
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } else {
      window.scrollTo(0, 0)
    }
    return () => document.documentElement.classList.remove('is-service-page')
  }, [location.pathname, location.hash])

  const handleNavClick = (event, to) => {
    event.preventDefault()
    setMenuOpen(false)
    const [path, hash] = to.split('#')
    if (hash && (location.pathname === path || path === '/')) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      navigate(`${path}#${hash}`, { replace: true })
      return
    }
    navigate(hash ? `${path}#${hash}` : path)
  }

  return (
    <>
      <a href="/#services" className="skip-link" onClick={(e) => handleNavClick(e, '/#services')}>
        Skip to main content
      </a>

      <div
        ref={cursorRef}
        className={`cur ${cursorHover ? 'h' : ''}`}
        aria-hidden="true"
        style={{ left: '-100px', top: '-100px' }}
      />

      <div className="pts" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="pt"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              background: p.color,
            }}
          />
        ))}
      </div>

      <div className={`ld ${loading ? '' : 'h'}`} role="status" aria-label="Loading">
        <div className="ld-logo">
          <span className="gt">VOID</span>INK
        </div>
        <div className="ld-tag">Art Born From The Void</div>
        <div className="ld-bar">
          <div className="ld-bar-in" />
        </div>
      </div>

      <nav className={`nav ${navScrolled ? 'sc' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <Link to="/" className="logo" aria-label="VOIDINK Studios Home">
            <LogoMark />
          </Link>
          <ul className={`nl ${menuOpen ? 'op' : ''}`} role="menubar">
            {navLinks.map((link) => (
              <li key={link.to} role="none">
                <a href={link.to} role="menuitem" onClick={(e) => handleNavClick(e, link.to)}>
                  {link.label}
                </a>
              </li>
            ))}
            {navActions.map((action) => (
              <li key={`${action.label}-${action.to}`} role="none">
                <a
                  href={action.to}
                  className={action.className}
                  role="menuitem"
                  onClick={(e) => handleNavClick(e, action.to)}
                >
                  {action.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`mt ${menuOpen ? 'a' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <Outlet context={{ setCursorHover, setChatOpen }} />

      <div className="brand-huge">
        <div className="container">
          <div className="brand-huge-name">VOIDINK</div>
          <div className="brand-huge-sub">S T U D I O S</div>
        </div>
      </div>

      <footer className="ft" role="contentinfo">
        <div className="container">
          <div className="ft-g">
            <div className="ft-b">
              <Link to="/" className="logo">
                <LogoMark />
              </Link>
              <p>
                Art born from the void. World-class creative studio for art, design, AI & development. Trusted by 200+
                clients in 25 countries.
              </p>
              <div className="sl">
                {[
                  {
                    label: 'X',
                    icon: (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.227-8.451L1.5 2.25h7.08l4.26 5.688L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: 'Instagram',
                    icon: (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: 'Discord',
                    icon: (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: 'ArtStation',
                    icon: (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M0 17.723l2.223-3.855h4.348l1.662 2.889h7.658L15.263 21H8.054l1.661-2.881H2.223L0 17.723zm10.375-5.826l1.663-2.879H24l-1.662 2.879h-12zM8.727 0L6.403 4.005H0l2.223 3.854h7.655l4.348-7.547L8.727 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: 'DeviantArt',
                    icon: (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M19.207 4.794l.23-.43V0H15.61l-.136.171-1.256 2.456L13.71 4.794H6.95l-.561.626-.625 4.104-.144.14.625 1.537h4.247l.953 1.862-.168.14H4.47L.309 17.992V24h3.852l.136-.136 1.281-2.501.148-.155h6.933l.561-.626.625-4.104.144-.14-.625-1.537h-4.247L12.206 10.9l.168-.14h6.933l4.16 4.154V9.207l-.23-.43-3.854-3.852-.005-.131z"
                        />
                      </svg>
                    ),
                  },
                ].map(({ label, icon }) => {
                  const href =
                    label === 'Instagram' ? 'https://www.instagram.com/voidinkstudios/' : '#'
                  const external = href.startsWith('http')
                  return (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      data-tooltip={label}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {icon}
                    </a>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="ft-t">Art Services</div>
              <ul className="ft-l">
                {artServices.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/services/${item.slug}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="ft-t">Tech Services</div>
              <ul className="ft-l">
                {techServices.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/services/${item.slug}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="ft-t">Contact</div>
              <ul className="ft-l">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <a href="mailto:voidinkstudios1@gmail.com">voidinkstudios1@gmail.com</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/voidinkstudios/" target="_blank" rel="noopener noreferrer">
                    Instagram: @voidinkstudios
                  </a>
                </li>
                <li>
                  {/* <a href="#">Discord: VOIDINK</a> */}
                </li>
                <li>
                  <a href="#">Available 24/7</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="ft-bot">
            <p>© 2026 VOIDINK Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </>
  )
}
