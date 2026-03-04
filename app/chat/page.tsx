'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import AgentsSheet from '@/components/AgentsSheet'
import TuneWatchlist from '@/components/TuneWatchlist'
import HoldingAnalysis from '@/components/HoldingAnalysis'
import { useAgents } from '@/app/context/agents'

const HOLDINGS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.',  price: '$4,992.03',  change: '-5.51%', neg: true },
  { symbol: 'AAPL', name: 'Apple Inc.',    price: '$18,287.65', change: '-0.47%', neg: true },
  { symbol: 'TSLA', name: 'Tesla Inc.',    price: '$12,257.40', change: '-2.08%', neg: true },
]

const AGENT_CONFIG: Record<string, { shortName: string; fullName: string; color: string }> = {
  ashley: { shortName: 'Analyst Ashley', fullName: 'Analyst Ashley', color: 'var(--positive)' },
  mike: { shortName: 'Monitor Mike', fullName: 'Monitor Mike', color: 'var(--coral)' },
  tom: { shortName: 'Tom Tracker', fullName: 'Tom Tracker', color: 'var(--accent-red)' },
}

const PROMPT_SUGGESTIONS = [
  "What's moving right now?",
  "How should I rebalance?",
  "What earnings are coming?",
  "Is this a good entry?",
  "What's your market outlook?",
  "Should I hedge my portfolio?",
  "Which sectors are hot?",
  "What about dividend yields?",
]

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  agent?: string
}

export default function ChatPage() {
  const { activeAgents } = useAgents()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [agentsOpen, setAgentsOpen] = useState(false)
  const [tuneOpen, setTuneOpen] = useState(false)
  const [agentIndex, setAgentIndex] = useState(0)
  const [showThinking, setShowThinking] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [selectedHolding, setSelectedHolding] = useState<typeof HOLDINGS[0] | null>(null)
  const [holdingAnalysisOpen, setHoldingAnalysisOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get agent names from context
  const getAgentName = (index: number) => {
    if (activeAgents.length === 0) return 'Monitor Mike'
    return AGENT_CONFIG[activeAgents[index % activeAgents.length].id].fullName
  }

  // Simulate agent thinking states
  useEffect(() => {
    if (isLoading && !showThinking && Math.random() > 0.5) {
      setShowThinking(true)
      const timer = setTimeout(() => setShowThinking(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, showThinking])

  // Rotate prompt suggestions every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex(prev => (prev + 1) % PROMPT_SUGGESTIONS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('alfaChatHistory', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setAgentIndex(prev => prev + 1)
    }
  }, [messages.length])

  // Auto-debate: Agents have continuous conversation every 20-30 seconds
  useEffect(() => {
    if (activeAgents.length === 0 || isLoading) return

    const interval = setInterval(() => {
      // Only add message if not currently loading
      if (isLoading) return

      const suggestions = [
        'Consider taking profits on NVDA at current resistance level',
        'Watch AAPL for a potential bounce off support',
        'MSFT showing bullish divergence on the daily chart',
        'Sector rotation from tech into utilities accelerating',
        'Recommend rebalancing toward defensive positions',
        'Oil prices supporting energy sector outperformance',
        'Fed rate decision could be catalyst for reversal',
        'Earnings expectations too low relative to analyst views',
        'Market breadth improving despite headline weakness',
        'Supply/demand imbalance creating trading opportunity',
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      const agentName = getAgentName(agentIndex)

      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: randomSuggestion,
        agent: agentName,
      }])
      setAgentIndex(prev => prev + 1)
    }, 20000 + Math.random() * 10000) // 20-30 seconds

    return () => clearInterval(interval)
  }, [isLoading, agentIndex, activeAgents.length])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    if (activeAgents.length === 0) {
      alert('Please enable at least one agent in the Agents page')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Generate unique message IDs upfront
    const userId = `user-${Date.now()}`
    const agent1SpinnerId = `spinner-1-${Date.now()}`
    const agent2SpinnerId = `spinner-2-${Date.now()}`

    // Add user message
    const userMsg: Message = {
      id: userId,
      role: 'user',
      text: userMessage,
    }
    setMessages(prev => [...prev, userMsg])

    // Add spinner for first agent
    const agent1Name = getAgentName(agentIndex)
    const spinner1: Message = {
      id: agent1SpinnerId,
      role: 'assistant',
      text: '...',
      agent: agent1Name,
    }
    setMessages(prev => [...prev, spinner1])

    // Fetch first agent response
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [userMsg] }),
    })
      .then(res => res.text())
      .then(text => {
        // Replace spinner with response using matching ID
        setMessages(prev =>
          prev.map(m =>
            m.id === agent1SpinnerId
              ? { id: agent1SpinnerId, role: 'assistant', text: text.trim() || 'Market conditions remain uncertain. Monitor your positions closely.', agent: agent1Name }
              : m
          )
        )

        // Second agent responds after delay
        setTimeout(() => {
          if (activeAgents.length < 2) {
            // If only one agent, don't show second response
            setAgentIndex(prev => prev + 1)
            setIsLoading(false)
            return
          }
          const agent2Name = getAgentName(agentIndex + 1)
          const spinner2: Message = {
            id: agent2SpinnerId,
            role: 'assistant',
            text: '...',
            agent: agent2Name,
          }
          setMessages(prev => [...prev, spinner2])

          // Get the first agent's response from messages for context
          setMessages(prev => {
            const firstAgentMsg = prev.find(m => m.id === agent1SpinnerId)

            fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: [userMsg, firstAgentMsg || { role: 'assistant', text: '' }]
              }),
            })
              .then(res => res.text())
              .then(text => {
                setMessages(curr =>
                  curr.map(m =>
                    m.id === agent2SpinnerId
                      ? { id: agent2SpinnerId, role: 'assistant', text: text.trim() || 'Consider diversifying your portfolio across different sectors.', agent: agent2Name }
                      : m
                  )
                )
                setAgentIndex(prev => prev + 2)
                setIsLoading(false)
              })
              .catch(err => {
                console.error('Second agent error:', err)
                setMessages(curr => curr.filter(m => m.id !== agent2SpinnerId))
                setIsLoading(false)
              })

            return prev
          })
        }, 1500)
      })
      .catch(err => {
        console.error('First agent error:', err)
        setMessages(prev => prev.filter(m => m.id !== agent1SpinnerId))
        setIsLoading(false)
      })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Chat" />

      <div style={{ padding: '12px 20px', flexShrink: 0, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'inline-flex', gap: 24, animation: 'marquee 40s linear infinite' }}>
          {HOLDINGS.map((h) => (
            <div
              key={h.symbol}
              onClick={() => {
                setSelectedHolding(h)
                setHoldingAnalysisOpen(true)
              }}
              style={{ display: 'flex', gap: 16, flexShrink: 0, minWidth: 'fit-content', cursor: 'pointer', padding: '8px 12px', borderRadius: 8, transition: 'all 0.2s', }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderRadius = '8px'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--cream)', letterSpacing: 0.5, fontWeight: 600 }}>{h.symbol}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--cream2)', marginTop: 2 }}>{h.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--cream)', fontWeight: 600 }}>{h.price}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: h.neg ? '#f44336' : '#4caf50', marginTop: 2 }}>{h.change}</div>
              </div>
            </div>
          ))}
          {/* Loop the holdings for seamless marquee */}
          {HOLDINGS.map((h) => (
            <div
              key={`loop-${h.symbol}`}
              onClick={() => {
                setSelectedHolding(h)
                setHoldingAnalysisOpen(true)
              }}
              style={{ display: 'flex', gap: 16, flexShrink: 0, minWidth: 'fit-content', cursor: 'pointer', padding: '8px 12px', borderRadius: 8, transition: 'all 0.2s', }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--cream)', letterSpacing: 0.5, fontWeight: 600 }}>{h.symbol}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--cream2)', marginTop: 2 }}>{h.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--cream)', fontWeight: 600 }}>{h.price}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: h.neg ? '#f44336' : '#4caf50', marginTop: 2 }}>{h.change}</div>
              </div>
            </div>
          ))}
        </div>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 10px' }}>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '6px 10px', borderRadius: 46, background: 'var(--surface)', border: '1px solid var(--rule)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: 'var(--cream2)' }}>
              Monitor Mike
            </div>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--coral)"
                strokeWidth="2"
                strokeDasharray="4 4"
                style={{ transformOrigin: '12px 12px' }}
              >
                <circle cx="12" cy="12" r="10" />
              </motion.svg>
            </motion.div>
            <motion.div
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.7, maxWidth: 280 }}
            >
              Markets are mostly down today. Your portfolio is off -1.96% (-$1,247). NVDA leading losses at -5.51%, MSFT the only green at +0.27%.
            </motion.div>
          </motion.div>
        )}

        {messages.map((m, idx) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
            style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            {m.role === 'assistant' && <div style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 46, background: 'var(--surface)', border: '1px solid var(--rule)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: 'var(--cream2)', marginBottom: 4 }}>{m.agent || 'Alfa'}</div>}
            <div style={{ maxWidth: m.role === 'user' ? 240 : 280, fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 300, color: m.role === 'user' ? 'var(--cream)' : 'var(--cream2)', lineHeight: 1.7 }}>
              {m.text}
              {m.role === 'assistant' && isLoading && <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--coral)', marginLeft: 2, animation: 'blink 1s infinite' }} />}
            </div>
          </motion.div>
        ))}

        {isLoading && (messages.length > 0 && messages[messages.length - 1].role === 'user' || messages.length === 0) && activeAgents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: messages.length * 0.05 }}
            style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}
          >
            <div style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 46, background: 'var(--surface)', border: '1px solid var(--rule)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: 'var(--cream2)' }}>
              {showThinking ? `${getAgentName(agentIndex)} thinking...` : getAgentName(agentIndex)}
            </div>
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={showThinking ? 'var(--cream2)' : 'var(--coral)'}
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ transformOrigin: '12px 12px' }}
            >
              <circle cx="12" cy="12" r="10" />
            </motion.svg>
          </motion.div>
        )}


        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '8px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {PROMPT_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(prompt)
                // Auto-send the prompt after a brief delay
                setTimeout(() => {
                  setInput('')
                  setIsLoading(true)

                  const userMsg: Message = {
                    id: Date.now().toString(),
                    role: 'user',
                    text: prompt,
                  }
                  setMessages(prev => [...prev, userMsg])

                  // Fetch agent response
                  fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [...messages, userMsg] }),
                  })
                    .then(res => res.text())
                    .then(text => {
                      const agentMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        text: text || 'Market conditions remain uncertain. Monitor your positions closely.',
                        agent: getAgentName(agentIndex),
                      }
                      setMessages(prev => [...prev, agentMsg])
                      setAgentIndex(prev => prev + 1)
                      setIsLoading(false)
                    })
                    .catch(err => {
                      console.error('Error:', err)
                      setIsLoading(false)
                    })
                }, 50)
              }}
              style={{
                padding: '4px 0',
                background: 'transparent',
                border: 'none',
                fontFamily: "'EB Garamond', serif",
                fontSize: 14,
                fontWeight: 300,
                color: 'var(--cream2)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--coral)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--cream2)'
              }}
            >
              {prompt}
            </button>
          ))}
          <style>{`::-webkit-scrollbar { display: none; }`}</style>
        </div>
      </div>

      <div style={{ padding: '20px 20px 30px', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface)', border: focused ? '2px solid var(--coral)' : '1px solid var(--rule)', borderRadius: 12, padding: '16px', minHeight: 100 }}>
          <motion.div
            key={promptIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ flex: 1 }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={PROMPT_SUGGESTIONS[promptIndex]}
              style={{
                flex: 1,
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'EB Garamond', serif",
                fontSize: 14,
                fontWeight: 300,
                color: 'var(--cream)',
                fontStyle: focused ? 'italic' : 'normal',
                resize: 'none',
                minHeight: 40,
              }}
            />
          </motion.div>
          <style>{`input::placeholder { color: var(--cream2); opacity: 0.7; }`}</style>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: 'var(--cream2)', cursor: 'pointer' }} onClick={() => setAgentsOpen(true)}>
                {activeAgents.length} Agents
              </span>
              <span style={{ color: 'var(--cream2)', fontSize: 10 }}>·</span>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: 'var(--cream2)', cursor: 'pointer' }} onClick={() => setTuneOpen(true)}>
                Tune Watchlist
              </span>
            </div>

            <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{ background: 'none', border: 'none', padding: '0 4px', cursor: input.trim() ? 'pointer' : 'default', color: input.trim() ? 'var(--coral)' : 'var(--dust)', display: 'flex', flexShrink: 0 }}>
              <IconSend />
            </button>
          </div>
        </div>
      </div>

      <AgentsSheet isOpen={agentsOpen} onClose={() => setAgentsOpen(false)} />
      <TuneWatchlist isOpen={tuneOpen} onClose={() => setTuneOpen(false)} />
      <HoldingAnalysis isOpen={holdingAnalysisOpen} onClose={() => setHoldingAnalysisOpen(false)} holding={selectedHolding} />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}
