import { useEffect } from 'react'

export default function useOutsideClose(ref, active, onClose) {
  useEffect(() => {
    if (!active) return undefined

    const handlePointerDown = (event) => {
      if (!ref.current?.contains(event.target)) onClose()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, active, onClose])
}
