'use client'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { usePageTransition } from './PageTransitionContext'

// Icons matching HamburgerMenu
const IconMessageCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconCompass = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)
const IconBot = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
)
const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)
const IconRotateCcw = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.51"/>
  </svg>
)
const IconGrid = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const NAV = [
  { href: '/chat', label: 'Chat', icon: IconMessageCircle, title: 'CHAT' },
  { href: '/discover', label: 'Discover', icon: IconCompass, title: 'DISCOVER' },
  { href: '/agents', label: 'Agents', icon: IconBot, title: 'AGENTS' },
  { href: '/context', label: 'Context', icon: IconLayers, title: 'CONTEXT' },
  { href: '/artifacts', label: 'Artifacts', icon: IconGrid, title: 'ARTIFACTS' },
  { href: '/history', label: 'History', icon: IconRotateCcw, title: 'HISTORY' },
  { href: '/settings', label: 'Settings', icon: IconSettings, title: 'SETTINGS' },
]

export default function DesktopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { fadeOut, fadeIn } = usePageTransition()

  const navigate = async (href: string) => {
    if (pathname === href) return
    await fadeOut()
    router.push(href)
    fadeIn()
  }

  return (
    <motion.div
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '20px 16px',
        height: '100vh',
        width: 80,
        background: 'var(--bg)',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Alfa logo/brand at top */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: 'var(--surface)',
          border: '1px solid var(--rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/chat')}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--coral)' }}>A</span>
      </div>

      {/* Nav items */}
      {NAV.map(({ href, icon: Icon }) => {
        const active = pathname === href
        return (
          <button
            key={href}
            onClick={() => navigate(href)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              color: active ? 'var(--coral)' : 'var(--cream2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            title={href.slice(1).toUpperCase()}
          >
            <Icon />
          </button>
        )
      })}

      {/* Spacer to push bottom nav down */}
      <div style={{ flex: 1 }} />
    </motion.div>
  )
}
