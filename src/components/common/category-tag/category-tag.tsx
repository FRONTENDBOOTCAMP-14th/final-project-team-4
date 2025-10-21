import type { CategoryType } from "@/types"
import styles from "./category-tag.module.css"

interface CategoryTagProps {
  category: CategoryType | string
}

export default function CategoryTag({ category }: CategoryTagProps) {
  const categoryClassMap: Record<CategoryType, string> = {
    "건강 / 운동": styles.healthCategory,
    학습: styles.studyCategory,
    습관: styles.habitCategory,
    취미: styles.hobbyCategory,
  }

  const categoryName = categoryClassMap[category]

  return (
    <span className={`${styles.category} ${categoryName}`}>{category}</span>
  )
}
