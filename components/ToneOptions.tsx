'use client'
import { motion, AnimatePresence } from 'framer-motion'

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '50vh',
              background: 'rgba(13,13,13,0.92)',
              backdropFilter: 'blur(32px)',
              borderRadius: '28px 28px 0 0',
              borderTop: '1px solid rgba(255,255,255,0.09)',
              zIndex: 101,
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--dust)' }} />
            </div>

            <div style={{ padding: '0 20px 40px' }}>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontWeight: 300, color: 'var(--cream)', margin: '0 0 24px 0' }}>
                Tone
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {TONE_OPTIONS.map((tone) => (
                  <motion.button
                    key={tone.id}
                    onClick={() => {
                      onSelectTone(tone.id)
                      onClose()
                    }}
                    style={{
                      padding: '16px',
                      background: selectedTone === tone.id ? 'rgba(255, 112, 67, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: selectedTone === tone.id ? '1px solid var(--coral)' : '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: selectedTone === tone.id ? 'var(--coral)' : 'var(--cream)', marginBottom: 4 }}>
                      {tone.label}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--cream2)' }}>
                      {tone.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
