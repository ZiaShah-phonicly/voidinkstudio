import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

async function handleRetellWebCall(req, res, apiKey, agentId) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }
  if (!apiKey || !agentId) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error: 'Set RETELL_API_KEY and VITE_RETELL_VOICE_AGENT_ID in voidinkstudio/.env, then restart npm run dev.',
      }),
    )
    return
  }
  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentId }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      res.statusCode = response.status >= 400 ? response.status : 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: data?.message || data?.error || 'Retell create-web-call failed' }))
      return
    }
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ accessToken: data.access_token, callId: data.call_id }))
  } catch (err) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err?.message || 'Retell request failed' }))
  }
}

function retellWebCallPlugin(apiKey, agentId) {
  return {
    name: 'retell-web-call-dev',
    configureServer(server) {
      return () => {
        server.middlewares.stack.unshift({
          route: '',
          handle: (req, res, next) => {
            const path = (req.url || '').split('?')[0]
            if (path !== '/api/retell/web-call' && path !== '/api/retell/web-call/') {
              next()
              return
            }
            handleRetellWebCall(req, res, apiKey, agentId)
          },
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const retellApiKey = (env.RETELL_API_KEY || '').trim()
  const retellAgentId = (env.RETELL_AGENT_ID || env.VITE_RETELL_VOICE_AGENT_ID || '').trim()

  return {
    plugins: [react(), retellWebCallPlugin(retellApiKey, retellAgentId)],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8002',
          changeOrigin: true,
        },
      },
    },
  }
})
