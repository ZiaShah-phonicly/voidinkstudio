import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const CONSENT_KEY = 'cookieConsent'

function readConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeConsent(prefs) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({
      essential: true,
      ...prefs,
      timestamp: new Date().toISOString(),
    }),
  )
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (readConsent()) return undefined
    const timer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('cookie-banner-open', visible)
    return () => document.body.classList.remove('cookie-banner-open')
  }, [visible])

  const hideBanner = () => {
    setVisible(false)
    setSettingsOpen(false)
  }

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true })
    hideBanner()
  }

  const openSettings = () => {
    const saved = readConsent() || {}
    setAnalytics(Boolean(saved.analytics))
    setMarketing(Boolean(saved.marketing))
    setSettingsOpen(true)
  }

  const savePreferences = () => {
    writeConsent({ analytics, marketing })
    hideBanner()
  }

  return (
    <>
      <div className={`cookie-banner${visible ? ' show' : ''}`} id="cookieBanner" role="dialog" aria-label="Cookie consent">
        <div className="cookie-banner-inner">
          <div className="cookie-text">
            <p>
              We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By
              clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
              <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
          <div className="cookie-actions">
            <button type="button" className="cookie-btn cookie-btn-secondary" onClick={openSettings}>
              Preferences
            </button>
            <button type="button" className="cookie-btn cookie-btn-primary" onClick={acceptAll}>
              Accept All
            </button>
          </div>
        </div>
      </div>

      <div
        className={`cookie-settings${settingsOpen ? ' show' : ''}`}
        id="cookieSettings"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSettingsOpen(false)
        }}
      >
        <div className="cookie-settings-box">
          <h3>Cookie Preferences</h3>
          <p>Manage your cookie preferences below. Essential cookies cannot be disabled.</p>

          <div className="cookie-toggle-row">
            <div className="cookie-toggle-label">
              <strong>Essential</strong>
              <span>Required for the site to function</span>
            </div>
            <input type="checkbox" className="cookie-toggle" checked disabled readOnly aria-label="Essential cookies" />
          </div>

          <div className="cookie-toggle-row">
            <div className="cookie-toggle-label">
              <strong>Analytics</strong>
              <span>Helps us improve our website</span>
            </div>
            <input
              type="checkbox"
              className="cookie-toggle"
              id="analyticsCookies"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              aria-label="Analytics cookies"
            />
          </div>

          <div className="cookie-toggle-row">
            <div className="cookie-toggle-label">
              <strong>Marketing</strong>
              <span>Used for personalized ads &amp; content</span>
            </div>
            <input
              type="checkbox"
              className="cookie-toggle"
              id="marketingCookies"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              aria-label="Marketing cookies"
            />
          </div>

          <div className="cookie-settings-actions">
            <button type="button" className="cookie-btn cookie-btn-secondary" onClick={() => setSettingsOpen(false)}>
              Cancel
            </button>
            <button type="button" className="cookie-btn cookie-btn-primary" onClick={savePreferences}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
