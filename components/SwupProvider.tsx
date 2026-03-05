'use client'
import { useEffect } from 'react'
import Swup from 'swup'
import SwupPreloadPlugin from '@swup/preload-plugin'

export default function SwupProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Swup
    const swup = new Swup({
      containers: ['main'],
      plugins: [new SwupPreloadPlugin()],
      animationSelector: '[class*="transition"]',
      skipPopStateHandling: false,
    })

    // Fade transitions
    swup.on('animationOutStart', () => {
      document.documentElement.style.opacity = '1'
    })

    swup.on('animationOutDone', () => {
      document.documentElement.style.opacity = '0'
    })

    swup.on('animationInStart', () => {
      document.documentElement.style.opacity = '0'
    })

    swup.on('animationInDone', () => {
      document.documentElement.style.opacity = '1'
    })

    // CSS for transitions
    const style = document.createElement('style')
    style.textContent = `
      html {
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
      }
    `
    document.head.appendChild(style)

    return () => {
      swup.destroy()
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}
