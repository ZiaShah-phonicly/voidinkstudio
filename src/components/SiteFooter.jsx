import { Link } from 'react-router-dom'
import { LogoMark } from './LogoMark'
import { serviceDetails } from '../data/serviceDetails'
import { studioStatsCopy } from '../data/voidinkData'

const footerTitleBySlug = {
  'ai-agents-chatbots': 'AI & Automations',
  'website-design-development': 'Websites',
  'app-development': 'Apps',
  'branding-logo': 'Branding',
  '3d-models': '3D Models',
  animation: 'Animation',
  'custom-character-design': 'Characters',
  'mascot-design': 'Mascots',
  'comic-book-art': 'Comics',
  'dnd-character-art': 'DnD Art',
  'furry-art': 'Furry Art',
  fursuits: 'Fursuits',
  '2d-vtuber-models': 'VTubers',
}

const artServiceSlugs = ['custom-character-design', 'mascot-design', 'comic-book-art', 'dnd-character-art', 'furry-art', 'fursuits', '2d-vtuber-models']
const techServiceSlugs = ['website-design-development', 'ai-agents-chatbots', 'app-development', 'branding-logo', '3d-models', 'animation']

const artServices = artServiceSlugs.map((slug) => serviceDetails.find((s) => s.slug === slug)).filter(Boolean)
const techServices = techServiceSlugs.map((slug) => serviceDetails.find((s) => s.slug === slug)).filter(Boolean)

const socials = [
  {
    label: 'X',
    href: 'https://x.com/voidinkstudios',
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
    href: 'https://www.instagram.com/voidinkstudios/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        />
      </svg>
    ),
  },
  // Discord / ArtStation / DeviantArt intentionally disabled until the accounts are live.
]

export default function SiteFooter() {
  return (
    <>
      <div className="brand-huge">
        <div className="container">
          <div className="brand-huge-name">VOIDINK</div>
          <div className="brand-huge-sub">STUDIOS</div>
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
                Art born from the void. World-class creative studio for art, design, AI & development.{' '}
                {studioStatsCopy.trustedBy}.
              </p>
              <div className="sl">
                {socials.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    data-tooltip={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="ft-t">Art Services</div>
              <ul className="ft-l">
                {artServices.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/services/${item.slug}`}>{footerTitleBySlug[item.slug] || item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="ft-t">Tech Services</div>
              <ul className="ft-l">
                {techServices.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/services/${item.slug}`}>{footerTitleBySlug[item.slug] || item.title}</Link>
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
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-service">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/track">Track Order</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <a href="mailto:support@voidinkstudios.com">support@voidinkstudios.com</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/voidinkstudios/" target="_blank" rel="noopener noreferrer">
                    Instagram: @voidinkstudios
                  </a>
                </li>
                <li>
                  <a href="#">Available 24/7</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="ft-bot">
            <p>
              © 2026 VOIDINK Studios
              <span className="ft-sep" aria-hidden="true">
                |
              </span>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <span className="ft-sep" aria-hidden="true">
                |
              </span>
              <Link to="/terms-of-service">Terms of Service</Link>
              <span className="ft-sep" aria-hidden="true">
                |
              </span>
              <Link to="/faq">FAQ</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
