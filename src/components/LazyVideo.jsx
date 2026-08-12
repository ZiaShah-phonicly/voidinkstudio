import { useEffect, useRef, useState } from 'react'

/** Muted looping video that only attaches src / plays when near the viewport. */
export default function LazyVideo({
  src,
  className = '',
  ariaLabel = '',
  autoPlayWhenVisible = true,
  controls = false,
}) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.2)
      },
      { rootMargin: '120px 0px', threshold: [0, 0.2, 0.5] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [src])

  useEffect(() => {
    const video = ref.current
    if (!video || !autoPlayWhenVisible) return undefined

    if (active) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
    return undefined
  }, [active, autoPlayWhenVisible, src])

  return (
    <video
      ref={ref}
      className={className}
      src={active ? src : undefined}
      muted
      loop
      playsInline
      controls={controls}
      preload="none"
      aria-label={ariaLabel}
    />
  )
}
