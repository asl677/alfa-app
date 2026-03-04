'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import ArtifactCard from '@/components/ArtifactCard'

interface Artifact {
  id: string
  type: 'chart' | 'comparison' | 'heatmap'
  title: string
  data: any
  created_at: string
}

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    // Load artifacts from localStorage
    const saved = localStorage.getItem('artifacts')
    if (saved) {
      setArtifacts(JSON.parse(saved))
    }
  }, [])

  const handleExpand = (artifact: Artifact) => {
    setSelectedArtifact(artifact)
    setIsDetailOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <PageHeader title="Artifacts" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
        {artifacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}
          >
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', textAlign: 'center' }}>
              No artifacts yet
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--cream2)', textAlign: 'center', maxWidth: 300 }}>
              Generate your first chart from chat using artifact prompts like "Compare NVDA vs AMD" or "Chart my portfolio allocation"
            </div>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 20,
          }}>
            <AnimatePresence>
              {artifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  onExpand={handleExpand}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {isDetailOpen && selectedArtifact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                zIndex: 100,
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '90vh',
                background: 'rgba(13,13,13,0.92)',
                backdropFilter: 'blur(32px)',
                borderRadius: '28px 28px 0 0',
                borderTop: '1px solid rgba(255,255,255,0.09)',
                zIndex: 101,
                overflow: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--dust)' }} />
              </div>

              <div style={{ padding: '0 20px 40px' }}>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 28,
                    fontWeight: 300,
                    color: 'var(--cream)',
                    margin: '0 0 12px 0',
                  }}>
                    {selectedArtifact.title}
                  </h2>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    color: 'var(--dust)',
                    margin: 0,
                  }}>
                    {new Date(selectedArtifact.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Chart placeholder */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--rule)',
                  borderRadius: 12,
                  padding: 20,
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dust)',
                }}>
                  Chart render here — {selectedArtifact.type}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
