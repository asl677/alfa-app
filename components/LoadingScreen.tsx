'use client'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        width: '100%',
        backgroundColor: 'var(--bg)',
      }}
    >
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '52px',
          fontWeight: 300,
          color: 'var(--cream2)',
          textAlign: 'center',
        }}
      >
        Alfa
      </motion.div>
    </div>
  )
}
