'use client'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import PageHeader from '@/components/PageHeader'
import { fadeUp } from '@/lib/animations'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Settings" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 4, paddingBottom: 12, borderBottom: '1px solid var(--rule)', marginTop: 20 }}>
          Theme
        </motion.div>

        {(['dark', 'light', 'classic'] as const).map((t, idx) => (
          <motion.button key={t} custom={2 + idx} variants={fadeUp} initial="hidden" animate="visible" onClick={() => setTheme(t)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            width: '100%', padding: '16px 0',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: '1px solid var(--rule-subtle)',
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: theme === t ? 'var(--coral)' : 'var(--cream)' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
            {theme === t && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </motion.button>
        ))}

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" style={{ marginTop: 32, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 4, paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
          Account
        </motion.div>
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: 'var(--cream)' }}>Plan</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--cream2)' }}>Boosted Pro</span>
        </motion.div>
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: 'var(--cream)' }}>Version</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--cream2)' }}>2.0.0</span>
        </motion.div>
      </div>
    </div>
  )
}
