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
    url: 'https://alfa-app-flame.vercel.app',
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
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
