'use client'
import { useEffect } from 'react'
import { usePageTransition } from './PageTransitionContext'

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const { containerRef, fadeIn } = usePageTransition()

  useEffect(() => {
    fadeIn()
  }, [fadeIn])

  return (
    <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
      {children}
    </div>
  )
}
