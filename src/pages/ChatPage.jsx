import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
import MessageInput from '../components/MessageInput'
import ActionButton from '../components/ActionButton'
import { parseScheduleFromMessage } from '../utils/claudeApi'
import styles from './ChatPage.module.css'

const WELCOME = {
  role: 'ai',
  content: '안녕하세요! 일정을 자연어로 말씀해 주세요.\n\n예) "내일 오후 3시에 팀 회의"\n예) "다음 주 월요일 오전 10시 치과 예약"',
}

export default function ChatPage({ addSchedules }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([WELCOME])
  const [loading, setLoading] = useState(false)
  const [showAction, setShowAction] = useState(false)

  async function handleSend(text) {
    if (!text.trim() || loading) return
    
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    setShowAction(false)

    try {
      const result = await parseScheduleFromMessage(text)
      setMessages(prev => [...prev, { role: 'ai', content: result.message }])

      const clear = (result.schedules || []).filter(s => !s.isAmbiguous)
      if (clear.length > 0) {
        addSchedules(clear)
        setShowAction(true)
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: '일정 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.title}>일정 추가</h1>
        <div className={styles.spacer} />
      </header>

      <main className={styles.body}>
        <ChatBox messages={messages} loading={loading} />
      </main>

      {showAction && (
        <div className={styles.actionWrap}>
          <ActionButton onClick={() => navigate('/')} />
        </div>
      )}

      <footer className={styles.footer}>
        <MessageInput onSend={handleSend} disabled={loading} />
      </footer>
    </div>
  )
}
