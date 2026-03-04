'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface Agent {
  id: string
  name: string
  active: boolean
}

interface AgentContextType {
  agents: Agent[]
  toggleAgent: (id: string) => void
  activeAgents: Agent[]
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

const INITIAL_AGENTS: Agent[] = [
  { id: 'ashley', name: 'Analyst Ashley', active: true },
  { id: 'mike', name: 'Monitor Mike', active: true },
  { id: 'tom', name: 'Tom Tracker', active: true },
]

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const activeAgents = agents.filter(a => a.active)

  return (
    <AgentContext.Provider value={{ agents, toggleAgent, activeAgents }}>
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
