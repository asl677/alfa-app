'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface LoadingContextType {
  pageLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [pageLoading, setPageLoading] = useState(true)
  const pathname = usePathname()

  // First app load
  useEffect(() => {
    const hasVisited = localStorage.getItem('alfaHasVisited')
    if (!hasVisited) {
      // First visit: show loader for 4.5 seconds
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

  // Show brief loader on page navigation
  useEffect(() => {
    const hasVisited = localStorage.getItem('alfaHasVisited')
    if (hasVisited) {
      // Show loader briefly (500ms) on navigation
      setPageLoading(true)
      const timer = setTimeout(() => {
        setPageLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pathname])

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
