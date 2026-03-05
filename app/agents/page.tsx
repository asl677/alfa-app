'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import ListItem from '@/components/ListItem'
import { containerStagger, itemStagger } from '@/lib/animations'
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <PageHeader title="Agents" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
        <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--rule-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--cream2)' }}>Active agents:</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--coral)', fontWeight: 600 }}>{activeAgents.length}</span>
        </div>

        <motion.div variants={containerStagger} initial="hidden" animate="visible">
          {agents.map((a) => (
            <motion.div key={a.id} variants={itemStagger} data-animate>
              <ListItem
                title={a.fullName}
                description={a.role}
                metadata={{
                  label: 'Status',
                  badge: a.lastAction,
                }}
                toggle={{
                  enabled: a.active,
                  onChange: () => handleToggle(a.id),
                }}
              />
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
