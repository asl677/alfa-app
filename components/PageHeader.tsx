'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenu } from './MenuContext'

// Hamburger = Material Symbols "menu" equivalent
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export default function PageHeader({ title, rightButton }: { title: string; rightButton?: React.ReactNode }) {
  const { openMenu } = useMenu()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 20px',
      background: 'linear-gradient(to bottom, var(--bg) 0%, rgba(15, 13, 10, 0.8) 70%, transparent 100%)',
      flexShrink: 0,
      backdropFilter: 'blur(0px)',
    }}>
      <button
        onClick={openMenu}
        style={{
          position: 'absolute',
          left: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--cream)',
          display: 'flex',
          padding: 0,
        }}
        aria-label="Open menu"
        className="hamburger-btn"
      >
        <IconMenu />
      </button>

      <style>{`
        @media (min-width: 768px) {
          .hamburger-btn {
            display: none !important;
          }
        }
      `}</style>

      <AnimatePresence mode="wait">
        <motion.div
          key={title}
          initial={{ y: 2, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -2, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 24,
            fontWeight: 300,
            letterSpacing: -0.5,
            color: 'var(--cream)',
            textAlign: 'center',
          }}
        >
          {title}
        </motion.div>
      </AnimatePresence>

      {/* Right button or spacer matching design - flexible width for multiple buttons */}
      {rightButton ? (
        <div style={{ position: 'absolute', right: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24, gap: 0 }}>
          {rightButton}
        </div>
      ) : (
        <div style={{ position: 'absolute', right: 20, width: 24, height: 24 }} />
      )}
    </header>
  )
}
