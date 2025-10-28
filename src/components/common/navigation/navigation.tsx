"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AvatarLink from "@/components/user/avatar-link/avatar-link"
import useUserStore from "store/userStore"
import { navItems, type NavItemProps } from "./navigation-config"
import styles from "./navigation.module.css"

function NavItem({
  href,
  label,
  icon,
  Component,
  hideIsActive,
  pathname,
}: NavItemProps) {
  const currentPath = pathname || "/"
  const isActive =
    href === "/" ? currentPath === "/" : currentPath.startsWith(href)
  const isCurrentPage = Component && currentPath.startsWith(href)
  const hideLink = hideIsActive && isCurrentPage
  const [showDropdown, setShowDropdown] = useState(false)

  const isCategoryNav = href === "/challenges/category"

  const handleClick = (e: React.MouseEvent) => {
    if (isCategoryNav && Component) {
      e.preventDefault()
      setShowDropdown(!showDropdown)
    }
  }

  return (
    <li>
      {!hideLink && (
        <Link
          href={href}
          className={isActive ? styles.active : ""}
          onClick={handleClick}
        >
          {icon}
          {label}
        </Link>
      )}
      {isCategoryNav && showDropdown && Component && <Component />}
      {!isCategoryNav && isCurrentPage && Component && <Component />}
    </li>
  )
}

export default function Navigation() {
  const pathname = usePathname() || "/"
  const { loggedInUser } = useUserStore()

  return (
    <>
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="홈으로 이동"
          width={100}
          height={76}
          priority
        />
      </Link>
      <nav className={styles.container}>
        <span>사이트 네비게이션</span>
        <ul className={styles.wrapper}>
          {navItems.map((item) => {
            if (item.href === "/auth/login") {
              return loggedInUser ? (
                <li key="user-avatar">
                  <AvatarLink userData={loggedInUser} />
                </li>
              ) : (
                <NavItem key={item.href} {...item} pathname={pathname} />
              )
            }

            return <NavItem key={item.href} {...item} pathname={pathname} />
          })}
        </ul>
      </nav>
    </>
  )
}
