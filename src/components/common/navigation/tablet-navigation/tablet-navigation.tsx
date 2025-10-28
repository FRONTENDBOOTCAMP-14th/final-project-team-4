"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AvatarLink from "@/components/user/avatar-link/avatar-link"
import useUserStore from "store/userStore"
import { navItems } from "../navigation-config"
import CategoryNav from "../tab-navigation/category-navigation"
import SearchNav from "../tab-navigation/search-navigation"
import styles from "./tablet-navigation.module.css"

export default function TabletNavigation() {
  const pathname = usePathname()
  const { loggedInUser } = useUserStore()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
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
        <li className={clsx(styles.userCategory)}>
          <ul>
            {navItems.slice(3, 6).map(({ href, icon, label }) => {
              if (href === "/auth/login" && loggedInUser) return null

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={label}
                    className={clsx(isActive(href) && styles.active)}
                  >
                    {icon}
                  </Link>
                </li>
              )
            })}

            {loggedInUser && (
              <li>
                <AvatarLink userData={loggedInUser} />
              </li>
            )}
          </ul>
        </li>
      </ul>
      <SearchNav />
    </>
  )
}
