'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useMenu } from './MenuContext'

// Icons matching exact lucide names from alfa.pen
const IconMessageCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconCompass = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)
const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
)
const IconLayers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)
const IconRotateCcw = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.51"/>
  </svg>
)
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const NAV = [
  { href: '/chat', label: 'Chat', icon: IconMessageCircle },
  { href: '/discover', label: 'Discover', icon: IconCompass },
  { href: '/agents', label: 'Agents', icon: IconBot },
  { href: '/context', label: 'Context', icon: IconLayers },
  { href: '/artifacts', label: 'Artifacts', icon: IconGrid },
  { href: '/history', label: 'History', icon: IconRotateCcw },
  { href: '/settings', label: 'Settings', icon: IconSettings },
]

export default function HamburgerMenu() {
  const { open, closeMenu } = useMenu()
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (href: string) => {
    router.push(href)
    closeMenu()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              zIndex: 90,
            }}
          />

          {/* Floating menu card — matches pen: x:22, y:26, width:349, cornerRadius:20 */}
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } }}
            exit={{ opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.18 } }}
            style={{
              position: 'fixed',
              top: 26,
              left: 22,
              width: 349,
              maxHeight: 800,
              borderRadius: 20,
              background: 'var(--bg2)',
              border: '1px solid rgba(89,45,23,0.8)',
              zIndex: 91,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header: "Alfa" + close */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottom: '1px solid var(--rule-subtle)',
            }}>
              <span style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--cream2)',
              }}>
                Alfa
              </span>
              <button
                onClick={closeMenu}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)', display: 'flex', padding: 0 }}
              >
                <IconX />
              </button>
            </div>

            {/* Nav items */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <button
                    key={href}
                    onClick={() => navigate(href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid var(--rule-subtle)',
                      cursor: 'pointer',
                      color: active ? 'var(--coral)' : 'var(--cream)',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <Icon />
                    <span style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: 16,
                      fontWeight: 300,
                      color: active ? 'var(--coral)' : 'var(--cream)',
                    }}>
                      {label}
                    </span>
                  </button>
                )
              })}
              <div style={{ flex: 1 }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
