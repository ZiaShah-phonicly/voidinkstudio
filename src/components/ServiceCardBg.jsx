import { useEffect, useRef, useState } from 'react'
import { getServiceGallery } from '../data/serviceGalleries'

export default function ServiceCardBg({ slug, fallbackImage, intervalMs = 3200, delayMs = 0 }) {
  const wrapRef = useRef(null)
  const pausedRef = useRef(false)
  const gallery = getServiceGallery(slug).map((item) => item.image).filter(Boolean)
  const slides = gallery.length ? gallery : fallbackImage ? [fallbackImage] : []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [slug])

  useEffect(() => {
    const card = wrapRef.current?.closest('.sv-c')
    if (!card) return undefined
    const onEnter = () => {
      pausedRef.current = true
    }
    const onLeave = () => {
      pausedRef.current = false
    }
    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    if (slides.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let intervalId = 0
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (pausedRef.current) return
        setIndex((prev) => (prev + 1) % slides.length)
      }, intervalMs)
    }, delayMs)

    return () => {
      window.clearTimeout(startId)
      window.clearInterval(intervalId)
    }
  }, [slides.length, intervalMs, delayMs])

  if (!slides.length) return null

  return (
    <div className="sv-bg" ref={wrapRef} aria-hidden="true">
      {slides.map((src, slideIndex) => (
        <img
          key={src}
          className={`sv-shadow${slideIndex === index ? ' sv-shadow-on' : ''}`}
          src={src}
          alt=""
          loading={slideIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
      ))}
    </div>
  )
}
