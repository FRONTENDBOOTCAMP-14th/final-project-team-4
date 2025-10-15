import { Book, Heart, House, Plus, Search, UserRound } from "lucide-react"
import CategoryNav from "./tab-navigation/category-navigation"
import SearchNav from "./tab-navigation/search-navigation"

export interface NavItemType {
  href: string
  label: string
  icon: React.ReactNode
  Component?: React.ComponentType
  hideIsActive?: boolean
}

export interface NavItemProps extends NavItemType {
  pathname: string
}

export const navItems: NavItemType[] = [
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

export const categories = ["건강 / 운동", "학습", "습관", "취미"]
