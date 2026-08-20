import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  chatQuickReplies,
  initialChatSession,
  processChatMessage,
  processChatQuickReply,
} from '../data/chatbotEngine'

const ORDER_STORAGE_KEY = 'voidink_pending_order'

const welcomeMessage = {
  id: 'welcome',
  type: 'bot',
  text: "👋 Hi! I'm **VOIDINK Assistant**.\n\nTell me what you want — logo ($59), website ($399), VTuber, comic, DnD, AI chatbot — and I'll recommend the **best package** from our current pricing.\n\nWhat's your project?",
  quickReplies: chatQuickReplies,
}

function formatBotText(text) {
  return text.split('\n').map((line, i) => (
    <span key={`${line}-${i}`}>
      {i > 0 && <br />}
      {line.split('**').map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
    </span>
  ))
}

export default function ChatWidget({ open: controlledOpen, onOpenChange }) {
  const navigate = useNavigate()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = (value) => {
    if (onOpenChange) onOpenChange(value)
    else setInternalOpen(value)
  }
  const [session, setSession] = useState(initialChatSession)
  const [messages, setMessages] = useState([welcomeMessage])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const toggleChat = () => {
    if (onOpenChange) onOpenChange(!open)
    else setInternalOpen((prev) => !prev)
  }

  const goToOrderForm = (order) => {
    if (!order) return
    try {
      sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order))
    } catch {
      // ignore quota / private mode
    }
    setOpen(false)
    navigate({ pathname: '/', hash: 'query' }, { state: { order } })
  }

  const pushBotReply = (result, delay = 900) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setSession(result.session)
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          text: result.text,
          quickReplies: result.quickReplies || null,
          orderCta: result.orderCta || null,
        },
      ])
    }, delay)
  }

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', text: trimmed }])
    const result = processChatMessage(trimmed, session)
    pushBotReply(result)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(input)
    setInput('')
  }

  const handleQuickReply = (label) => {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', text: label }])
    const result = processChatQuickReply(label, session)
    pushBotReply(result, 700)
  }

  return (
    <div className="cw">
      <div className={`cb ${open ? 'o' : ''}`} role="dialog" aria-label="Chat with VOIDINK Assistant">
        <div className="ch">
          <div className="ch-av">🤖</div>
          <div className="ch-info">
            <p className="ch-name">VOIDINK Assistant</p>
            <p>
              <span className="od" /> Online • Recommends packages from our site
            </p>
          </div>
          <button type="button" className="ch-cl" onClick={toggleChat} aria-label="Close chat">
            ✕
          </button>
        </div>
        <div className="cm" ref={messagesRef} role="log" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className={`msg ${msg.type}`}>
              {msg.type === 'bot' ? formatBotText(msg.text) : msg.text}
              {(msg.orderCta || msg.quickReplies?.length > 0) && (
                <div className="qr">
                  {msg.orderCta && (
                    <button
                      type="button"
                      className="qb qb-primary"
                      onClick={() => goToOrderForm(msg.orderCta.order)}
                    >
                      {msg.orderCta.label || 'Order Now'}
                    </button>
                  )}
                  {msg.quickReplies?.map((label) => (
                    <button key={label} type="button" className="qb" onClick={() => handleQuickReply(label)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="msg bot">
              <div className="td">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
        <form className="ci-a" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="ci"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your project..."
            aria-label="Type your message"
          />
          <button type="submit" className="cs" aria-label="Send message">
            ➤
          </button>
        </form>
      </div>
      <button type="button" className="chat-toggle-btn" onClick={toggleChat} aria-label="Open VOIDINK Assistant chat — get package recommendations">
        <span className="chat-pulse" aria-hidden="true" />
        <span className="chat-pulse chat-pulse--late" aria-hidden="true" />
        <div className="chat-avatar-wrapper" aria-hidden="true">
          <span className="chat-bot-icon">🤖</span>
          <div className="chat-online" />
        </div>
        <div className="chat-toggle-text">
          <span className="ctt-main">Chat with Us</span>
          <span className="ctt-sub">Get package recommendations</span>
        </div>
      </button>
    </div>
  )
}
