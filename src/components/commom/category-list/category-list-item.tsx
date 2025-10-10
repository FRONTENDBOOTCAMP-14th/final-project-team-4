import { useId } from "react"
import styles from "./category-list-item.module.css"

export default function CategoryListItem({ label }: { label: string }) {
  const id = useId()

  return (
    <div className={styles.wrapper}>
      <input type="checkbox" id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
