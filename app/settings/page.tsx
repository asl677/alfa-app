'use client'
import { useTheme } from '@/components/ThemeProvider'
import PageHeader from '@/components/PageHeader'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="SETTINGS" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', padding: '20px 0 8px', letterSpacing: -0.5 }}>
          Settings
        </h1>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 4, paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
          Theme
        </div>

        {(['dark', 'light', 'classic'] as const).map((t) => (
          <button key={t} onClick={() => setTheme(t)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            width: '100%', padding: '16px 0',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: '1px solid var(--rule-subtle)',
          }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: theme === t ? 'var(--coral)' : 'var(--cream)' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
            {theme === t && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        ))}

        <div style={{ marginTop: 32, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '2px', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: 4, paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
          Account
        </div>
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: 'var(--cream)' }}>Plan</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--cream2)' }}>Boosted Pro</span>
        </div>
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: 'var(--cream)' }}>Version</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--cream2)' }}>2.0.0</span>
        </div>
      </div>
    </div>
  )
}
