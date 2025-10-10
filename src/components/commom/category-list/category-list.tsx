import CategoryListItem from "./category-list-item"
import styles from "./category-list.module.css"

interface CategoryListProps {
  title: string
  labels: string[]
}

export default function CategoryList({ title, labels }: CategoryListProps) {
  return (
    <fieldset className={styles.wrapper}>
      <legend>{title}</legend>
      {labels.map((label) => (
        <CategoryListItem label={label} key={label} />
      ))}
    </fieldset>
  )
}
