import PageHeader from '@/components/PageHeader'

export default function ContextPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <PageHeader title="Context" />
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>Context</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--cream2)' }}>Your financial context and preferences used by agents.</p>
      </div>
    </div>
  )
}
