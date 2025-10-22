"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

  return (
    <li>
      {!hideLink && (
        <Link href={href} className={isActive ? styles.active : ""}>
          {icon}
          {label}
        </Link>
      )}
      {isCurrentPage && Component && <Component />}
    </li>
  )
}

export default function Navigation() {
  const pathname = usePathname() || "/"

  return (
    <>
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="홈으로 이동"
          width={100}
          height={76}
          priority={true}
        />
      </Link>
      <nav className={styles.container}>
        <span>사이트 네비게이션</span>
        <ul className={styles.wrapper}>
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} pathname={pathname} />
          ))}
        </ul>
      </nav>
    </>
  )
}
