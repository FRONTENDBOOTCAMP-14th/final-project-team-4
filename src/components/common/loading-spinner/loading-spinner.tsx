"use client"

import styles from "./loading-spinner.module.css"

interface LoadingSpinnerProps {
  message?: string
  size?: "small" | "medium" | "large"
  fullScreen?: boolean
}

export default function LoadingSpinner({
  message = "로딩 중...",
  size = "medium",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`${styles.loadingIndicator} ${fullScreen ? styles.fullScreen : ""}`}
    >
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}
