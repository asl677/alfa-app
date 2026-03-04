'use client'
import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react'

interface Agent {
  id: string
  shortName: string
  fullName: string
  role: string
  lastAction: string
  dotColor: string
  active: boolean
}

interface AgentContextType {
  agents: Agent[]
  toggleAgent: (id: string) => void
  activeAgents: Agent[]
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'ashley',
    shortName: 'Ashley',
    fullName: 'Analyst Ashley',
    role: 'Market scanner. Concise signals.',
    lastAction: '2m ago — NVDA breakout alert',
    dotColor: '#4caf50',
    active: true
  },
  {
    id: 'mike',
    shortName: 'Mike',
    fullName: 'Monitor Mike',
    role: 'Deep analyst. Fundamentals & sentiment.',
    lastAction: '15m ago — Portfolio rebalance suggestion',
    dotColor: '#ff7043',
    active: true
  },
  {
    id: 'tom',
    shortName: 'Tom',
    fullName: 'Tom Tracker',
    role: 'Technical trader. Charts & patterns.',
    lastAction: 'Active — monitoring spreads',
    dotColor: '#f44336',
    active: true
  },
  {
    id: 'portfolio',
    shortName: 'Pete',
    fullName: 'Portfolio Pete',
    role: 'Allocation strategist. Rebalancing expert.',
    lastAction: '5m ago — Allocation review',
    dotColor: '#2196f3',
    active: false
  },
  {
    id: 'risk',
    shortName: 'Rachel',
    fullName: 'Risk Rachel',
    role: 'Risk manager. Downside protection.',
    lastAction: '8m ago — Hedging alert',
    dotColor: '#ff9800',
    active: false
  },
  {
    id: 'macro',
    shortName: 'Marcus',
    fullName: 'Macro Marcus',
    role: 'Macro analyst. Economic trends.',
    lastAction: '3m ago — Fed outlook update',
    dotColor: '#9c27b0',
    active: false
  },
  {
    id: 'news',
    shortName: 'Nadia',
    fullName: 'News Nadia',
    role: 'News aggregator. Market catalysts.',
    lastAction: '1m ago — Breaking news alert',
    dotColor: '#00bcd4',
    active: false
  },
  {
    id: 'crypto',
    shortName: 'Carlos',
    fullName: 'Crypto Carlos',
    role: 'Crypto analyst. Digital assets.',
    lastAction: '12m ago — BTC technical update',
    dotColor: '#ffc107',
    active: false
  },
  {
    id: 'options',
    shortName: 'Ole',
    fullName: 'Options Ole',
    role: 'Derivatives trader. Greeks & premiums.',
    lastAction: '20m ago — Put spread setup',
    dotColor: '#e91e63',
    active: false
  },
]

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)

  const toggleAgent = useCallback((id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }, [])

  const activeAgents = useMemo(() => agents.filter(a => a.active), [agents])

  const value = useMemo(() => ({ agents, toggleAgent, activeAgents }), [agents, toggleAgent, activeAgents])

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  )
}

export function useAgents() {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgents must be used within AgentProvider')
  }
  return context
}
