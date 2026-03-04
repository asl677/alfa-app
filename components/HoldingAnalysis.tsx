'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const AGENTS = [
  { name: 'Monitor Mike', color: 'var(--coral)' },
  { name: 'Analyst Ashley', color: 'var(--positive)' },
  { name: 'Tom Tracker', color: 'var(--accent-red)' },
]

export default function HoldingAnalysis({
  isOpen,
  onClose,
  holding,
}: {
  isOpen: boolean
  onClose: () => void
  holding: { symbol: string; name: string; price: string; change: string; neg: boolean } | null
}) {
  const [analyses, setAnalyses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && holding) {
      setLoading(true)
      // Simulate agent analysis generation
      const timer = setTimeout(() => {
        setAnalyses({
          'Monitor Mike': `${holding.symbol} is showing strong technical headwinds. The stock has broken below its 200-day moving average, which typically signals increased selling pressure. Current volatility suggests a consolidation phase before the next move. Watch for support at $${parseInt(holding.price.replace(/[$,]/g, '')) * 0.95}.`,
          'Analyst Ashley': `${holding.symbol} presents a compelling entry point for long-term investors. The current pullback has improved the risk-reward ratio significantly. Fundamentally, the company maintains strong competitive advantages. Consider scaling in over the next 2-3 weeks as the technical picture stabilizes.`,
          'Tom Tracker': `Recent volume patterns in ${holding.symbol} indicate institutional accumulation at lower prices. The negative price action masks underlying strength from major stakeholders. Next earnings report could be a catalyst. Technical levels to watch: $${parseInt(holding.price.replace(/[$,]/g, '')) * 0.92} (support) and $${parseInt(holding.price.replace(/[$,]/g, '')) * 1.05} (resistance).`,
        })
        setLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, holding])

  if (!holding) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
            }}
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
            exit={{ y: '100%', transition: { duration: 0.2 } }}
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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--dust)' }} />
            </div>

            <motion.div
              style={{ padding: '0 20px 40px', maxHeight: '80vh', overflowY: 'auto' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                style={{ marginBottom: 24 }}
                variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
              >
                <h2 style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: 'var(--cream)',
                  margin: '0 0 4px 0',
                  letterSpacing: -0.5,
                }}>
                  {holding.symbol}
                </h2>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 12,
                  color: 'var(--dust)',
                  margin: 0,
                }}>
                  {holding.name}
                </p>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--cream)', fontWeight: 600 }}>
                      {holding.price}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: holding.neg ? '#f44336' : '#4caf50', fontWeight: 600 }}>
                      {holding.change}
                    </div>
                  </div>
                </div>
              </motion.div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {AGENTS.map((agent) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: 16,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        border: '1px solid var(--rule)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color }} />
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--cream)' }}>
                          {agent.name}
                        </span>
                      </div>
                      <motion.div
                        animate={{ opacity: [0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          height: 12,
                          background: 'linear-gradient(90deg, var(--rule) 0%, transparent 100%)',
                          borderRadius: 4,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {AGENTS.map((agent) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        padding: 16,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        border: '1px solid var(--rule)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color }} />
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--cream)' }}>
                          {agent.name}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 12,
                        color: 'var(--cream2)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {analyses[agent.name]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
