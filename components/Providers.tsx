'use client'
import { ThemeProvider } from './ThemeProvider'
import { MenuProvider } from './MenuContext'
import { AgentProvider } from '@/app/context/agents'
import LenisScroll from './LenisScroll'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MenuProvider>
        <AgentProvider>
          <LenisScroll />
          {children}
        </AgentProvider>
      </MenuProvider>
    </ThemeProvider>
  )
}
