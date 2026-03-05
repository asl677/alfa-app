'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { fadeUp, containerStagger, itemStagger } from '@/lib/animations'

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
    <BottomSheet isOpen={isOpen} onClose={onClose} title={holding.symbol}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--rule-subtle)' }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13,
          color: 'var(--dust)',
          margin: '0 0 12px 0',
        }}>
          {holding.name}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
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
        <motion.div variants={containerStagger} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {AGENTS.map((agent) => (
            <motion.div
              key={agent.name}
              variants={itemStagger}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingTop: 16,
                paddingBottom: 16,
                borderBottom: '1px solid var(--rule-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color }} />
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 400, color: 'var(--cream)' }}>
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
        </motion.div>
      ) : (
        <motion.div variants={containerStagger} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {AGENTS.map((agent) => (
            <motion.div
              key={agent.name}
              variants={itemStagger}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingTop: 16,
                paddingBottom: 16,
                borderBottom: '1px solid var(--rule-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color }} />
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 400, color: 'var(--cream)' }}>
                  {agent.name}
                </span>
              </div>
              <p style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 15,
                fontWeight: 300,
                color: 'var(--cream2)',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {analyses[agent.name]}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </BottomSheet>
  )
}
