import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import NavWrapper from '@/components/NavWrapper'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title: 'Alfa by Boosted.ai',
  description: 'Personal financial AI agent platform powered by autonomous agents',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: 'Alfa by Boosted.ai',
    description: 'Personal financial AI agent platform powered by autonomous agents',
    url: 'https://alfa-flame.app',
    siteName: 'Alfa',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Alfa - Financial AI Agents',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alfa by Boosted.ai',
    description: 'Personal financial AI agent platform',
    images: ['/og-image.svg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}>
      <body style={{
        margin: 0,
        padding: 0,
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        position: 'fixed',
      }}>
        <style>{`
          html, body {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100vh;
            height: 100dvh;
            width: 100%;
            overflow: hidden;
            -webkit-user-select-touchCallout: none;
            -webkit-user-select: none;
            user-select: none;
          }
        `}</style>
        <Providers>
          <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <NavWrapper />
            <main style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}>
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
