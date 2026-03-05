'use client'
import { createContext, useContext, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'

interface PageTransitionContextType {
  containerRef: React.RefObject<HTMLDivElement>
  fadeOut: () => Promise<void>
  fadeIn: () => void
  isExiting: boolean
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null)

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  const fadeOut = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (!containerRef.current) {
        resolve()
        return
      }

      setIsExiting(true)

      // Kill any existing timeline
      if (tlRef.current) {
        tlRef.current.kill()
      }

      // Create new timeline: fade out staggered items in reverse, then fade out container
      tlRef.current = gsap.timeline({
        onComplete: () => resolve(),
      })

      // Reverse stagger out all motion divs with animation
      const motionDivs = containerRef.current.querySelectorAll('[data-animate]')
      if (motionDivs.length > 0) {
        tlRef.current.to(
          motionDivs,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            stagger: { each: 0.05, from: 'end' }, // Reverse stagger from end
          },
          0
        )
      }

      // Then fade out container
      tlRef.current.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        motionDivs.length > 0 ? 0.15 : 0
      )
    })
  }, [])

  const fadeIn = useCallback(() => {
    if (!containerRef.current) return

    setIsExiting(false)

    if (tlRef.current) {
      tlRef.current.kill()
    }

    tlRef.current = gsap.timeline()
    tlRef.current.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
    )
  }, [])

  return (
    <PageTransitionContext.Provider value={{ containerRef, fadeOut, fadeIn, isExiting }}>
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider')
  }
  return context
}
