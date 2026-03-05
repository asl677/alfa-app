'use client'
import { motion } from 'framer-motion'
import BottomSheet from './BottomSheet'

interface ToneOption {
  id: string
  label: string
  description: string
}

const TONE_OPTIONS: ToneOption[] = [
  { id: 'casual', label: 'Casual', description: 'Laid-back, conversational tone' },
  { id: 'guided', label: 'Guided', description: 'Educational, step-by-step approach' },
  { id: 'bullish', label: 'Bullish', description: 'Optimistic, growth-focused' },
  { id: 'hungry', label: 'Hungry', description: 'Aggressive, high-conviction takes' },
  { id: 'passive', label: 'Passive', description: 'Conservative, risk-aware' },
]

export default function ToneOptions({ isOpen, onClose, selectedTone, onSelectTone }: { isOpen: boolean; onClose: () => void; selectedTone: string; onSelectTone: (tone: string) => void }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Tone">
      {TONE_OPTIONS.map((tone) => (
        <motion.div
          key={tone.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '18px 0',
            borderBottom: '1px solid var(--rule-subtle)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: selectedTone === tone.id ? 'var(--cream)' : 'var(--dust)',
              letterSpacing: 1,
            }}>
              {tone.label}
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              color: 'var(--dust)',
              marginTop: 3,
            }}>
              {tone.description}
            </div>
          </div>

          <button
            onClick={() => {
              onSelectTone(tone.id)
              onClose()
            }}
            style={{
              width: 48,
              height: 28,
              borderRadius: 14,
              background: selectedTone === tone.id ? 'var(--cream)' : 'var(--bg2)',
              border: selectedTone === tone.id ? 'none' : '1px solid var(--rule)',
              padding: 3,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: selectedTone === tone.id ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: selectedTone === tone.id ? 'var(--pure-black)' : 'var(--dust)',
            }} />
          </button>
        </motion.div>
      ))}
    </BottomSheet>
  )
}
