import { useEffect, useRef, useState } from 'react'
import { RetellWebClient } from 'retell-client-js-sdk'

function isEnabledFlag(value) {
  return String(value || '').trim().toLowerCase() === 'true'
}

function roleLabel(role) {
  if (role === 'agent') return 'Aria'
  if (role === 'user') return 'You'
  return role || 'Unknown'
}

function getRetellWebCallUrl() {
  // Local: Vite mints the token. Production: call the API host.
  if (import.meta.env.DEV) return '/api/retell/web-call/'
  const base = String(import.meta.env.VITE_API_URL || '')
    .trim()
    .replace(/\/$/, '')
  return base ? `${base}/api/retell/web-call/` : '/api/retell/web-call/'
}

/**
 * VOIDINK voice panel with live captions (You / Aria).
 * Local: Vite mints the call token from RETELL_API_KEY in .env (no Django needed).
 * Production: API mints the token (RETELL_* on backend .env).
 */
export default function RetellVoiceWidget() {
  const enabled = isEnabledFlag(import.meta.env.VITE_RETELL_VOICE_ENABLED)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [agentTalking, setAgentTalking] = useState(false)
  const [transcript, setTranscript] = useState([])
  const clientRef = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    document.body.classList.add('retell-voice-on')
    return () => document.body.classList.remove('retell-voice-on')
  }, [enabled])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [transcript, agentTalking, status])

  useEffect(() => {
    return () => {
      try {
        clientRef.current?.stopCall()
      } catch {
        // ignore
      }
      clientRef.current = null
    }
  }, [])

  if (!enabled) return null

  const stopCall = () => {
    setStatus('ending')
    try {
      clientRef.current?.stopCall()
    } catch {
      // ignore
    }
    clientRef.current = null
    setAgentTalking(false)
    setStatus('idle')
  }

  const startCall = async () => {
    setError('')
    setTranscript([])
    setAgentTalking(false)
    setStatus('connecting')
    setOpen(true)

    try {
      const response = await fetch(getRetellWebCallUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.accessToken) {
        throw new Error(data.error || 'Could not start voice call. Please try again.')
      }

      const client = new RetellWebClient()
      clientRef.current = client

      client.on('call_started', () => setStatus('live'))
      client.on('call_ready', () => setStatus('live'))
      client.on('agent_start_talking', () => setAgentTalking(true))
      client.on('agent_stop_talking', () => setAgentTalking(false))
      client.on('update', (update) => {
        const rows = Array.isArray(update?.transcript) ? update.transcript : []
        setTranscript(
          rows
            .map((row, index) => ({
              id: `${row.role || 'unknown'}-${index}-${String(row.content || '').slice(0, 24)}`,
              role: row.role === 'agent' ? 'agent' : 'user',
              text: String(row.content || '').trim(),
            }))
            .filter((row) => row.text),
        )
      })
      client.on('call_ended', () => {
        clientRef.current = null
        setAgentTalking(false)
        setStatus('idle')
      })
      client.on('error', (err) => {
        console.error('Retell call error', err)
        setError(typeof err === 'string' ? err : 'Voice call error. Please try again.')
        try {
          client.stopCall()
        } catch {
          // ignore
        }
        clientRef.current = null
        setAgentTalking(false)
        setStatus('error')
      })

      await client.startCall({ accessToken: data.accessToken })
      setStatus('live')
    } catch (err) {
      setError(err?.message || 'Could not start voice call.')
      setStatus('error')
      clientRef.current = null
    }
  }

  const toggleOpen = () => {
    if (open && (status === 'live' || status === 'connecting')) stopCall()
    setOpen((prev) => !prev)
  }

  const statusLabel =
    status === 'connecting'
      ? 'Connecting…'
      : status === 'live'
        ? agentTalking
          ? 'Aria is speaking…'
          : 'Listening…'
        : status === 'ending'
          ? 'Ending…'
          : status === 'error'
            ? 'Something went wrong'
            : 'Ready to talk'

  return (
    <div className="rvw">
      <div className={`rvw-panel ${open ? 'o' : ''}`} role="dialog" aria-label="Talk to Aria voice assistant">
        <div className="rvw-head">
          <div className="rvw-av" aria-hidden="true">
            ✦
          </div>
          <div className="rvw-info">
            <p className="rvw-name">Aria · Voice Guide</p>
            <p className="rvw-status">
              <span className={`rvw-dot ${status === 'live' ? 'on' : ''}`} />
              {statusLabel}
            </p>
          </div>
          <button type="button" className="rvw-close" onClick={toggleOpen} aria-label="Close voice panel">
            ✕
          </button>
        </div>

        <div className="rvw-log" ref={logRef} role="log" aria-live="polite">
          {transcript.length === 0 && status !== 'live' && status !== 'connecting' && (
            <div className="rvw-empty">
              Tap <strong>Start call</strong> and allow the mic. You’ll see what you say and what Aria replies — live.
            </div>
          )}
          {transcript.length === 0 && (status === 'live' || status === 'connecting') && (
            <div className="rvw-empty">Call connected. Start speaking — captions appear here.</div>
          )}
          {transcript.map((line) => (
            <div key={line.id} className={`rvw-msg ${line.role}`}>
              <span className="rvw-role">{roleLabel(line.role)}</span>
              <p>{line.text}</p>
            </div>
          ))}
        </div>

        {error ? <p className="rvw-error">{error}</p> : null}

        <div className="rvw-actions">
          {status === 'live' || status === 'connecting' ? (
            <button type="button" className="rvw-btn rvw-btn-end" onClick={stopCall}>
              End call
            </button>
          ) : (
            <button type="button" className="rvw-btn rvw-btn-start" onClick={startCall}>
              Start call
            </button>
          )}
        </div>
      </div>

      <button type="button" className="rvw-toggle" onClick={toggleOpen} aria-label="Open Talk to Aria">
        <span className="rvw-toggle-icon" aria-hidden="true">
          ✦
        </span>
        <span className="rvw-toggle-text">
          <span className="rvw-toggle-main">Talk to Aria</span>
          <span className="rvw-toggle-sub">Live voice + captions</span>
        </span>
      </button>
    </div>
  )
}
