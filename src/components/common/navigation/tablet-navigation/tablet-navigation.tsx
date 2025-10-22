"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "../navigation-config"
import CategoryNav from "../tab-navigation/category-navigation"
import SearchNav from "../tab-navigation/search-navigation"
import styles from "./tablet-navigation.module.css"

export default function TabletNavigation() {
  const pathname = usePathname()
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <ul className={styles.container}>
        <li className={clsx(styles.homeCategory)}>
          <Link href="/" className={clsx(isActive("/") && styles.active)}>
            홈
          </Link>
        </li>
        <li>
          <CategoryNav />
        </li>
        <li
          className={clsx(styles.userCategory, isActive ? styles.active : "")}
        >
          <ul>
            {navItems.slice(3, 6).map(({ href, icon, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  className={clsx(isActive(href) && styles.active)}
                >
                  {icon}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <SearchNav />
    </>
  )
}
