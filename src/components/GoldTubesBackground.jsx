import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const THEMES = {
  gold: {
    colors: ['#1a1a1a', '#c5a059', '#333333'],
    lights: ['#c5a059', '#e8d0a3', '#b8860b', '#c5a059'],
    intensity: 280,
  },
  silver: {
    // Starlight: bright white core + soft silver glow
    colors: ['#1a1a1a', '#ffffff', '#e8e8ee'],
    lights: ['#ffffff', '#f8f8fc', '#e0e0e8', '#c8c8d4'],
    intensity: 420,
  },
  // VoidInk brand — neon purple / violet / magenta
  voidink: {
    colors: ['#0a0614', '#a855f7', '#12081f'],
    lights: ['#c084fc', '#e879f9', '#a78bfa', '#818cf8'],
    intensity: 480,
  },
}

// Aliases for the brand theme
THEMES.brand = THEMES.voidink
THEMES.purple = THEMES.voidink
THEMES.violet = THEMES.voidink

const TUBES_CDN =
  'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'

function parseColorList(value, fallback) {
  if (!value || typeof value !== 'string') return fallback
  const colors = value
    .split(',')
    .map((c) => c.trim())
    .filter((c) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c))
  return colors.length ? colors : fallback
}

function tubesEnabled() {
  return String(import.meta.env.VITE_TUBES_ENABLED || 'false').trim().toLowerCase() === 'true'
}

function getTubesPalette() {
  const themeKey = String(import.meta.env.VITE_TUBES_THEME || 'voidink')
    .trim()
    .toLowerCase()
  const theme = THEMES[themeKey] ?? THEMES.voidink

  return {
    colors: parseColorList(import.meta.env.VITE_TUBES_COLORS, theme.colors),
    lights: parseColorList(import.meta.env.VITE_TUBES_LIGHTS, theme.lights),
    intensity: Number(import.meta.env.VITE_TUBES_INTENSITY) || theme.intensity,
  }
}

export default function GoldTubesBackground() {
  const canvasRef = useRef(null)
  const enabled = tubesEnabled()

  useEffect(() => {
    if (!enabled) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined

    let disposed = false
    let app = null
    const palette = getTubesPalette()

    import(/* @vite-ignore */ TUBES_CDN)
      .then((mod) => {
        if (disposed || !canvasRef.current) return
        const TubesCursor = mod.default
        app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: palette.colors,
            lights: {
              intensity: palette.intensity,
              colors: palette.lights,
            },
          },
        })
      })
      .catch((err) => {
        console.error('Gold tubes background failed to load', err)
      })

    return () => {
      disposed = true
      app?.dispose?.()
    }
  }, [enabled])

  if (!enabled || typeof document === 'undefined') return null

  return createPortal(
    <div className="home-tubes-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="home-tubes-canvas" />
    </div>,
    document.body,
  )
}
