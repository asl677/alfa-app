'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import { fadeUp, containerStagger, itemStagger } from '@/lib/animations'
import { useAgents } from '@/app/context/agents'

export default function AgentsPage() {
  const { agents, toggleAgent, activeAgents } = useAgents()
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })
  const [, forceUpdate] = useState({})

  const handleToggle = (id: string) => {
    const agent = agents.find(a => a.id === id)
    const shortName = agent?.shortName || ''
    const message = agent?.active ? `${shortName} was removed from chat` : `${shortName} was added to chat`

    toggleAgent(id)
    forceUpdate({})
    setToast({ message, visible: true })
    setTimeout(() => setToast({ message, visible: false }), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Agents" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
        <motion.div key={`active-${activeAgents.length}`} variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0 }} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--rule-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--cream2)' }}>Active agents:</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--coral)', fontWeight: 600 }}>{activeAgents.length}</span>
        </motion.div>

        <motion.div variants={containerStagger} initial="hidden" animate="visible">
          {agents.map((a) => (
            <motion.div key={a.id} variants={itemStagger}
              style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--rule-subtle)', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, fontWeight: 300, color: a.active ? 'var(--cream)' : 'var(--dust)', marginBottom: 3 }}>{a.fullName}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--dust)', marginBottom: 6 }}>{a.role}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--cream2)', letterSpacing: 1 }}>{a.lastAction}</div>
              </div>
              <button onClick={() => handleToggle(a.id)} style={{
                width: 48, height: 28, borderRadius: 16, flexShrink: 0,
                background: a.active ? 'var(--cream)' : 'var(--bg2)',
                border: a.active ? 'none' : '1px solid var(--rule)',
                padding: 3, cursor: 'pointer',
                display: 'flex', justifyContent: a.active ? 'flex-end' : 'flex-start', alignItems: 'center',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: a.active ? 'var(--pure-black)' : 'var(--dust)' }} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Toast notification */}
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
