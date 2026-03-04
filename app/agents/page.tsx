'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import { fadeUp } from '@/lib/animations'
import { useAgents } from '@/app/context/agents'

const AGENT_DETAILS: Record<string, { name: string; role: string; lastAction: string; shortName: string }> = {
  ashley: { name: 'ANALYST ASHLEY', shortName: 'Ashley', role: 'Market scanner. Concise signals.', lastAction: '2m ago — NVDA breakout alert' },
  mike: { name: 'MONITOR MIKE', shortName: 'Mike', role: 'Deep analyst. Fundamentals & sentiment.', lastAction: '15m ago — Portfolio rebalance suggestion' },
  tom: { name: 'TOM TRACKER', shortName: 'Tom', role: 'Technical trader. Charts & patterns.', lastAction: 'Active — monitoring spreads' },
}

export default function AgentsPage() {
  const { agents, toggleAgent } = useAgents()
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })

  const handleToggle = (id: string) => {
    const agent = agents.find(a => a.id === id)
    const shortName = AGENT_DETAILS[id].shortName
    const message = agent?.active ? `${shortName} was removed from chat` : `${shortName} was added to chat`

    toggleAgent(id)
    setToast({ message, visible: true })
    setTimeout(() => setToast({ message, visible: false }), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="AGENTS" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="visible"
          style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', padding: '20px 0 8px', letterSpacing: -0.5 }}>
          Agents
        </motion.h1>

        {agents.map((a, i) => {
          const details = AGENT_DETAILS[a.id]
          return (
            <motion.div key={a.id} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
              style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--rule-subtle)', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 500, color: a.active ? 'var(--cream)' : 'var(--dust)', letterSpacing: 1, marginBottom: 3 }}>{details.name}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--dust)', marginBottom: 6 }}>{details.role}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--cream2)', letterSpacing: 1 }}>{details.lastAction}</div>
              </div>
              {/* iOS-style toggle matching mRyhU toggles */}
              <button onClick={() => handleToggle(a.id)} style={{
                width: 48, height: 28, borderRadius: 14, flexShrink: 0,
                background: a.active ? 'var(--cream)' : 'var(--bg2)',
                border: a.active ? 'none' : '1px solid var(--rule)',
                padding: 3, cursor: 'pointer',
                display: 'flex', justifyContent: a.active ? 'flex-end' : 'flex-start', alignItems: 'center',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: a.active ? 'var(--pure-black)' : 'var(--dust)' }} />
              </button>
            </motion.div>
          )
        })}

        <motion.button custom={4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--dust)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add agent
        </motion.button>
      </div>

      {/* Toast notification */}
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            borderRadius: 8,
            padding: '12px 16px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            color: 'var(--cream2)',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  )
}
