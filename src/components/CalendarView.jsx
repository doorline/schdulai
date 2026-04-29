import { useState } from 'react'
import styles from './CalendarView.module.css'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getMonthGrid(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = firstDow - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), current: false })
  }
  for (let i = 1; i <= lastDate; i++) {
    days.push({ date: new Date(year, month, i), current: true })
  }
  const tail = 7 - (days.length % 7)
  if (tail < 7) {
    for (let i = 1; i <= tail; i++) {
      days.push({ date: new Date(year, month + 1, i), current: false })
    }
  }
  return days
}

function getWeekDays(anchor) {
  const d = new Date(anchor)
  d.setDate(d.getDate() - d.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    return day
  })
}

function formatKoDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return `${m}월 ${d}일 (${DAY_NAMES[dow]})`
}

function MonthView({ schedules, today }) {
  const [base, setBase] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const year = base.getFullYear()
  const month = base.getMonth()
  const grid = getMonthGrid(year, month)

  const eventMap = {}
  schedules.forEach(s => {
    if (!eventMap[s.date]) eventMap[s.date] = []
    eventMap[s.date].push(s)
  })

  return (
    <div className={styles.monthView}>
      <div className={styles.navRow}>
        <button className={styles.navBtn} onClick={() => setBase(new Date(year, month - 1, 1))}>‹</button>
        <span className={styles.navLabel}>{year}년 {month + 1}월</span>
        <button className={styles.navBtn} onClick={() => setBase(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className={styles.dayNames}>
        {DAY_NAMES.map((n, i) => (
          <div key={n} className={`${styles.dayName} ${i === 0 ? styles.sun : i === 6 ? styles.sat : ''}`}>{n}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {grid.map(({ date, current }, idx) => {
          const ds = toDateStr(date)
          const events = eventMap[ds] || []
          const isToday = isSameDay(date, today)
          const dow = date.getDay()
          return (
            <div key={idx} className={`${styles.cell} ${!current ? styles.outMonth : ''}`}>
              <span className={[
                styles.dateNum,
                isToday ? styles.todayNum : '',
                !isToday && dow === 0 ? styles.sunText : '',
                !isToday && dow === 6 ? styles.satText : '',
              ].filter(Boolean).join(' ')}>
                {date.getDate()}
              </span>
              {events.length > 0 && (
                <div className={styles.dots}>
                  {events.slice(0, 3).map((_, i) => <span key={i} className={styles.dot} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ schedules, today }) {
  const [anchor, setAnchor] = useState(today)
  const week = getWeekDays(anchor)
  const weekStart = week[0]
  const weekEnd = week[6]

  const navLabel = `${weekStart.getFullYear()}년 ${weekStart.getMonth() + 1}/${weekStart.getDate()} — ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`

  const weekDateStrs = week.map(toDateStr)
  const weekEvents = schedules
    .filter(s => weekDateStrs.includes(s.date))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))

  return (
    <div className={styles.weekView}>
      <div className={styles.navRow}>
        <button className={styles.navBtn} onClick={() => {
          const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d)
        }}>‹</button>
        <span className={styles.navLabel}>{navLabel}</span>
        <button className={styles.navBtn} onClick={() => {
          const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d)
        }}>›</button>
      </div>

      <div className={styles.weekHeader}>
        {week.map((d, i) => {
          const isToday = isSameDay(d, today)
          const hasSched = schedules.some(s => s.date === toDateStr(d))
          return (
            <div key={i} className={styles.weekCell}>
              <span className={`${styles.weekDayName} ${i === 0 ? styles.sun : i === 6 ? styles.sat : ''}`}>
                {DAY_NAMES[d.getDay()]}
              </span>
              <span className={`${styles.weekDateNum} ${isToday ? styles.todayCircle : ''}`}>
                {d.getDate()}
              </span>
              {hasSched && <span className={styles.weekDot} />}
            </div>
          )
        })}
      </div>

      <div className={styles.weekEvents}>
        {weekEvents.length === 0 ? (
          <p className={styles.empty}>이번 주 일정이 없어요</p>
        ) : (
          weekEvents.map(s => (
            <div key={s.id} className={styles.eventCard}>
              <div className={styles.eventMeta}>
                <span className={styles.eventDate}>{formatKoDate(s.date)}</span>
                {s.time && <span className={styles.eventTime}>{s.time}</span>}
              </div>
              <p className={styles.eventTitle}>{s.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function CalendarView({ schedules, viewMode }) {
  const today = new Date()
  if (viewMode === 'week') return <WeekView schedules={schedules} today={today} />
  return <MonthView schedules={schedules} today={today} />
}
