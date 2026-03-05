'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import BottomSheet from './BottomSheet'

interface Agent {
  id: string
  name: string
  desc: string
  active: boolean
}

const INITIAL_AGENTS: Agent[] = [
  { id: 'ashley', name: 'ANALYST ASHLEY', desc: 'Market scanner. Concise signals.', active: true },
  { id: 'mike', name: 'MONITOR MIKE', desc: 'Deep analyst. Fundamentals & sentiment.', active: true },
  { id: 'tom', name: 'TRADER TOM', desc: 'Friendly advisor. Explains like a human.', active: false },
  { id: 'portfolio', name: 'PORTFOLIO PETE', desc: 'Allocation strategist. Rebalancing focus.', active: false },
  { id: 'risk', name: 'RISK RACHEL', desc: 'Volatility expert. Risk-adjusted returns.', active: false },
  { id: 'macro', name: 'MACRO MARCUS', desc: 'Economic trends. Macro outlook & flows.', active: false },
  { id: 'news', name: 'NEWS NADIA', desc: 'News aggregator. Breaking catalysts.', active: false },
  { id: 'crypto', name: 'CRYPTO CARLOS', desc: 'Digital assets specialist. On-chain data.', active: false },
  { id: 'options', name: 'OPTIONS OLE', desc: 'Derivatives expert. IV & skew analysis.', active: false },
  { id: 'sector', name: 'SECTOR SAMUEL', desc: 'Rotation tracker. Outflow/inflow analyzer.', active: false },
  { id: 'earnings', name: 'EARNINGS EVE', desc: 'Earnings calendar. Surprise probability.', active: false },
  { id: 'dividend', name: 'DIVIDEND DAVE', desc: 'Income strategist. Yield optimization.', active: false },
  { id: 'technical', name: 'TECHNICAL TINA', desc: 'Chart pattern expert. Support/resistance.', active: false },
  { id: 'sentiment', name: 'SENTIMENT SIMON', desc: 'Social sentiment. Retail vs institutional.', active: false },
  { id: 'momentum', name: 'MOMENTUM MAY', desc: 'Velocity tracker. Acceleration signals.', active: false },
]

export default function AgentsSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [agents, setAgents] = useState(INITIAL_AGENTS)

  const toggle = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Agents">
      {/* Agent list */}
      {agents.map((agent, idx) => (
        <motion.div
          key={agent.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '18px 0',
            borderBottom: '1px solid var(--rule-subtle)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: agent.active ? 'var(--cream)' : 'var(--dust)',
              letterSpacing: 1,
            }}>
              {agent.name}
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              color: 'var(--dust)',
              marginTop: 3,
            }}>
              {agent.desc}
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => toggle(agent.id)}
            style={{
              width: 48,
              height: 28,
              borderRadius: 14,
              background: agent.active ? 'var(--cream)' : 'var(--bg2)',
              border: agent.active ? 'none' : '1px solid var(--rule)',
              padding: 3,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: agent.active ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: agent.active ? 'var(--pure-black)' : 'var(--dust)',
            }} />
          </button>
        </motion.div>
      ))}

      {/* Add agent */}
      <motion.button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          padding: '18px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 14,
          color: 'var(--dust)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add agent
      </motion.button>
    </BottomSheet>
  )
}
