'use client'
import { motion } from 'framer-motion'
import { fadeInItem } from '@/lib/animations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeInItem} initial="hidden" animate="visible" exit="exit">
      {children}
    </motion.div>
  )
}
