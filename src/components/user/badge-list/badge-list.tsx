import Badge from "../badge/badge"
import styles from "./badge-list.module.css"

export default function BadgeList() {
  return (
    <ul className={styles.tagContainer}>
      <li className={styles.tagWrapper}>
        <Badge />
      </li>
    </ul>
  )
}
