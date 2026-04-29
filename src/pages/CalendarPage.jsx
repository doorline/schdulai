import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CalendarView from '../components/CalendarView'
import FloatingButton from '../components/FloatingButton'
import styles from './CalendarPage.module.css'

export default function CalendarPage({ schedules }) {
  const [viewMode, setViewMode] = useState('month')
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Scheduai</span>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${viewMode === 'month' ? styles.active : ''}`}
            onClick={() => setViewMode('month')}
          >
            월
          </button>
          <button
            className={`${styles.tab} ${viewMode === 'week' ? styles.active : ''}`}
            onClick={() => setViewMode('week')}
          >
            주
          </button>
        </div>
      </header>
      <main className={styles.body}>
        <CalendarView schedules={schedules} viewMode={viewMode} />
      </main>
      <FloatingButton onClick={() => navigate('/chat')} />
    </div>
  )
}
