'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

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
]

const sheet = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

export default function AgentsSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [agents, setAgents] = useState(INITIAL_AGENTS)

  const toggle = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
        }}
      />
      <motion.div
        key="sheet"
        variants={sheet}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80) onClose() }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          background: 'rgba(13,13,13,0.92)',
          backdropFilter: 'blur(32px)',
          borderRadius: '28px 28px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--dust)' }} />
        </div>

        <motion.div
          style={{ padding: '0 20px 40px', maxHeight: '80vh', overflowY: 'auto' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h2
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 28,
              fontWeight: 300,
              color: 'var(--cream)',
              letterSpacing: -0.8,
              marginBottom: 8,
            }}
            variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
          >
            Agents
          </motion.h2>

          {/* Agent list */}
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 0',
                borderBottom: '1px solid var(--rule-subtle)',
              }}
              variants={{ initial: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -10 } }}
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
            variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add agent
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
