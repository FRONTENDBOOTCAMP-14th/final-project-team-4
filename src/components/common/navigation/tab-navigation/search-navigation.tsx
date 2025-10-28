"use client"
import { useRef, useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./search-navigation.module.css"

export default function SearchNav() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showError, setShowError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery) {
      setShowError(true)
      return
    }

    setShowError(false)
    router.push(`/challenges/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (showError && e.target.value.trim()) {
      setShowError(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="challenge-search">챌린지 검색</label>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          type="search"
          id="challenge-search"
          name="query"
          placeholder="챌린지를 검색해보세요."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={showError ? styles.errorInput : ""}
        />
        <button type="submit" disabled={!searchQuery.trim()}>
          <Search aria-label="검색하기" />
        </button>
      </div>
      {showError && (
        <div className={styles.errorMessage}>검색어를 입력해주세요.</div>
      )}
    </form>
  )
}
