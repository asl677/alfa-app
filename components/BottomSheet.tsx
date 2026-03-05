'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
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
            transition={{ type: 'spring', damping: 30, stiffness: 300, exit: { duration: 0.2 } }}
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
              <motion.h2
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: 'var(--cream)',
                  letterSpacing: -0.8,
                  marginBottom: 8,
                }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                {title}
              </motion.h2>
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
