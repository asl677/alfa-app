'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function SourceDetail({
  isOpen,
  onClose,
  source
}: {
  isOpen: boolean
  onClose: () => void
  source: any | null
}) {
  if (!source) return null

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
            animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
            exit={{ y: '100%', transition: { duration: 0.2 } }}
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
              style={{ padding: '0 20px 40px', maxHeight: '80vh', overflowY: 'auto' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
                variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
              >
                <img
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${source.domain}`}
                  alt={source.name}
                  style={{ width: 48, height: 48, borderRadius: 8 }}
                />
                <div>
                  <h2 style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 24,
                    fontWeight: 300,
                    color: 'var(--cream)',
                    margin: '0 0 4px 0',
                    letterSpacing: -0.5,
                  }}>
                    {source.name}
                  </h2>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    color: 'var(--dust)',
                    margin: 0,
                  }}>
                    {source.domain}
                  </p>
                </div>
              </motion.div>

              <motion.div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  color: 'var(--cream2)',
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
                variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
              >
                {source.description}
              </motion.div>

              <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  onClick={() => window.open(`https://${source.domain}`, '_blank')}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--coral)',
                    border: 'none',
                    borderRadius: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--pure-black)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Visit Source
                </motion.button>
                <motion.button
                  onClick={() => window.open(`https://${source.domain}/search?q=${source.title.split(' ').join('+')}`, '_blank')}
                  style={{
                    padding: '12px 16px',
                    background: 'transparent',
                    border: '1px solid var(--rule)',
                    borderRadius: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    color: 'var(--cream2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--surface)'
                    e.currentTarget.style.color = 'var(--cream)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--cream2)'
                  }}
                >
                  Read Full Story
                </motion.button>
                <motion.button
                  onClick={onClose}
                  style={{
                    padding: '12px 16px',
                    background: 'transparent',
                    border: '1px solid var(--dust)',
                    borderRadius: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    color: 'var(--dust)',
                    cursor: 'pointer',
                  }}
                  variants={{ initial: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 8 } }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
