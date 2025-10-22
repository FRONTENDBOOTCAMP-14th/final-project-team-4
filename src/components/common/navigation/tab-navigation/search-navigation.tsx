"use client"
import { useRef } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./search-navigation.module.css"

export default function SearchNav() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const action = async (formData: FormData) => {
    const query = formData.get("query") as string

    router.push(`/challenges/search/${encodeURIComponent(query)}`)
  }
  return (
    <form action={action} className={styles.form}>
      <label htmlFor="challenge-search">챌린지 검색</label>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          type="search"
          id="challenge-search"
          name="query"
          placeholder="챌린지를 검색해보세요."
        />
        <button type="submit">
          <Search />
        </button>
      </div>
    </form>
  )
}
