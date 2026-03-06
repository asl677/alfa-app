'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AlfaLoader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if this is the first load of the session
    const hasShownLoader = sessionStorage.getItem('alfaLoaderShown')

    if (!hasShownLoader) {
      setShow(true)
      sessionStorage.setItem('alfaLoaderShown', 'true')

      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setShow(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  const letters = 'Alfa'.split('')

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        zIndex: 9999,
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          fontFamily: "'EB Garamond', serif",
          fontSize: '48px',
          fontWeight: 400,
          color: 'var(--cream)',
          letterSpacing: '0px',
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {letters.map((letter, idx) => (
          <motion.span
            key={letter + idx}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: idx * 0.1,
              ease: 'easeInOut',
            }}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}
