'use client'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const letters = 'Alfa'.split('')

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
      <div
        style={{
          display: 'flex',
          fontFamily: "'EB Garamond', serif",
          fontSize: '52px',
          fontWeight: 300,
          color: 'var(--cream2)',
        }}
      >
        {letters.map((letter, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.3,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
