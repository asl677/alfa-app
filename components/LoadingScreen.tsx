'use client'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div
      style={{
        width: '393px',
        height: '852px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '52px',
          fontWeight: 300,
          color: 'var(--cream2)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        Alfa
      </motion.div>
    </div>
  )
}
