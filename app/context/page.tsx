'use client'
import { motion } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import { fadeUp } from '@/lib/animations'

export default function ContextPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <PageHeader title="Context" />
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>Context</motion.p>
        <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--cream2)' }}>Your financial context and preferences used by agents.</motion.p>
      </div>
    </div>
  )
}
