'use client'
import { ThemeProvider } from './ThemeProvider'
import { MenuProvider } from './MenuContext'
import { AgentProvider } from '@/app/context/agents'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MenuProvider>
        <AgentProvider>
          {children}
        </AgentProvider>
      </MenuProvider>
    </ThemeProvider>
  )
}
