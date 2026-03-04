'use client'
import { motion } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import { fadeUp } from '@/lib/animations'

export default function HistoryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <PageHeader title="History" />
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '1020px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--cream2)' }}>Past agent runs and conversations.</motion.p>
      </div>
    </div>
  )
}
