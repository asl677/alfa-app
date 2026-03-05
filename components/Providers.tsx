'use client'
import { ThemeProvider } from './ThemeProvider'
import { MenuProvider } from './MenuContext'
import { AgentProvider } from '@/app/context/agents'
import { LoadingProvider } from '@/app/context/LoadingContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MenuProvider>
        <AgentProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </AgentProvider>
      </MenuProvider>
    </ThemeProvider>
  )
}
