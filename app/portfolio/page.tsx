'use client'
import { motion } from 'framer-motion'
import { fadeUp, containerStagger, itemStagger } from '@/lib/animations'

const HOLDINGS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 12, price: '$416.00', value: '$4,992.03', change: '-5.51%', neg: true },
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 67, price: '$272.95', value: '$18,287.65', change: '-0.47%', neg: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 182, price: '$67.35', value: '$12,257.40', change: '-2.08%', neg: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, price: '$184.89', value: '$924.45', change: '+0.27%', neg: false },
]

export default function PortfolioPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" exit="exit" transition={{ delay: 0 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 8 }}>
            Portfolio
          </div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(36px,8vw,64px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1 }}>
            $34,537.08
          </div>
          <div style={{ marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--accent-red)' }}>
            -$1,247.00 (-3.48%) today
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }} style={{ marginTop: 32 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 16 }}>
            Holdings
          </div>
          <motion.div variants={containerStagger} initial="hidden" animate="visible">
            {HOLDINGS.map((h) => (
              <motion.div key={h.symbol} variants={itemStagger}
                style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, fontWeight: 300, color: 'var(--cream)' }}>{h.symbol}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--cream2)', marginTop: 2 }}>{h.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--dust)', marginTop: 4 }}>{h.shares} shares · {h.price}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--cream)' }}>{h.value}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: h.neg ? 'var(--accent-red)' : 'var(--positive)', marginTop: 4 }}>{h.change}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
  )
}
