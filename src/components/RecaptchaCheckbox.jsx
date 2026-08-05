import { useEffect, useRef } from 'react'

const SCRIPT_ID = 'google-recaptcha-script'

export default function RecaptchaCheckbox({ siteKey, onChange, onError }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!siteKey) return undefined

    let cancelled = false
    let widgetId = null

    const renderWidget = () => {
      if (cancelled || widgetId !== null || !containerRef.current || !window.grecaptcha) return
      widgetId = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token) => onChange(token),
        'expired-callback': () => onChange(''),
        'error-callback': () => {
          onChange('')
          onError?.('CAPTCHA could not load. Please refresh and try again.')
        },
      })
    }

    let script = document.getElementById(SCRIPT_ID)
    if (window.grecaptcha?.render) {
      renderWidget()
    } else if (script) {
      script.addEventListener('load', renderWidget, { once: true })
    } else {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.addEventListener('load', renderWidget, { once: true })
      script.addEventListener(
        'error',
        () => onError?.('CAPTCHA could not load. Please check your connection.'),
        { once: true },
      )
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      script?.removeEventListener('load', renderWidget)
      if (widgetId !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(widgetId)
      }
    }
  }, [siteKey, onChange, onError])

  if (!siteKey) return null

  return <div className="admin-recaptcha" ref={containerRef} />
}
