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

const AGENT_COLORS: Record<string, string> = {
  ashley: '#4caf50',
  mike: '#ff7043',
  tom: '#f44336',
  portfolio: '#2196f3',
  risk: '#ff9800',
  macro: '#9c27b0',
  news: '#00bcd4',
  crypto: '#ffc107',
  options: '#e91e63',
}

const AGENT_CONFIG: Record<string, { shortName: string; fullName: string; color: string; dotColor: string }> = {
  ashley: { shortName: 'Analyst Ashley', fullName: 'Analyst Ashley', color: 'var(--positive)', dotColor: AGENT_COLORS.ashley },
  mike: { shortName: 'Monitor Mike', fullName: 'Monitor Mike', color: 'var(--coral)', dotColor: AGENT_COLORS.mike },
  tom: { shortName: 'Tom Tracker', fullName: 'Tom Tracker', color: 'var(--accent-red)', dotColor: AGENT_COLORS.tom },
  portfolio: { shortName: 'Portfolio Pete', fullName: 'Portfolio Pete', color: 'var(--coral)', dotColor: AGENT_COLORS.portfolio },
  risk: { shortName: 'Risk Rachel', fullName: 'Risk Rachel', color: 'var(--coral)', dotColor: AGENT_COLORS.risk },
  macro: { shortName: 'Macro Marcus', fullName: 'Macro Marcus', color: 'var(--coral)', dotColor: AGENT_COLORS.macro },
  news: { shortName: 'News Nadia', fullName: 'News Nadia', color: 'var(--coral)', dotColor: AGENT_COLORS.news },
  crypto: { shortName: 'Crypto Carlos', fullName: 'Crypto Carlos', color: 'var(--coral)', dotColor: AGENT_COLORS.crypto },
  options: { shortName: 'Options Ole', fullName: 'Options Ole', color: 'var(--coral)', dotColor: AGENT_COLORS.options },
}

const PROMPT_SUGGESTIONS = [
  "Yo, what's popping in the market?",
  "How do I rebalance this thing?",
  "What earnings are dropping soon?",
  "Good time to jump in?",
  "What's your vibe on the market?",
  "Should I hedge up?",
  "Which sectors are getting hot?",
  "Whats the dividend action look like?",
  "Compare NVDA vs AMD last 90 days →",
  "Chart my portfolio allocation →",
  "Show sector exposure heatmap →",
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
  const [tickerVisible, setTickerVisible] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get agent names from context
  const getAgentName = (index: number) => {
    if (activeAgents.length === 0) return 'Monitor Mike'
    return AGENT_CONFIG[activeAgents[index % activeAgents.length].id].fullName
  }

  // Get agent dot color from agent name
  const getAgentDotColor = (agentName: string) => {
    for (const [key, config] of Object.entries(AGENT_CONFIG)) {
      if (config.fullName === agentName) {
        return config.dotColor
      }
    }
    return '#ff7043' // Default to coral if not found
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

    // Reset agent index for fresh debate on each query
    setAgentIndex(0)

    const userId = `user-${Date.now()}`
    const userMsg: Message = {
      id: userId,
      role: 'user',
      text: userMessage,
    }
    setMessages(prev => [...prev, userMsg])

    // Sequential agent responses with debate
    const agentsToQuery = activeAgents
    let agentResponses: Message[] = []
    let currentAgentIdx = 0

    const queryNextAgent = () => {
      if (currentAgentIdx >= agentsToQuery.length) {
        setIsLoading(false)
        return
      }

      const agentName = agentsToQuery[currentAgentIdx].name
      const spinnerId = `spinner-${currentAgentIdx}-${Date.now()}`
      const spinnerMsg: Message = {
        id: spinnerId,
        role: 'assistant',
        text: '...',
        agent: agentName,
      }

      setMessages(prev => [...prev, spinnerMsg])

      // Build conversation history: user message + previous agent responses
      const conversationHistory = [userMsg, ...agentResponses]

      // Add debate system message if not first agent
      const systemPrompt = currentAgentIdx > 0
        ? `You are ${agentName}. The previous agents have shared their perspectives. Challenge, debate, or build upon their points. Disagree if you see flaws. Be authentic and engaging in the discussion.`
        : `You are ${agentName}. Give your initial perspective on this market question.`

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          systemPrompt: systemPrompt
        }),
      })
        .then(res => res.text())
        .then(text => {
          const agentResponse: Message = {
            id: spinnerId,
            role: 'assistant',
            text: text.trim() || 'I agree with my colleagues. Let me add my perspective.',
            agent: agentName,
          }
          agentResponses.push(agentResponse)

          // Replace spinner with response
          setMessages(prev =>
            prev.map(m =>
              m.id === spinnerId
                ? agentResponse
                : m
            )
          )

          currentAgentIdx++
          // Small delay between agent responses for natural debate pacing
          setTimeout(queryNextAgent, 800)
        })
        .catch(err => {
          console.error(`Agent ${agentName} error:`, err)
          // Keep the message in thread but show error
          const errorResponse: Message = {
            id: spinnerId,
            role: 'assistant',
            text: 'I need to reconsider that position based on the debate.',
            agent: agentName,
          }
          setMessages(prev =>
            prev.map(m =>
              m.id === spinnerId ? errorResponse : m
            )
          )
          currentAgentIdx++
          setTimeout(queryNextAgent, 800)
        })
    }

    queryNextAgent()
  }

  const tickerToggleButton = (
    <button
      onClick={() => setTickerVisible(!tickerVisible)}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--cream2)',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.color = 'var(--cream)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.color = 'var(--cream2)'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Chat" rightButton={tickerToggleButton} />

      <motion.div
        initial={false}
        animate={{ height: tickerVisible ? 'auto' : 0, opacity: tickerVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden', flexShrink: 0 }}
      >
        <div style={{ padding: '12px 20px', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', background: 'var(--bg)' }}>
        <div style={{ display: 'inline-flex', gap: 12, animation: 'marquee 60s linear infinite' }}>
          {[...Array(4)].map((_, round) =>
            HOLDINGS.map((h) => (
              <div
                key={`${round}-${h.symbol}`}
                onClick={() => {
                  setSelectedHolding(h)
                  setHoldingAnalysisOpen(true)
                }}
                style={{ display: 'flex', gap: 16, flexShrink: 0, minWidth: 'fit-content', cursor: 'pointer', padding: '8px 12px', borderRadius: 8, transition: 'all 0.2s' }}
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
            ))
          )}
        </div>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        </div>
      </motion.div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 10px', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12, paddingLeft: 20, paddingRight: 20, borderBottom: '1px solid var(--rule-subtle)' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 46, background: 'var(--surface)', border: '1px solid var(--rule)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--cream2)', marginBottom: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff7043', flexShrink: 0 }} />
              Alfa Intro
            </div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.7, width: '100%' }}>
              Hey! I'm Alfa, your AI investment analyst. Ask me about your portfolio, market trends, earnings, sector rotation, or use prompts like "Compare NVDA vs AMD" to generate charts. Your active agents are analyzing the market 24/7 — let's get to work.
            </div>
          </motion.div>
        )}

        {messages.map((m) => {
          const isLoading = m.role === 'assistant' && m.text === '...'
          return (
            <motion.div key={m.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', paddingTop: 12, paddingBottom: 12, paddingLeft: 20, paddingRight: 20, borderBottom: '1px solid var(--rule-subtle)' }}
            >
              {m.role === 'assistant' && !isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 46, background: 'var(--surface)', border: '1px solid var(--rule)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--cream2)' }}>
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: getAgentDotColor(m.agent || 'Alfa'),
                        flexShrink: 0,
                      }}
                    />
                    {m.agent || 'Alfa'}
                  </div>
                </div>
              )}
              {!isLoading && (
                <div style={{ width: '100%', fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 300, color: m.role === 'user' ? 'var(--cream)' : 'var(--cream2)', lineHeight: 1.7 }}>
                  {m.text}
                </div>
              )}
              {isLoading && (
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={getAgentDotColor(m.agent || 'Alfa')}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{ transformOrigin: '50% 50%', marginTop: 12 }}
                >
                  <circle cx="12" cy="12" r="10" />
                </motion.svg>
              )}
            </motion.div>
          )
        })}

        {isLoading && (messages.length > 0 && messages[messages.length - 1].role === 'user' || messages.length === 0) && activeAgents.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}
          >
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--coral)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              style={{ transformOrigin: '50% 50%' }}
            >
              <circle cx="12" cy="12" r="10" />
            </motion.svg>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '8px 20px 0', flexShrink: 0, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '1020px', width: '100%' }}>
          {PROMPT_SUGGESTIONS.map((prompt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                fontFamily: "'EB Garamond', serif",
                fontSize: 14,
                fontWeight: 300,
                color: 'var(--cream2)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--coral)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--cream2)'
              }}
            >
              {prompt}
            </motion.button>
          ))}
          <style>{`::-webkit-scrollbar { display: none; }`}</style>
        </div>
      </div>

      <div style={{ padding: '20px 20px 30px', flexShrink: 0, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface)', border: focused ? '2px solid var(--coral)' : '1px solid var(--rule)', borderRadius: 12, padding: '16px', minHeight: 100, maxWidth: '1020px', width: '100%' }}>
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

            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: input.trim() ? 1.1 : 1 }}
              whileTap={{ scale: input.trim() ? 0.92 : 1 }}
              style={{ background: 'none', border: 'none', padding: '0 4px', cursor: input.trim() ? 'pointer' : 'default', color: input.trim() ? 'var(--coral)' : 'var(--dust)', display: 'flex', flexShrink: 0 }}
            >
              <motion.div animate={isLoading ? { rotate: 360 } : {}} transition={isLoading ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}>
                <IconSend />
              </motion.div>
            </motion.button>
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
