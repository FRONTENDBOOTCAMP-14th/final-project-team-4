"use client"
import { Book, Heart, House, Plus, Search, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./navigation.module.css"
import CategoryNav from "./tab-navigation/category-navigation"
import SearchNav from "./tab-navigation/search-navigation"

interface NavItemType {
  href: string
  label: string
  icon: React.ReactNode
  Component?: React.ComponentType
  hideIsActive?: boolean
}

interface NavItemProps extends NavItemType {
  pathname: string
}

const navItems: NavItemType[] = [
  { href: "/", label: "홈", icon: <House /> },
  {
    href: "/challenges/search",
    label: "검색",
    icon: <Search />,
    Component: SearchNav,
    hideIsActive: true,
  },
  {
    href: "/challenges/category",
    label: "탐색",
    icon: <Book />,
    Component: CategoryNav,
  },
  { href: "/wishlist", label: "찜 목록", icon: <Heart /> },
  { href: "/challenges/create", label: "생성하기", icon: <Plus /> },
  { href: "/login", label: "로그인", icon: <UserRound /> },
]

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
    <nav className={styles.container}>
      <span>사이트 네비게이션</span>
      <ul className={styles.wrapper}>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} pathname={pathname} />
        ))}
      </ul>
    </nav>
  )
}
