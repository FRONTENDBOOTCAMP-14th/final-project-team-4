import styles from "./category-list.module.css"

interface CategoryListProps {
  title: string
  labels: string[]
  inputType: "checkbox" | "radio"
}

export default function CategoryList({
  title,
  labels,
  inputType,
}: CategoryListProps) {
  return (
    <fieldset className={styles.container}>
      <legend>{title}</legend>
      {labels.map((label) => (
        <div className={styles.wrapper} key={label}>
          <input type={inputType} id={label} name="categoryList" />
          <label htmlFor={label}>{label}</label>
        </div>
      ))}
    </fieldset>
  )
}
