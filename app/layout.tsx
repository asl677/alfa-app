import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import NavWrapper from '@/components/NavWrapper'

export const metadata: Metadata = {
  title: 'Alfa by Boosted.ai',
  description: 'Personal financial AI agent platform',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          <div style={{ display: 'flex', height: '100dvh', width: '100%' }}>
            <NavWrapper />
            <main style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              overflow: 'hidden',
            }}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
