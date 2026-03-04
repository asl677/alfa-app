'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

const CHIPS = ['All', 'Trending', 'Insights']

const MARKET = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$416.00', change: '-5.51%', neg: true },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$272.95', change: '-0.47%', neg: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$67.35', change: '-2.08%', neg: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$184.89', change: '+0.27%', neg: false },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$408.58', change: '-1.14%', neg: true },
  { symbol: 'AMZN', name: 'Amazon.com', price: '$187.23', change: '+0.54%', neg: false },
]

export default function MarketPage() {
  const [active, setActive] = useState('All')

  return (
    <div style={{ padding: '20px', maxWidth: 600 }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 8 }}>
          DISCOVER
        </div>
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
          Market
        </h1>
      </motion.div>

      {/* Chips */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {CHIPS.map((chip) => (
          <button key={chip} onClick={() => setActive(chip)} style={{
            padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 400,
            background: active === chip ? 'var(--coral)' : 'var(--surface)',
            color: active === chip ? 'var(--pure-black)' : 'var(--cream2)',
            border: active === chip ? 'none' : '1px solid var(--rule)',
            transition: 'all 0.15s ease',
          }}>
            {chip}
          </button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: 24 }}>
        <input placeholder="Search stocks, ETFs, crypto..." style={{
          width: '100%', padding: '12px 16px', borderRadius: 50,
          background: 'var(--bg-input)', border: '1px solid var(--surface)',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--cream)',
          outline: 'none',
        }} />
      </motion.div>

      {/* Stock list */}
      {MARKET.map((s, i) => (
        <motion.div key={s.symbol} custom={3 + i} variants={fadeUp} initial="hidden" animate="visible"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--rule-subtle)' }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--cream)' }}>{s.symbol}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--cream2)', marginTop: 2 }}>{s.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--cream)' }}>{s.price}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: s.neg ? 'var(--accent-red)' : 'var(--positive)', marginTop: 2 }}>{s.change}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
