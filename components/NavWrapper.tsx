'use client'
import { useState, useEffect } from 'react'
import DesktopNav from './DesktopNav'
import HamburgerMenu from './HamburgerMenu'

export default function NavWrapper() {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return (
    <>
      {mounted && isDesktop && <DesktopNav />}
      {mounted && !isDesktop && <HamburgerMenu />}
    </>
  )
}
