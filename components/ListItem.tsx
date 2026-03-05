'use client'
import { motion } from 'framer-motion'
import { itemStagger } from '@/lib/animations'

interface ListItemProps {
  title: string
  description?: string
  metadata?: {
    label: string
    time?: string
    badge?: string
    badgeColor?: string
  }
  footer?: React.ReactNode
  action?: {
    label: string
    onClick: (e: React.MouseEvent) => void
  }
  toggle?: {
    enabled: boolean
    onChange: (e: React.MouseEvent) => void
  }
  onClick?: () => void
}

export default function ListItem({
  title,
  description,
  metadata,
  footer,
  action,
  toggle,
  onClick,
}: ListItemProps) {
  return (
    <motion.div
      variants={itemStagger}
      onClick={onClick}
      style={{
        paddingTop: 14,
        paddingBottom: 14,
        borderBottom: '1px solid var(--rule-subtle)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {/* metadata header */}
        {metadata && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--cream)' }}>
              {metadata.label}
            </span>
            {metadata.time && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--dust)' }}>
                {metadata.time}
              </span>
            )}
            <div style={{ flex: 1 }} />
            {metadata.badge && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, color: metadata.badgeColor || 'var(--cream2)' }}>
                {metadata.badge}
              </span>
            )}
          </div>
        )}

        {/* title */}
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--cream)' }}>
          {title}
        </div>

        {/* description */}
        {description && (
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--cream2)', lineHeight: 1.5 }}>
            {description}
          </div>
        )}

        {/* footer */}
        {footer && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
            {footer}
          </div>
        )}

        {/* action button */}
        {action && !toggle && (
          <button
            onClick={action.onClick}
            style={{
              padding: 0,
              background: 'none',
              border: 'none',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: 'var(--coral)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* toggle switch */}
      {toggle && (
        <button
          onClick={toggle.onChange}
          style={{
            width: 48,
            height: 28,
            borderRadius: 16,
            flexShrink: 0,
            background: toggle.enabled ? 'var(--cream)' : 'var(--bg2)',
            border: toggle.enabled ? 'none' : '1px solid var(--rule)',
            padding: 3,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: toggle.enabled ? 'flex-end' : 'flex-start',
            alignItems: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: toggle.enabled ? 'var(--pure-black)' : 'var(--dust)',
            }}
          />
        </button>
      )}
    </motion.div>
  )
}
