'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'HOME', icon: '⬡' },
  { href: '/chat', label: 'CHAT', icon: '◌' },
  { href: '/portfolio', label: 'PORTFOLIO', icon: '◫' },
  { href: '/agents', label: 'AGENTS', icon: '◎' },
  { href: '/market', label: 'MARKET', icon: '◈' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 220,
        backgroundColor: 'var(--bg)',
        borderRight: '1px solid var(--rule)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          padding: '28px 24px 32px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--cream)',
            letterSpacing: '0.02em',
          }}
        >
          Alfa
        </span>
        <span
          style={{
            display: 'block',
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--dust)',
            marginTop: 4,
          }}
        >
          by Boosted.ai
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {NAV.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 24px',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: active ? 'var(--coral)' : 'var(--dust)',
                textDecoration: 'none',
                borderLeft: active ? '2px solid var(--coral)' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
                backgroundColor: active ? 'var(--coral-dim)' : 'transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div style={{ borderTop: '1px solid var(--rule)', padding: '16px 24px' }}>
        <Link
          href="/settings"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--dust)',
            textDecoration: 'none',
          }}
        >
          SETTINGS
        </Link>
      </div>
    </aside>
  )
}
