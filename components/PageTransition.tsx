'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', opacity: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
