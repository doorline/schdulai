import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import ChatPage from './pages/ChatPage'
import { loadSchedules, saveSchedules } from './utils/storage'
import js from '@eslint/js'

export default function App() {
  const [schedules, setSchedules] = useState(loadSchedules)

  function addSchedules(newSchedules) {
    setSchedules(prev => {
      debugger;
      const updated = [...prev, ...newSchedules]
      saveSchedules(updated)
      return updated
    })
  }

  return (
    <Routes>
      <Route path="/" element={<CalendarPage schedules={schedules} />} />
      <Route path="/chat" element={<ChatPage addSchedules={addSchedules} />} />
    </Routes>
  )
}
