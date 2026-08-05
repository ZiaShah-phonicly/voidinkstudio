import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoMark } from './LogoMark'
import { clearAuth, getAuth } from '../utils/authApi'

const navLinks = [
  { to: '/#services', label: 'Services' },
  { to: '/#work', label: 'Portfolio' },
  { to: '/#process', label: 'Process' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/#testimonials', label: 'Reviews' },
  { to: '/track', label: 'Track', route: true },
  { to: '/faq', label: 'FAQ' },
]

const navActions = [
  { to: '/about', label: 'About Us', className: 'nav-cta nav-cta-ghost' },
  { to: '/#query', label: 'Get Quote', className: 'nav-cta' },
]

export default function SiteHeader() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [auth, setAuthState] = useState(() => getAuth())
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setAuthState(getAuth())
    setMenuOpen(false)
  }, [location.pathname])

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

  const handleLogout = () => {
    clearAuth()
    setAuthState(null)
    setMenuOpen(false)
    navigate('/')
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
            {navLinks.map((link) => (
              <li key={link.to} role="none">
                <a href={link.to} role="menuitem" onClick={(e) => handleNavClick(e, link.to)}>
                  {link.label}
                </a>
              </li>
            ))}
            {auth ? (
              <li role="none" className="nav-user">
                <span className="nav-user-name">Hi, {auth.first_name || 'there'}</span>
                <button type="button" className="nav-cta nav-cta-ghost" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            ) : null}
            {navActions.map((action) => (
              <li key={`${action.label}-${action.to}`} role="none">
                {action.route ? (
                  <Link to={action.to} className={action.className} role="menuitem" onClick={() => setMenuOpen(false)}>
                    {action.label}
                  </Link>
                ) : (
                  <a
                    href={action.to}
                    className={action.className}
                    role="menuitem"
                    onClick={(e) => handleNavClick(e, action.to)}
                  >
                    {action.label}
                  </a>
                )}
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
    </>
  )
}
