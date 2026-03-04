import { type Variants } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30, delay: i * 0.08 },
  }),
}

// Standard stagger pattern: 0.08s delay between items with crisp spring physics (matches bottom sheets)
export const staggerSpring = (i: number) => ({
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  delay: i * 0.08,
})

export const page: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, x: -20 },
}

export const spring = { type: 'spring', damping: 28, stiffness: 300 } as const

export const loadingGradient: Variants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: '100% 50%',
    transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' as const }
  },
}
