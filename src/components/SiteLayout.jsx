import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import CookieConsent from './CookieConsent'
import RetellVoiceWidget from './RetellVoiceWidget'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import usePageMeta from '../hooks/usePageMeta'

export default function SiteLayout() {
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [particles, setParticles] = useState([])
  const [cursorHover, setCursorHover] = useState(false)
  const cursorRef = useRef(null)
  const location = useLocation()

  // index.html hardcodes the homepage canonical, which would mark every other
  // public route as a duplicate of "/".
  usePageMeta({ canonical: `${window.location.origin}${location.pathname}` })

  useEffect(() => {
    const lockPage =
      String(import.meta.env.VITE_LOCK_PAGE || 'false').trim().toLowerCase() === 'true'
    if (!lockPage) return undefined

    const isEditable = (target) => {
      if (!(target instanceof Element)) return false
      return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
    }

    const onContextMenu = (event) => {
      if (isEditable(event.target)) return
      event.preventDefault()
    }

    const onDragStart = (event) => {
      if (isEditable(event.target)) return
      event.preventDefault()
    }

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase()
      const combo = event.ctrlKey || event.metaKey
      if (!combo) return
      // Block Save As (Ctrl/Cmd+S) and View Source (Ctrl/Cmd+U)
      if (key === 's' || key === 'u') event.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu, true)
    document.addEventListener('dragstart', onDragStart, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu, true)
      document.removeEventListener('dragstart', onDragStart, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [])

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
    const isInnerPage = ['/services', '/fursuits', '/about', '/privacy-policy', '/terms-of-service', '/faq', '/track'].some(
      (path) => location.pathname.startsWith(path),
    )
    document.documentElement.classList.toggle('is-service-page', isInnerPage)
    let hashTimer
    if (location.hash) {
      const id = location.hash.replace('#', '')
      hashTimer = window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        100,
      )
    } else {
      window.scrollTo(0, 0)
    }
    return () => {
      if (hashTimer) window.clearTimeout(hashTimer)
      document.documentElement.classList.remove('is-service-page')
    }
  }, [location.pathname, location.hash])

  return (
    <>
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

      <SiteHeader />

      <Outlet context={{ setCursorHover, setChatOpen }} />

      <SiteFooter />

      <CookieConsent />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
      <RetellVoiceWidget />
    </>
  )
}
