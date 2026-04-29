import { useEffect, useRef } from 'react'
import styles from './ChatBox.module.css'

export default function ChatBox({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className={styles.box}>
      {messages.map((msg, i) => (
        <div key={i} className={`${styles.bubble} ${styles[msg.role]}`}>
          {msg.content.split('\n').map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
      ))}
      {loading && (
        <div className={`${styles.bubble} ${styles.ai}`}>
          <span className={styles.typing}>
            <span />
            <span />
            <span />
          </span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
