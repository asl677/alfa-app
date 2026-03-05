'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!containerRef.current) return

    if (isFirstRender.current) {
      // First render - fade in
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      )
      isFirstRender.current = false
      return
    }

    // Subsequent renders - fade in (new page)
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
    )
  }, [children])

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      {children}
    </div>
  )
}
