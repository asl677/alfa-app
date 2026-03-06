'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import ArtifactCard from '@/components/ArtifactCard'
import { fadeUp, containerStagger, itemStagger } from '@/lib/animations'

interface Artifact {
  id: string
  type: 'portfolio' | 'comparison' | 'heatmap' | 'earnings' | 'dividends' | 'stocks'
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
        <AnimatePresence mode="wait">
          {artifacts.length === 0 ? (
            <motion.div
              key="empty"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
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
            <motion.div variants={containerStagger} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {artifacts.map((artifact, idx) => (
                <motion.div
                  key={artifact.id}
                  variants={itemStagger}
                  onClick={() => handleExpand(artifact)}
                  style={{
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'var(--dust)', minWidth: 32 }}>{idx + 1}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 300, color: 'var(--cream)', marginBottom: 2 }}>
                      {artifact.title}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--dust)' }}>
                      {new Date(artifact.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {artifact.type}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'var(--dust)' }}>→</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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

                {/* Chart rendering */}
                {selectedArtifact.type === 'portfolio' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: 16, padding: 20, minHeight: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {selectedArtifact.data.allocation?.map((item: any, idx: number) => (
                        <div key={idx} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: `4px solid ${item.color}` }}>
                          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: 'var(--cream)', marginBottom: 4 }}>{item.name}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600, color: item.color }}>{item.value}%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                        {selectedArtifact.data.allocation?.map((item: any, idx: number) => (
                          <div key={idx} style={{ flex: item.value, background: item.color, height: '100%' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedArtifact.type === 'comparison' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                          <th style={{ padding: 16, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>Metric</th>
                          {selectedArtifact.data.datasets?.map((dataset: any, idx: number) => (
                            <th key={idx} style={{ padding: 16, textAlign: 'right', color: dataset.color, fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, marginBottom: 4 }}>{dataset.label}</div>
                              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: 'var(--cream2)', fontWeight: 400 }}>{dataset.company}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: 12, color: 'var(--cream2)' }}>Current Price</td>
                          {selectedArtifact.data.datasets?.map((dataset: any, idx: number) => (
                            <td key={idx} style={{ padding: 12, textAlign: 'right', color: 'var(--cream)', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                              ${dataset.current}
                            </td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: 12, color: 'var(--cream2)' }}>90-Day Change</td>
                          {selectedArtifact.data.datasets?.map((dataset: any, idx: number) => {
                            const isPositive = parseFloat(dataset.change) >= 0
                            return (
                              <td key={idx} style={{ padding: 12, textAlign: 'right', color: isPositive ? '#4caf50' : '#f44336', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                                {isPositive ? '+' : ''}{dataset.change}
                              </td>
                            )
                          })}
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: 12, color: 'var(--cream2)' }}>90-Day Low</td>
                          {selectedArtifact.data.datasets?.map((dataset: any, idx: number) => (
                            <td key={idx} style={{ padding: 12, textAlign: 'right', color: 'var(--cream2)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                              ${Math.min(...dataset.data).toFixed(2)}
                            </td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: 12, color: 'var(--cream2)' }}>90-Day High</td>
                          {selectedArtifact.data.datasets?.map((dataset: any, idx: number) => (
                            <td key={idx} style={{ padding: 12, textAlign: 'right', color: 'var(--cream2)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                              ${Math.max(...dataset.data).toFixed(2)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td style={{ padding: 12, color: 'var(--cream2)' }}>90-Day Average</td>
                          {selectedArtifact.data.datasets?.map((dataset: any, idx: number) => (
                            <td key={idx} style={{ padding: 12, textAlign: 'right', color: 'var(--cream2)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                              ${(dataset.data.reduce((a: number, b: number) => a + b, 0) / dataset.data.length).toFixed(2)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedArtifact.type === 'heatmap' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedArtifact.data.sectors?.map((sector: any, idx: number) => (
                        <div key={idx}>
                          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: 'var(--cream)', marginBottom: 6 }}>{sector.name}</div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {sector.values?.map((val: number, vidx: number) => {
                              const intensity = val / 100;
                              return (
                                <div key={vidx} style={{ flex: 1, height: 24, background: `rgba(255, 112, 67, ${intensity})`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 9, color: intensity > 0.5 ? 'var(--cream)' : 'var(--dust)' }}>
                                  {val}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedArtifact.type === 'earnings' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Ticker</th>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Company</th>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Date</th>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>EPS Expected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedArtifact.data.rows?.map((row: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: 12, color: 'var(--coral)', fontWeight: 600 }}>{row.ticker}</td>
                            <td style={{ padding: 12, color: 'var(--cream)' }}>{row.company}</td>
                            <td style={{ padding: 12, color: 'var(--cream2)' }}>{row.date}</td>
                            <td style={{ padding: 12, color: 'var(--dust)' }}>{row.eps_expected}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedArtifact.type === 'dividends' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--rule)', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Ticker</th>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Company</th>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Yield</th>
                          <th style={{ padding: 12, textAlign: 'left', color: 'var(--cream2)', fontWeight: 600 }}>Quarterly</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedArtifact.data.rows?.map((row: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: 12, color: 'var(--positive)', fontWeight: 600 }}>{row.ticker}</td>
                            <td style={{ padding: 12, color: 'var(--cream)' }}>{row.company}</td>
                            <td style={{ padding: 12, color: 'var(--positive)', fontWeight: 500 }}>{row.yield}</td>
                            <td style={{ padding: 12, color: 'var(--dust)' }}>{row.quarterly}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
