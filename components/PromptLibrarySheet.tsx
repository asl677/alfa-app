'use client'
import { motion } from 'framer-motion'
import BottomSheet from './BottomSheet'
import { containerStagger, itemStagger } from '@/lib/animations'

interface PromptLibrarySheetProps {
  isOpen: boolean
  onClose: () => void
  prompts: string[]
  onSelectPrompt: (prompt: string) => void
}

export default function PromptLibrarySheet({ isOpen, onClose, prompts, onSelectPrompt }: PromptLibrarySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Prompt Library">
      <motion.div variants={containerStagger} initial="hidden" animate="visible">
        {prompts.map((prompt, idx) => (
          <motion.button
            key={idx}
            variants={itemStagger}
            onClick={() => {
              onSelectPrompt(prompt)
              onClose()
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '16px 0',
              borderBottom: '1px solid var(--rule-subtle)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 300, color: 'var(--cream)', lineHeight: 1.6 }}>
              {prompt}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </BottomSheet>
  )
}
