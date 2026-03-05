import { type Variants } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94] as const
const ease = [0.16, 1, 0.3, 1] as const

// Individual item: fade only (NO y/transforms - causes layout jumps)
export const fadeInItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// Container for staggered children - Alfa standard: 0.05s stagger (50ms)
export const containerStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
}

// Individual item for staggered lists - Alfa standard: fade only, NO transforms
export const itemStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE },
  },
}

// Standard stagger pattern: smooth duration-based with cubic easing
export const staggerSpring = (i: number) => ({
  duration: 0.3,
  delay: i * 0.05,
  ease: EASE,
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
