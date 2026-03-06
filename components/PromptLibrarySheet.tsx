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
            key={`${prompt}-${idx}`}
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
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.paddingLeft = '12px'
              e.currentTarget.style.marginLeft = '-12px'
              e.currentTarget.style.paddingRight = '12px'
              e.currentTarget.style.marginRight = '-12px'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.paddingLeft = '0'
              e.currentTarget.style.marginLeft = '0'
              e.currentTarget.style.paddingRight = '0'
              e.currentTarget.style.marginRight = '0'
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
