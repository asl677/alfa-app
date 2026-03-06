'use client'
import { useEffect } from 'react'

export default function LenisScroll() {
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('lenis').then(({ default: Lenis }: any) => {
      const lenis = new Lenis() as any

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
      }
    })
  }, [])

  return null
}
