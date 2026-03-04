'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAgents } from '@/app/context/agents'

const STOCK_POOLS = {
  ashley: [
    { symbol: 'NVDA', name: 'NVIDIA Corp.', tracked: true },
    { symbol: 'AAPL', name: 'Apple Inc.', tracked: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', tracked: false },
    { symbol: 'MSFT', name: 'Microsoft Corp.', tracked: true },
  ],
  mike: [
    { symbol: 'JNJ', name: 'Johnson & Johnson', tracked: true },
    { symbol: 'UNH', name: 'UnitedHealth Group', tracked: true },
    { symbol: 'PG', name: 'Procter & Gamble', tracked: false },
    { symbol: 'KO', name: 'Coca-Cola Co.', tracked: true },
  ],
  tom: [
    { symbol: 'XLE', name: 'Energy ETF', tracked: true },
    { symbol: 'USO', name: 'Oil Fund', tracked: true },
    { symbol: 'CL', name: 'Crude Oil', tracked: false },
    { symbol: 'RIG', name: 'Transocean', tracked: true },
  ],
}

const sheet = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

export default function TuneWatchlist({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeAgents } = useAgents()
  const [items, setItems] = useState<Array<{ symbol: string; name: string; tracked: boolean }>>([])

  // Update items when active agents change
  useEffect(() => {
    if (activeAgents.length === 0) {
      setItems([])
      return
    }

    // Combine stocks from all active agents
    const combined = new Map<string, { symbol: string; name: string; tracked: boolean }>()
    activeAgents.forEach(agent => {
      const pool = STOCK_POOLS[agent.id as keyof typeof STOCK_POOLS] || []
      pool.forEach(stock => {
        if (!combined.has(stock.symbol)) {
          combined.set(stock.symbol, stock)
        }
      })
    })

    setItems(Array.from(combined.values()))
  }, [activeAgents])

  const toggleItem = (symbol: string) => {
    setItems(prev => prev.map(item => item.symbol === symbol ? { ...item, tracked: !item.tracked } : item))
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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--dust)' }} />
        </div>

        <motion.div
          style={{ padding: '0 20px 40px', maxHeight: '80vh', overflowY: 'auto' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="visible"
        >
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
            Tune Watchlist
          </motion.h2>

          {items.map((item) => (
            <motion.div
              key={item.symbol}
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
                  color: item.tracked ? 'var(--cream)' : 'var(--dust)',
                  letterSpacing: 1,
                }}>
                  {item.symbol}
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  color: 'var(--dust)',
                  marginTop: 3,
                }}>
                  {item.name}
                </div>
              </div>

              <button
                onClick={() => toggleItem(item.symbol)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  background: item.tracked ? 'var(--cream)' : 'var(--bg2)',
                  border: item.tracked ? 'none' : '1px solid var(--rule)',
                  padding: 3,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: item.tracked ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: item.tracked ? 'var(--pure-black)' : 'var(--dust)',
                }} />
              </button>
            </motion.div>
          ))}

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
            Add stock
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
