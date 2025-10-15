"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { categories } from "../navigation-config"
import styles from "./category-navigation.module.css"

export default function CategoryNav() {
  const pathname = usePathname()

  const isActive = (href: string, label: string) => {
    if (pathname === "/challenges/category" && label === "건강 / 운동") {
      return styles.active
    }
    return pathname === href ? styles.active : ""
  }

  return (
    <ul className={styles.wrapper}>
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
