import styles from './ActionButton.module.css'

export default function ActionButton({ onClick }) {
  return (
    <button className={styles.btn} onClick={onClick}>
      캘린더에서 확인하기
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}
