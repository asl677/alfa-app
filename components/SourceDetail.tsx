'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

const DETAILED_DESCRIPTIONS: Record<string, string> = {
  'AI Boom Drives Semis': 'NVIDIA dropped below its 200-day moving average, but technical indicators suggest a breakout is imminent. Volume profile shows strong institutional buying at support levels, with key resistance zones acting as potential reversal points. The semiconductor sector is responding to broader AI infrastructure demand and could present a compelling entry opportunity for long-term investors.',
  'Earnings Season Peak': '20% of tech stocks are reporting earnings this week, creating significant market volatility. Consensus estimates appear conservative relative to recent guidance trends. This earnings cycle could serve as a catalyst for sector rotation if results beat expectations. Expect divergence in stock performance based on individual company execution and forward guidance.',
  'Sector Rotation Alert': 'Tech outflows are accelerating to defensive sectors like Utilities. This rotation suggests investors are reassessing risk appetite amid broader macro headwinds. A potential rebalancing opportunity exists for portfolios overweight in growth stocks. Monitor sector momentum indicators for signs of rotation completion or acceleration.',
  'Fed Rate Decision': 'Fed rate cut probability has increased by 25 basis points this month based on recent economic data. Market expectations for monetary policy have shifted materially, potentially affecting duration risk in fixed income portfolios. This development could reshape yield curve dynamics and equity valuation multiples in the near term.',
  'Tech Giants Diverge': 'Mega-cap stocks are showing significant divergence in recent performance, signaling potential sector rotation brewing beneath headline indices. Some mega-caps are consolidating while others are breaking to new highs. This divergence often precedes significant market moves and warrants careful position monitoring.',
  'Oil Rally Continues': 'Energy sector outperformance is accelerating amid supply concerns and geopolitical tensions. Production disruptions remain a wildcard variable that could support crude prices further. Energy allocations in traditional portfolios may deserve fresh examination given valuations relative to historical averages.',
  'China Trade Tensions': 'Tariff escalation is expected to impact supply chains significantly, affecting multiple sectors from semiconductors to consumer goods. Companies with China exposure should face increased scrutiny from investors. This macro uncertainty could create both risks and opportunities depending on sector-specific positioning.',
  'Credit Markets Stress': 'High-yield spreads are widening materially amid broader economic concerns. This widening typically signals rising default risk expectations in corporate credit. Bond investors should reassess credit quality assumptions and consider rebalancing toward higher-rated securities if risk appetite is declining.',
  'Renewable Energy Rally': 'Solar stocks are surging on passage of new climate legislation and expanding tax credits. This regulatory tailwind could support earnings growth for renewable energy companies over the next several years. Long-term structural growth drivers in the renewable sector appear attractive.',
  'Consumer Pullback Signal': 'Retail spending is decelerating faster than expected, suggesting consumer resilience may be diminishing. This slowdown could presage broader economic weakness if the trend persists. Discretionary spending indicators warrant close monitoring for signs of deeper consumer stress.'
}

export default function SourceDetail({
  isOpen,
  onClose,
  source
}: {
  isOpen: boolean
  onClose: () => void
  source: any | null
}) {
  if (!source) return null

  const detailedDesc = DETAILED_DESCRIPTIONS[source.title] || source.desc

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
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120) onClose() }}
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
              style={{ padding: '0 20px 40px', maxHeight: 'min(50vh, 80vh)', overflowY: 'auto' }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: 'var(--cream)',
                  letterSpacing: -0.8,
                  marginBottom: 24,
                }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                {source.title}
              </motion.div>

              <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <img
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${source.domain}`}
                  alt={source.name}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                />
                <div>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--cream)',
                    margin: '0 0 4px 0',
                  }}>
                    {source.name}
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    color: 'var(--dust)',
                    margin: 0,
                  }}>
                    {source.domain}
                  </p>
                </div>
              </motion.div>

              <motion.div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 15,
                  color: 'var(--cream2)',
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                {detailedDesc}
              </motion.div>

              <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  onClick={() => window.open(`https://${source.domain}`, '_blank')}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--coral)',
                    border: 'none',
                    borderRadius: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--pure-black)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Visit Source
                </motion.button>
                <motion.button
                  onClick={() => window.open(`https://${source.domain}/search?q=${source.title.split(' ').join('+')}`, '_blank')}
                  style={{
                    padding: '12px 16px',
                    background: 'transparent',
                    border: '1px solid var(--rule)',
                    borderRadius: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    color: 'var(--cream2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--surface)'
                    e.currentTarget.style.color = 'var(--cream)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--cream2)'
                  }}
                >
                  Read Full Story
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
