'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import AgentsSheet from '@/components/AgentsSheet'
import TuneWatchlist from '@/components/TuneWatchlist'
import ToneOptions from '@/components/ToneOptions'
import HoldingAnalysis from '@/components/HoldingAnalysis'
import { useAgents } from '@/app/context/agents'
import { detectChartPrompt, generateChartData } from '@/lib/chartGenerator'

const HOLDINGS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.',  price: '$4,992.03',  change: '-5.51%', neg: true },
  { symbol: 'AAPL', name: 'Apple Inc.',    price: '$18,287.65', change: '-0.47%', neg: true },
  { symbol: 'TSLA', name: 'Tesla Inc.',    price: '$12,257.40', change: '-2.08%', neg: true },
]


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

const STOCK_SYMBOLS = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD', 'AVGO', 'INTC']
const SECTORS = ['Tech', 'Energy', 'Healthcare', 'Finance', 'Utilities', 'Retail', 'Materials']

const generateDynamicPrompts = (messages: Message[]): string[] => {
  // Get recent agent messages
  const recentMessages = messages.filter(m => m.role === 'assistant').slice(-5)

  if (recentMessages.length === 0) return PROMPT_SUGGESTIONS

  const combinedText = recentMessages.map(m => m.text).join(' ').toUpperCase()

  // Extract mentions of stocks, sectors, and themes
  const mentionedStocks = STOCK_SYMBOLS.filter(s => combinedText.includes(s))
  const mentionedSectors = SECTORS.filter(s => combinedText.includes(s.toUpperCase()))

  const prompts: string[] = []

  // Generate prompts based on detected content
  if (mentionedStocks.length > 0) {
    const stock1 = mentionedStocks[0]
    const stock2 = mentionedStocks[Math.min(1, mentionedStocks.length - 1)]
    prompts.push(`Deep dive on ${stock1} →`)
  }

  if (combinedText.includes('SECTOR') || combinedText.includes('ROTATION')) {
    prompts.push('Which sectors are rotating?')
  }

  if (combinedText.includes('EARNINGS') || combinedText.includes('EPS')) {
    prompts.push('What earnings are next?')
  }

  if (combinedText.includes('DIVIDEND') || combinedText.includes('YIELD')) {
    prompts.push('Show dividend leaders →')
  }

  if (combinedText.includes('VOLATILITY') || combinedText.includes('RISK')) {
    prompts.push('How do I hedge this?')
  }

  if (combinedText.includes('PORTFOLIO') || combinedText.includes('ALLOCATION')) {
    prompts.push('Rebalance recommendations →')
  }

  if (combinedText.includes('UPTREND') || combinedText.includes('BULLISH')) {
    prompts.push('What else is breaking out?')
  }

  if (combinedText.includes('DOWNTREND') || combinedText.includes('BEARISH')) {
    prompts.push('Where are the bounces?')
  }

  if (combinedText.includes('FED') || combinedText.includes('RATE')) {
    prompts.push('What do rate cuts mean?')
  }

  if (combinedText.includes('MACRO') || combinedText.includes('INFLATION')) {
    prompts.push('How does macro affect me?')
  }

  // Add some generic follow-ups
  prompts.push("What's your contrarian take?")
  prompts.push("Chart this setup →")

  // Return unique prompts, pad with defaults if needed
  const uniquePrompts = Array.from(new Set(prompts))
  return uniquePrompts.length > 0 ? uniquePrompts : PROMPT_SUGGESTIONS
}

const IconArrowUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
)

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  agent?: string
}

export default function ChatPage() {
  const { activeAgents, agents } = useAgents()
  const [messages, setMessages] = useState<Message[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [agentsOpen, setAgentsOpen] = useState(false)
  const [tuneOpen, setTuneOpen] = useState(false)
  const [toneOpen, setToneOpen] = useState(false)
  const [selectedTone, setSelectedTone] = useState('casual')
  const [agentIndex, setAgentIndex] = useState(0)
  const [showThinking, setShowThinking] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [selectedHolding, setSelectedHolding] = useState<typeof HOLDINGS[0] | null>(null)
  const [holdingAnalysisOpen, setHoldingAnalysisOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tickerVisible, setTickerVisible] = useState(true)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [pageLoading, setPageLoading] = useState(true)

  // Initialize page loading
  useEffect(() => {
    setPageLoading(false)
  }, [])

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('alfaChatHistory')
    if (savedChat) {
      try {
        const parsedMessages = JSON.parse(savedChat)
        setMessages(parsedMessages)
      } catch (err) {
        console.error('Error loading chat history:', err)
      }
    }
    setIsHydrated(true)
  }, [])

  // Get agent names from context
  const getAgentName = (index: number) => {
    if (activeAgents.length === 0) return 'Monitor Mike'
    return activeAgents[index % activeAgents.length].fullName
  }

  // Get agent dot color from agent name
  const getAgentDotColor = (agentName: string) => {
    const agent = agents.find(a => a.fullName === agentName)
    return agent?.dotColor || '#ff7043' // Default to coral if not found
  }

  // Simulate agent thinking states
  useEffect(() => {
    if (isLoading && !showThinking && Math.random() > 0.5) {
      setShowThinking(true)
      const timer = setTimeout(() => setShowThinking(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, showThinking])

  // Get dynamic prompts based on conversation
  const dynamicPrompts = generateDynamicPrompts(messages)

  // Rotate prompt suggestions every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex(prev => (prev + 1) % dynamicPrompts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [dynamicPrompts.length])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('alfaChatHistory', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setIsScrolledToBottom(true)
  }, [messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setIsScrolledToBottom(isAtBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setAgentIndex(prev => prev + 1)
    }
  }, [messages.length])

  // Track previous agents count to detect additions
  const prevAgentCountRef = useRef(activeAgents.length)

  // Handle newly added agents - trigger response from them
  useEffect(() => {
    const previousCount = prevAgentCountRef.current
    const currentCount = activeAgents.length

    // If agents were added and there are user messages in the thread
    if (currentCount > previousCount && messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
      if (lastUserMessage) {
        // Trigger response from the first newly added agent
        const newAgents = activeAgents.filter(agent =>
          !messages.some(m => m.agent === agent.fullName)
        )

        if (newAgents.length > 0) {
          const newAgent = newAgents[0]
          const agentName = newAgent.fullName
          const spinnerId = `spinner-${Date.now()}`

          setMessages(prev => [...prev, {
            id: spinnerId,
            role: 'assistant',
            text: '...',
            agent: agentName,
          }])

          const systemPrompt = `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. Throw in some personality. The other agents already shared their takes - either build on them or tell them why they're wrong. Keep it real, no BS.`
          const conversationHistory = [lastUserMessage, ...messages.filter(m => m.role === 'assistant')]

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
              setMessages(prev =>
                prev.map(m =>
                  m.id === spinnerId
                    ? { ...m, text: text.trim() || 'Yeah, I feel you on that. Here\'s my take...' }
                    : m
                )
              )
            })
            .catch(err => console.error('Error fetching agent response:', err))
        }
      }
    }

    prevAgentCountRef.current = currentCount
  }, [activeAgents.length, messages])

  // Auto-debate: Agents have continuous conversation every 20-30 seconds
  useEffect(() => {
    if (activeAgents.length === 0 || isLoading) return

    const interval = setInterval(() => {
      // Only add message if not currently loading
      if (isLoading) return

      const suggestions = [
        'Yo, NVDA might be a good place to take some profits right now',
        'Heads up - AAPL looking like it could bounce here',
        'MSFT chart is looking pretty bullish if you ask me',
        'Tech is getting overheated - might see rotation into utilities soon',
        'Real talk, I\'d probably trim some of my tech exposure',
        'Energy\'s looking strong on the oil uptick',
        'Fed decision next week could shake things up',
        'These earnings expectations might be too pessimistic',
        'Market breadth is actually improving - that\'s bullish',
        'There\'s a real supply/demand mismatch here - opportunity incoming',
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

      const agentName = agentsToQuery[currentAgentIdx].fullName
      const spinnerId = `spinner-${currentAgentIdx}-${Date.now()}`
      const spinnerMsg: Message = {
        id: spinnerId,
        role: 'assistant',
        text: '...',
        agent: agentName,
      }

      console.log('ADDING SPINNER:', agentName, spinnerId)
      setMessages(prev => [...prev, spinnerMsg])

      // Build conversation history: user message + previous agent responses
      const conversationHistory = [userMsg, ...agentResponses]

      // Add debate system message if not first agent
      const systemPrompt = currentAgentIdx > 0
        ? `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. Challenge the previous agents if you disagree, throw in some personality, keep it real. No corporate jargon.`
        : `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. Share your real take on their question with personality and authenticity. Keep it brief and actionable.`

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
            text: text.trim() || 'Yeah, that makes sense. Here\'s what I\'m seeing though...',
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
          // Longer delay between agent responses for natural debate pacing
          setTimeout(queryNextAgent, 4000)
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
          setTimeout(queryNextAgent, 4000)
        })
    }

    // Delay before first agent starts responding
    setTimeout(queryNextAgent, 3000)
  }

  const clearChatButton = (
    <button
      onClick={() => {
        setMessages([])
        localStorage.removeItem('alfaChatHistory')
      }}
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
        marginRight: 12,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.color = 'var(--coral)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.color = 'var(--cream2)'
      }}
      title="Clear chat"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/>
        <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
        <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/>
        <path d="M10 3h4a1 1 0 0 1 1 1v1H9V4a1 1 0 0 1 1-1z"/>
      </svg>
    </button>
  )

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

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg)' }}>
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          style={{ transformOrigin: '50% 50%' }}
        >
          <circle cx="12" cy="12" r="10" />
        </motion.svg>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Chat" rightButton={<div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>{clearChatButton}{tickerToggleButton}</div>} />

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

      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 20px', borderBottom: '1px solid var(--rule-subtle)', width: '100%', maxWidth: '1020px', margin: '0 auto', boxSizing: 'border-box' }}
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

      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0, padding: '12px 20px', maxWidth: '1020px', margin: '0 auto', width: '100%', position: 'relative', boxSizing: 'border-box' }}>

        {messages.map((m) => {
          const messageIsLoading = m.role === 'assistant' && m.text === '...'
          if (messageIsLoading) console.log('SPINNER FOUND:', m.agent, m.text)
          const isUser = m.role === 'user'
          return (
            <motion.div key={m.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', paddingTop: 12, paddingBottom: 12, borderBottom: '1px solid var(--rule-subtle)', width: '100%' }}
            >
              {m.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  {messageIsLoading && (
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={getAgentDotColor(m.agent || 'Alfa')}
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      style={{ transformOrigin: '50% 50%', flexShrink: 0, marginRight: 2, marginBottom: 2 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                    </motion.svg>
                  )}
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
              {!messageIsLoading && (
                <>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 300, color: m.role === 'user' ? 'var(--cream)' : 'var(--cream2)', lineHeight: 1.7, textAlign: isUser ? 'right' : 'left' }}>
                    {m.text}
                  </div>
                  {m.role === 'assistant' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      {m.agent?.includes('Ashley') && (
                        <button style={{ background: 'none', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--coral)', cursor: 'pointer', padding: 0 }}>
                          Add to watchlist
                        </button>
                      )}
                      {m.agent?.includes('Mike') && (
                        <button style={{ background: 'none', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--coral)', cursor: 'pointer', padding: 0 }}>
                          Rebalance now
                        </button>
                      )}
                      {m.agent?.includes('Tom') && (
                        <button style={{ background: 'none', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--coral)', cursor: 'pointer', padding: 0 }}>
                          Chart setup
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '8px 20px 0', flexShrink: 0, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '1020px', width: '100%' }}>
          {dynamicPrompts.map((prompt, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                // Auto-send the prompt without showing in input (no flicker)
                setIsLoading(true)

                const userMsg: Message = {
                  id: Date.now().toString(),
                  role: 'user',
                  text: prompt,
                }
                setMessages(prev => [...prev, userMsg])

                  // Check if this is a chart/artifact prompt
                  const chartDetection = detectChartPrompt(prompt)

                  if (chartDetection) {
                    // Generate and store artifact
                    const chartData = generateChartData(chartDetection.type, chartDetection.symbols)
                    const artifact = {
                      id: `artifact-${Date.now()}`,
                      type: chartDetection.type,
                      title: chartDetection.title,
                      data: chartData,
                      created_at: new Date().toISOString(),
                    }

                    // Save to localStorage
                    const existing = localStorage.getItem('artifacts')
                    const artifacts = existing ? JSON.parse(existing) : []
                    artifacts.unshift(artifact)
                    localStorage.setItem('artifacts', JSON.stringify(artifacts))

                    // Trigger agent debate on the artifact
                    const agentsToQuery = activeAgents
                    let agentResponses: Message[] = []
                    let currentAgentIdx = 0

                    const queryNextAgent = () => {
                      if (currentAgentIdx >= agentsToQuery.length) {
                        setIsLoading(false)
                        return
                      }

                      const agentName = agentsToQuery[currentAgentIdx].fullName
                      const spinnerId = `spinner-${currentAgentIdx}-${Date.now()}`
                      const spinnerMsg: Message = {
                        id: spinnerId,
                        role: 'assistant',
                        text: '...',
                        agent: agentName,
                      }

                      setMessages(prev => [...prev, spinnerMsg])

                      const conversationHistory = [userMsg, ...agentResponses]

                      const systemPrompt = currentAgentIdx > 0
                        ? `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. The artifact "${chartDetection.title}" was just generated. React to it and add your take. Challenge the previous agents if you disagree, throw in some personality, keep it real. No corporate jargon.`
                        : `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. The artifact "${chartDetection.title}" was just generated. Give your quick take on what you see. Keep it brief and actionable.`

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
                            text: text.trim() || 'Yeah, that makes sense. Here\'s what I\'m seeing though...',
                            agent: agentName,
                          }
                          agentResponses.push(agentResponse)

                          setMessages(prev =>
                            prev.map(m =>
                              m.id === spinnerId
                                ? agentResponse
                                : m
                            )
                          )

                          currentAgentIdx++
                          setTimeout(queryNextAgent, 4000)
                        })
                        .catch(err => {
                          console.error(`Agent ${agentName} error:`, err)
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
                          setTimeout(queryNextAgent, 4000)
                        })
                    }

                    setTimeout(queryNextAgent, 3000)
                  } else {
                    // Fetch agent responses for regular prompts
                    const agentsToQuery = activeAgents
                    let agentResponses: Message[] = []
                    let currentAgentIdx = 0

                    const queryNextAgent = () => {
                      if (currentAgentIdx >= agentsToQuery.length) {
                        setIsLoading(false)
                        return
                      }

                      const agentName = agentsToQuery[currentAgentIdx].fullName
                      const spinnerId = `spinner-${currentAgentIdx}-${Date.now()}`
                      const spinnerMsg: Message = {
                        id: spinnerId,
                        role: 'assistant',
                        text: '...',
                        agent: agentName,
                      }

                      console.log('ADDING SPINNER (regular prompt):', agentName)
                      setMessages(prev => [...prev, spinnerMsg])

                      const conversationHistory = [userMsg, ...agentResponses]
                      const systemPrompt = currentAgentIdx > 0
                        ? `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. Challenge previous agents if you disagree, throw in some personality, keep it real.`
                        : `You are ${agentName}. Talk like a friend giving investment advice. Be casual, conversational, and direct. Share your real take. Keep it brief and actionable.`

                      fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: conversationHistory, systemPrompt }),
                      })
                        .then(res => res.text())
                        .then(text => {
                          const agentResponse: Message = {
                            id: spinnerId,
                            role: 'assistant',
                            text: text.trim() || 'Yeah, that makes sense. Here\'s what I\'m seeing though...',
                            agent: agentName,
                          }
                          agentResponses.push(agentResponse)

                          setMessages(prev =>
                            prev.map(m =>
                              m.id === spinnerId ? agentResponse : m
                            )
                          )

                          currentAgentIdx++
                          setTimeout(queryNextAgent, 4000)
                        })
                        .catch(err => {
                          console.error(`Agent ${agentName} error:`, err)
                          const errorResponse: Message = {
                            id: spinnerId,
                            role: 'assistant',
                            text: 'I need to reconsider that position based on the debate.',
                            agent: agentName,
                          }
                          setMessages(prev =>
                            prev.map(m => m.id === spinnerId ? errorResponse : m)
                          )
                          currentAgentIdx++
                          setTimeout(queryNextAgent, 4000)
                        })
                    }

                    setTimeout(queryNextAgent, 3000)
                  }
              }}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface)', border: focused ? '2px solid var(--coral)' : '1px solid var(--rule)', borderRadius: 16, padding: '16px', minHeight: 100, maxWidth: '1020px', width: '100%', transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
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
              placeholder={dynamicPrompts[promptIndex] || PROMPT_SUGGESTIONS[0]}
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
              <span style={{ color: 'var(--cream2)', fontSize: 10 }}>·</span>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: 'var(--cream2)', cursor: 'pointer' }} onClick={() => setToneOpen(true)}>
                Tone
              </span>
            </div>

            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: input.trim() ? 1.1 : 1 }}
              whileTap={{ scale: input.trim() ? 0.92 : 1 }}
              style={{ background: 'none', border: 'none', padding: '0 4px', cursor: input.trim() ? 'pointer' : 'default', color: input.trim() ? 'var(--coral)' : 'var(--dust)', display: 'flex', flexShrink: 0 }}
            >
              {isLoading ? (
                <motion.svg
                  key={messages.filter(m => m.role === 'assistant').pop()?.agent || 'spinner'}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={messages.filter(m => m.role === 'assistant').pop()?.agent ? (agents.find(a => a.fullName === messages.filter(m => m.role === 'assistant').pop()?.agent)?.dotColor || '#ff7043') : '#ff7043'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{ transformOrigin: '50% 50%' }}
                >
                  <circle cx="12" cy="12" r="10" />
                </motion.svg>
              ) : (
                <IconArrowUp />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AgentsSheet isOpen={agentsOpen} onClose={() => setAgentsOpen(false)} />
      <TuneWatchlist isOpen={tuneOpen} onClose={() => setTuneOpen(false)} />
      <ToneOptions isOpen={toneOpen} onClose={() => setToneOpen(false)} selectedTone={selectedTone} onSelectTone={setSelectedTone} />
      <HoldingAnalysis isOpen={holdingAnalysisOpen} onClose={() => setHoldingAnalysisOpen(false)} holding={selectedHolding} />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}
