'use client'
import { ThemeProvider } from './ThemeProvider'
import { MenuProvider } from './MenuContext'
import { AgentProvider } from '@/app/context/agents'
import AlfaLoader from './AlfaLoader'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MenuProvider>
        <AgentProvider>
          <AlfaLoader />
          {children}
        </AgentProvider>
      </MenuProvider>
    </ThemeProvider>
  )
}
