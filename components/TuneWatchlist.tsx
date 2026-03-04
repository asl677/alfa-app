'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAgents } from '@/app/context/agents'
import BottomSheet from './BottomSheet'

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

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Tune Watchlist">
      {items.map((item, idx) => (
        <motion.div
          key={item.symbol}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '18px 0',
            borderBottom: '1px solid var(--rule-subtle)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add stock
      </motion.button>
    </BottomSheet>
  )
}
