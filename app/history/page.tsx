'use client'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import { fadeUp } from '@/lib/animations'

const CHAT_HISTORY = [
  {
    id: 1,
    title: 'Tech Sector Rotation',
    preview: 'Ashley: NVDA breakout incoming. Mike: Disagree, support needs test. Tom: Chart shows 200MA...',
    date: 'Today, 2:34 PM',
    agents: ['Analyst Ashley', 'Monitor Mike', 'Tom Tracker'],
    messageCount: 12,
  },
  {
    id: 2,
    title: 'Federal Rate Signals',
    preview: 'Mike: Fed minutes hint at Q2 cut. Ashley: Market priced in 50bps. Tom: Sideways until...',
    date: 'Yesterday, 10:15 AM',
    agents: ['Monitor Mike', 'Analyst Ashley'],
    messageCount: 8,
  },
  {
    id: 3,
    title: 'Oil Supply Shock',
    preview: 'Tom: Geopolitical risk on Middle East. Ashley: Energy rotation accelerating. Mike: Macro...',
    date: '2 days ago, 4:22 PM',
    agents: ['Tom Tracker', 'Analyst Ashley', 'Monitor Mike'],
    messageCount: 15,
  },
  {
    id: 4,
    title: 'Earnings Season Heat Map',
    preview: 'Ashley: Tech earnings beat consensus by 12%. Mike: Forward guidance weak on margins. Tom...',
    date: '3 days ago, 1:58 PM',
    agents: ['Analyst Ashley', 'Monitor Mike'],
    messageCount: 11,
  },
  {
    id: 5,
    title: 'Credit Spread Widening',
    preview: 'Mike: High-yield spreads hit 6-month wide. Tom: Vol structure inverted. Ashley: Sector...',
    date: '4 days ago, 9:33 AM',
    agents: ['Monitor Mike', 'Tom Tracker', 'Analyst Ashley'],
    messageCount: 9,
  },
  {
    id: 6,
    title: 'Crypto Institutional Flows',
    preview: 'Tom: Bitcoin breaking key resistance on whale accumulation. Ashley: On-chain metrics confirm...',
    date: '5 days ago, 11:47 PM',
    agents: ['Tom Tracker', 'Analyst Ashley'],
    messageCount: 7,
  },
]

export default function HistoryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <PageHeader title="History" />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 0, maxWidth: '1020px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {CHAT_HISTORY.map((chat, idx) => (
            <motion.div key={chat.id} custom={idx} variants={fadeUp} initial="hidden" animate="visible" exit="exit"
              style={{ borderBottom: '1px solid var(--rule-subtle)', paddingTop: 20, paddingBottom: 20, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderRadius = '4px'; e.currentTarget.style.paddingLeft = '12px'; e.currentTarget.style.paddingRight = '12px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderRadius = '0'; e.currentTarget.style.paddingLeft = '0'; e.currentTarget.style.paddingRight = '0'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, fontWeight: 300, color: 'var(--cream)', marginBottom: 4 }}>
                    {chat.title}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--cream2)', lineHeight: 1.5 }}>
                    {chat.preview}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--dust)', letterSpacing: 0.5 }}>
                    {chat.date}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {chat.agents.map((agent, i) => (
                  <span key={i} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: 'var(--dust)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 3 }}>
                    {agent.split(' ')[0]}
                  </span>
                ))}
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--cream2)', marginLeft: 'auto' }}>
                  {chat.messageCount} messages
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
