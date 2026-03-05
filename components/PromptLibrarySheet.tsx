'use client'
import { motion } from 'framer-motion'
import BottomSheet from './BottomSheet'

interface PromptLibrarySheetProps {
  isOpen: boolean
  onClose: () => void
  prompts: string[]
  onSelectPrompt: (prompt: string) => void
}

export default function PromptLibrarySheet({ isOpen, onClose, prompts, onSelectPrompt }: PromptLibrarySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Prompt Library">
      {prompts.map((prompt, idx) => (
        <motion.button
          key={idx}
          onClick={() => {
            onSelectPrompt(prompt)
            onClose()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
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
    </BottomSheet>
  )
}
