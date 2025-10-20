import { LucideFootprints } from "lucide-react"
import styles from "./badge.module.css"

export default function Badge() {
  return (
    <span className={styles.tag}>
      <LucideFootprints className={styles.tagIcon} />
      <span className={styles.tagTitle}>자랑스러운 첫 걸음</span>
      <span className={styles.tagDetail}>처음으로 챌린지에 도전했어요!</span>
    </span>
  )
}
