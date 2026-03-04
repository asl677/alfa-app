'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import SourceDetail from '@/components/SourceDetail'
import { fadeUp } from '@/lib/animations'

const CHIPS = ['Trending', 'Insights']

const AGENTS = ['Analyst Ashley', 'Tom Tracker', 'Monitor Mike']
const SOURCES_POOL = [
  'AI Boom Drives Semis', 'Earnings Season Peak', 'Sector Rotation Alert', 'Fed Rate Decision', 'Tech Giants Diverge', 'Oil Rally Continues',
  'Inflation Data Release', 'Earnings Miss Alert', 'Bullish Crossover Signal', 'Support Level Breach', 'Volume Spike Detected', 'Credit Spreads Widen',
  'Consumer Sentiment Falls', 'Housing Starts Surge', 'Bond Yields Rising', 'Dividend Cut Warning', 'Merger Arbitrage Play', 'Short Squeeze Setup',
]

const DESCRIPTIONS_POOL = [
  'Price action suggests institutional accumulation at support levels',
  'Technical indicators showing reversal pattern emerging',
  'Sector rotation accelerating amid macro headwinds',
  'Earnings expectations too low relative to analyst views',
  'Chart pattern completing major breakout setup',
  'Volume profile indicates strong institutional interest',
  'Momentum divergence suggests potential reversal',
  'Supply/demand imbalance creating opportunity',
  'Risk-reward setup attractive for long-term investors',
  'Market breadth improving despite headline weakness',
]

const SOURCES = [
  { agent: 'Analyst Ashley', time: '2m', title: 'AI Boom Drives Semis', desc: 'NVDA dropped below MA200, technical breakout incoming', risk: 'High', action: 'Alert', name: 'Bloomberg', domain: 'bloomberg.com' },
  { agent: 'Tom Tracker', time: '1h', title: 'Earnings Season Peak', desc: '20% of tech stocks reporting earnings this week', risk: 'Medium', action: 'Analyze', name: 'Reuters', domain: 'reuters.com' },
  { agent: 'Monitor Mike', time: '30m', title: 'Sector Rotation Alert', desc: 'Tech outflows to Utilities — rebalance recommended', risk: 'High', action: 'Rebalance', name: 'CNBC', domain: 'cnbc.com' },
  { agent: 'Monitor Mike', time: '4h', title: 'Fed Rate Decision', desc: 'Fed rate cut probability increased 25bp this month', risk: 'Low', action: 'Monitor', name: 'MarketWatch', domain: 'marketwatch.com' },
  { agent: 'Analyst Ashley', time: '15m', title: 'Tech Giants Diverge', desc: 'Mega-cap stocks showing divergence; rotation brewing', risk: 'High', action: 'Watch', name: 'Financial Times', domain: 'ft.com' },
  { agent: 'Tom Tracker', time: '45m', title: 'Oil Rally Continues', desc: 'Energy sector outperformance amid supply concerns', risk: 'Medium', action: 'Monitor', name: 'Seeking Alpha', domain: 'seekingalpha.com' },
]

const RISK_COLOR: Record<string, string> = { High: 'var(--accent-red)', Medium: 'var(--positive)', Low: 'var(--cream2)' }

const SOURCES_METADATA = [
  { name: 'Bloomberg', domain: 'bloomberg.com' },
  { name: 'Reuters', domain: 'reuters.com' },
  { name: 'CNBC', domain: 'cnbc.com' },
  { name: 'MarketWatch', domain: 'marketwatch.com' },
  { name: 'Financial Times', domain: 'ft.com' },
  { name: 'Seeking Alpha', domain: 'seekingalpha.com' },
]

function generateSources() {
  return Array.from({ length: 6 }, (_, i) => {
    const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const timeOptions = ['2m', '5m', '15m', '30m', '45m', '1h', '2h', '4h']
    const riskOptions = ['High', 'Medium', 'Low']
    const actionOptions = ['Alert', 'Analyze', 'Rebalance', 'Watch', 'Monitor']
    const metadata = SOURCES_METADATA[i % SOURCES_METADATA.length]

    return {
      agent: rand(AGENTS),
      time: rand(timeOptions),
      title: rand(SOURCES_POOL),
      desc: rand(DESCRIPTIONS_POOL),
      risk: rand(riskOptions),
      action: rand(actionOptions),
      name: metadata.name,
      domain: metadata.domain,
    }
  })
}

export default function DiscoverPage() {
  const [active, setActive] = useState('Trending')
  const [sources, setSources] = useState(SOURCES)
  const [selectedSource, setSelectedSource] = useState<typeof sources[0] | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setSources(generateSources())
      setIsRefreshing(false)
    }, 1200)
  }

  // Show Insights data only when active
  const displayedSources = active === 'Insights' ? generateSources() : sources

  // Refresh sources every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setSources(generateSources())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Discover" />

      {/* chipRow2 — gap 10, padding [10,20] */}
      <div style={{ display: 'flex', gap: 10, padding: '10px 20px', flexShrink: 0, justifyContent: 'flex-start', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {CHIPS.map((chip) => (
            <button key={chip} onClick={() => {
              setActive(chip)
              setIsRefreshing(true)
              setTimeout(() => setIsRefreshing(false), 1200)
            }} style={{
              padding: '8px 18px', borderRadius: 6, cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
              background: active === chip ? 'var(--coral)' : 'var(--surface)',
              color: active === chip ? 'var(--pure-black)' : 'var(--cream2)',
              border: active === chip ? 'none' : '1px solid var(--rule)',
              transition: 'all 0.15s',
            }}>
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* notificationsContainer — vertical, gap 12, padding [0,12] */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 12px' }}>
        <AnimatePresence>
            {isRefreshing && (
              <motion.div
                key="refresh-spinner"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60, gap: 12, flexShrink: 0 }}
              >
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{ transformOrigin: '50% 50%' }}
                >
                  <circle cx="12" cy="12" r="10" />
                </motion.svg>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--cream2)' }}>Refreshing...</span>
              </motion.div>
            )}
          {displayedSources.map((source, i) => (
            <div
              key={`${active}-${i}-${source.title}`}
              onClick={() => {
                setSelectedSource(source)
                setDetailOpen(true)
              }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--rule)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                cursor: 'pointer',
              }}
            >
            {/* cardHeader */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--cream)' }}>{source.agent}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--dust)' }}>{source.time}</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, color: RISK_COLOR[source.risk] }}>{source.risk}</span>
            </div>
            {/* title */}
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 400, color: 'var(--cream)' }}>{source.title}</div>
            {/* desc */}
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--cream2)' }}>{source.desc}</div>
            {/* footer: source favicon + action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img
                src={`https://www.google.com/s2/favicons?sz=32&domain=${source.domain}`}
                alt={source.name}
                style={{ width: 24, height: 24, borderRadius: 4 }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedSource(source)
                  setDetailOpen(true)
                }}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--coral)', borderRadius: 4, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--coral)', cursor: 'pointer' }}>
                {source.action}
              </button>
            </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      <SourceDetail isOpen={detailOpen} onClose={() => setDetailOpen(false)} source={selectedSource} />
    </div>
  )
}
