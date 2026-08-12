import { useEffect, useRef, useState } from 'react'
import { getServiceGallery, isVideoSrc } from '../data/serviceGalleries'

const MAX_IMAGE_SLIDES = 3

function pickSlides(gallery, fallbackImage) {
  const sources = (gallery.length ? gallery : fallbackImage ? [fallbackImage] : []).filter(Boolean)
  if (!sources.length) return []

  const videos = sources.filter((src) => isVideoSrc(src))
  const images = sources.filter((src) => !isVideoSrc(src))

  // Videos are heavy — one poster clip only (no multi-video carousel on cards).
  if (videos.length && !images.length) {
    const preferred = fallbackImage && isVideoSrc(fallbackImage) ? fallbackImage : videos[0]
    return [preferred]
  }

  if (images.length) return images.slice(0, MAX_IMAGE_SLIDES)
  return [sources[0]]
}

export default function ServiceCardBg({ slug, fallbackImage, intervalMs = 3200, delayMs = 0, alt = '' }) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const pausedRef = useRef(false)
  const gallery = getServiceGallery(slug)
    .map((item) => item.image)
    .filter(Boolean)
  const slides = pickSlides(gallery, fallbackImage)
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    setIndex(0)
  }, [slug])

  useEffect(() => {
    const root = wrapRef.current
    if (!root || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio > 0.15)
      },
      { rootMargin: '80px 0px', threshold: [0, 0.15, 0.4] },
    )
    observer.observe(root)
    return () => observer.disconnect()
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
        if (pausedRef.current || !inView) return
        setIndex((prev) => (prev + 1) % slides.length)
      }, intervalMs)
    }, delayMs)

    return () => {
      window.clearTimeout(startId)
      window.clearInterval(intervalId)
    }
  }, [slides.length, intervalMs, delayMs, inView])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (inView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
    return undefined
  }, [inView, slides, index])

  if (!slides.length) return null

  return (
    <div className="sv-bg" ref={wrapRef} aria-hidden="true">
      {slides.map((src, slideIndex) => {
        const on = slideIndex === index
        if (isVideoSrc(src)) {
          return (
            <video
              key={src}
              ref={slideIndex === 0 ? videoRef : undefined}
              className={`sv-shadow media-protect${on ? ' sv-shadow-on' : ''}`}
              src={inView ? src : undefined}
              muted
              loop
              playsInline
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              preload="none"
              aria-label={alt}
              onContextMenu={(event) => event.preventDefault()}
              draggable={false}
            />
          )
        }
        return (
          <img
            key={src}
            className={`sv-shadow media-protect${on ? ' sv-shadow-on' : ''}`}
            src={src}
            alt={alt}
            loading={slideIndex === 0 ? 'lazy' : 'lazy'}
            decoding="async"
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            onDragStart={(event) => event.preventDefault()}
          />
        )
      })}
    </div>
  )
}
