'use client'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const letters = 'Alfa'.split('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0.2, scale: 0.95 },
    visible: {
      opacity: [0.2, 1, 0.2],
      scale: [0.95, 1.05, 0.95],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        width: '100%',
        backgroundColor: 'var(--bg)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          fontFamily: "'EB Garamond', serif",
          fontSize: '52px',
          fontWeight: 300,
          color: 'var(--cream2)',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, idx) => (
          <motion.span
            key={letter + idx}
            variants={letterVariants}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
