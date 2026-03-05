import { type Variants } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94] as const
const ease = [0.16, 1, 0.3, 1] as const

// Individual item: subtle fade + 5px slide
export const fadeInItem: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: 5,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
}

// Container for staggered children (0.1s delay between each - faster stagger)
export const containerStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
}

export const itemStagger: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
}

// Standard stagger pattern: smooth duration-based with cubic easing
export const staggerSpring = (i: number) => ({
  duration: 0.4,
  delay: i * 0.08,
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
