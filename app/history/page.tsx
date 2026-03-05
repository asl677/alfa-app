'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import ListItem from '@/components/ListItem'
import { containerStagger } from '@/lib/animations'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  agent?: string
}

export default function HistoryPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedChat = localStorage.getItem('alfaChatHistory')
    if (savedChat) {
      try {
        const parsedMessages = JSON.parse(savedChat)
        setMessages(parsedMessages)
      } catch (err) {
        console.error('Error loading chat history:', err)
      }
    }
    setIsLoading(false)
  }, [])

  // Get unique agents in conversation
  const agents = Array.from(new Set(messages.filter(m => m.agent).map(m => m.agent!)))

  // Get conversation preview (first user + assistant messages)
  const conversationPreview = (() => {
    const userMsg = messages.find(m => m.role === 'user')
    const assistantMsg = messages.find(m => m.role === 'assistant' && m.agent)

    if (!userMsg && !assistantMsg) return 'No conversation yet'

    let preview = ''
    if (userMsg) {
      preview = `You: ${userMsg.text.slice(0, 50)}${userMsg.text.length > 50 ? '...' : ''}`
    }
    if (assistantMsg && assistantMsg.agent) {
      preview += `${preview ? ' · ' : ''}${assistantMsg.agent}: ${assistantMsg.text.slice(0, 40)}${assistantMsg.text.length > 40 ? '...' : ''}`
    }
    return preview
  })()

  const getFormattedDate = () => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        <PageHeader title="History" />
        <div style={{ flex: 1, padding: '20px', textAlign: 'center', color: 'var(--cream2)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      <PageHeader title="History" />
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 0, maxWidth: '1020px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '20px 0', color: 'var(--cream2)', fontFamily: "'Space Grotesk', sans-serif" }}>
              No chat history yet. Start a conversation in Chat to see history here.
            </motion.div>
          ) : (
            <motion.div key="history" variants={containerStagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} style={{ paddingTop: 20, paddingBottom: 20 }} data-animate>
              <ListItem
                title="Current Chat"
                description={conversationPreview}
                metadata={{
                  label: 'Chat',
                  time: getFormattedDate(),
                }}
                footer={
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', width: '100%' }}>
                    {agents.map((agent) => (
                      <span key={agent} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: 'var(--dust)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 3 }}>
                        {agent.split(' ')[0]}
                      </span>
                    ))}
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--cream2)', marginLeft: 'auto' }}>
                      {messages.length} messages
                    </span>
                  </div>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
