'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Artifact {
  id: string
  type: 'chart' | 'comparison' | 'heatmap'
  title: string
  data: any
  created_at: string
}

export default function ArtifactCard({ artifact, onExpand }: { artifact: Artifact; onExpand: (a: Artifact) => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onExpand(artifact)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--rule)',
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Coral top border accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'var(--coral)',
      }} />

      {/* Label */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        fontWeight: 600,
        color: 'var(--dust)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 4,
      }}>
        ARTIFACT
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'EB Garamond', serif",
        fontSize: 16,
        fontWeight: 400,
        color: 'var(--cream)',
        marginBottom: 12,
      }}>
        {artifact.title}
      </div>

      {/* Preview area (simplified for now) */}
      <div style={{
        height: 120,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--dust)',
        fontSize: 12,
      }}>
        {artifact.type === 'chart' && '📊 Chart'}
        {artifact.type === 'comparison' && '⚖️ Comparison'}
        {artifact.type === 'heatmap' && '🔥 Heatmap'}
      </div>

      {/* Created date */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: 'var(--dust)',
        marginTop: 12,
      }}>
        {new Date(artifact.created_at).toLocaleDateString()}
      </div>
    </motion.div>
  )
}
