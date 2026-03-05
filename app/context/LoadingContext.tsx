'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LoadingContextType {
  pageLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [pageLoading, setPageLoading] = useState(true)

  // Check on first app load only
  useEffect(() => {
    const hasVisited = localStorage.getItem('alfaHasVisited')
    if (!hasVisited) {
      // First visit: show loader for 4.5 seconds (full animation + fade out)
      localStorage.setItem('alfaHasVisited', 'true')
      const timer = setTimeout(() => {
        setPageLoading(false)
      }, 4500)
      return () => clearTimeout(timer)
    } else {
      // Return visitor: dismiss loader immediately
      setPageLoading(false)
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ pageLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
