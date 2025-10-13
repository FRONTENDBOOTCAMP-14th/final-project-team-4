import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./category-navigation.module.css"

export default function CategoryNav() {
  const pathname = usePathname()
  const categories = ["건강 / 운동", "학습", "습관", "취미"]

  const isActive = (href: string, label: string) => {
    if (pathname === "/challenges/category" && label === "건강 / 운동") {
      return styles.active
    }
    return pathname === href ? styles.active : ""
  }

  return (
    <ul className={styles.categoryNav}>
      {categories.map((c) => {
        const href = `/challenges/category/${encodeURIComponent(c)}`
        return (
          <li key={c}>
            <Link href={href} className={isActive(href, c)}>
              {c}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
