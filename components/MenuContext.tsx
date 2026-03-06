'use client'
import { createContext, useContext, useState } from 'react'

interface MenuContextType {
  open: boolean
  openMenu: () => void
  closeMenu: () => void
}

const MenuContext = createContext<MenuContextType>({ open: false, openMenu: () => {}, closeMenu: () => {} })

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <MenuContext.Provider value={{ open, openMenu: () => setOpen(true), closeMenu: () => setOpen(false) }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)
