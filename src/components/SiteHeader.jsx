import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoMark } from './LogoMark'
import { clearAuth, getAuth } from '../utils/authApi'
import useOutsideClose from '../hooks/useOutsideClose'

const primaryLinks = [
  { to: '/#services', label: 'Services' },
  { to: '/services/fursuits', label: 'Fursuits', isNew: true, route: true },
  { to: '/#work', label: 'Work' },
  { to: '/#pricing', label: 'Pricing' },
]

const moreLinks = [
  { to: '/#process', label: 'Process' },
  { to: '/#testimonials', label: 'Reviews' },
  { to: '/track', label: 'Track', route: true },
  { to: '/faq', label: 'FAQ', route: true },
  { to: '/about', label: 'About', route: true },
]

export default function SiteHeader() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [auth, setAuthState] = useState(() => getAuth())
  const location = useLocation()
  const navigate = useNavigate()
  const moreRef = useRef(null)
  useOutsideClose(moreRef, moreOpen, () => setMoreOpen(false))

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setAuthState(getAuth())
    setMenuOpen(false)
    setMoreOpen(false)
  }, [location.pathname, location.hash])

  const handleNavClick = (event, to) => {
    event.preventDefault()
    setMenuOpen(false)
    setMoreOpen(false)
    const [path, hash] = to.split('#')
    if (hash && (location.pathname === path || path === '/')) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      navigate(`${path}#${hash}`, { replace: true })
      return
    }
    navigate(hash ? `${path}#${hash}` : path)
  }

  const handleLogout = () => {
    clearAuth()
    setAuthState(null)
    setMenuOpen(false)
    navigate('/')
  }

  const renderLink = (link) => {
    if (link.route) {
      return (
        <Link to={link.to} role="menuitem" onClick={() => { setMenuOpen(false); setMoreOpen(false) }}>
          {link.label}
          {link.isNew ? <span className="nav-new">NEW</span> : null}
        </Link>
      )
    }
    return (
      <a href={link.to} role="menuitem" onClick={(e) => handleNavClick(e, link.to)}>
        {link.label}
        {link.isNew ? <span className="nav-new">NEW</span> : null}
      </a>
    )
  }

  return (
    <>
      <a href="/#services" className="skip-link" onClick={(e) => handleNavClick(e, '/#services')}>
        Skip to main content
      </a>

      <nav className={`nav ${navScrolled ? 'sc' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <Link to="/" className="logo" aria-label="VOIDINK Studios Home">
            <LogoMark />
          </Link>
          <ul className={`nl ${menuOpen ? 'op' : ''}`} role="menubar">
            {primaryLinks.map((link) => (
              <li key={link.to} role="none">
                {renderLink(link)}
              </li>
            ))}
            <li role="none" className={`nav-more${moreOpen ? ' open' : ''}`} ref={moreRef}>
              <button
                type="button"
                className="nav-more-btn"
                role="menuitem"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((prev) => !prev)}
              >
                More <span aria-hidden="true">▾</span>
              </button>
              <ul className="nav-more-menu" role="menu" hidden={!moreOpen}>
                {moreLinks.map((link) => (
                  <li key={link.to} role="none">
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </li>
            {auth ? (
              <li role="none" className="nav-user">
                <span className="nav-user-name">Hi, {auth.first_name || 'there'}</span>
                <button type="button" className="nav-text-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            ) : null}
            <li role="none">
              <a
                href="/#query"
                className="nav-cta"
                role="menuitem"
                onClick={(e) => handleNavClick(e, '/#query')}
              >
                Get Quote
              </a>
            </li>
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
    </>
  )
}
