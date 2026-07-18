import { useEffect, useRef, useState } from 'react'

export function useReveal(delay = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return { ref, className: `rv ${visible ? 'ac' : ''}`.trim() }
}

export default function Reveal({ children, className = '', delay = 0 }) {
  const { ref, className: revealClass } = useReveal(delay)

  return (
    <div ref={ref} className={`${revealClass} ${className}`.trim()}>
      {children}
    </div>
  )
}

export function RevealItem({ as: Tag = 'article', delay = 0, className = '', ...props }) {
  const { ref, className: revealClass } = useReveal(delay)
  return <Tag ref={ref} className={`${className} ${revealClass}`.trim()} {...props} />
}
