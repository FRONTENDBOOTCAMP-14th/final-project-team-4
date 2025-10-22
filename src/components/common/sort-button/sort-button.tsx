"use client"

import { useState } from "react"
import styles from "./sort-button.module.css"

export type SortType = "latest" | "popular" | "period-desc" | "period-asc"

interface SortButtonProps {
  defaultSort?: SortType
  onSortChange?: (sortType: SortType) => void
}

export default function SortButton({
  defaultSort = "latest",
  onSortChange,
}: SortButtonProps) {
  const [activeSort, setActiveSort] = useState<SortType>(defaultSort)

  function handleSortClick(sortType: SortType) {
    setActiveSort(sortType)
    onSortChange?.(sortType)
  }

  function handlePeriodClick() {
    const newSort: SortType =
      activeSort === "period-desc" ? "period-asc" : "period-desc"
    setActiveSort(newSort)
    onSortChange?.(newSort)
  }

  const isPeriodActive =
    activeSort === "period-desc" || activeSort === "period-asc"

  return (
    <div className={styles.sortButtonContainer}>
      <button
        type="button"
        className={`${styles.sortButton} ${
          activeSort === "latest" ? styles.active : ""
        }`}
        onClick={() => handleSortClick("latest")}
      >
        최신순
      </button>
      <button
        type="button"
        className={`${styles.sortButton} ${
          activeSort === "popular" ? styles.active : ""
        }`}
        onClick={() => handleSortClick("popular")}
      >
        인기순
      </button>
      <button
        type="button"
        className={`${styles.sortButton} ${styles.periodButton} ${
          isPeriodActive ? styles.active : ""
        }`}
        onClick={handlePeriodClick}
      >
        참여기간순
        <span className={styles.periodIconWrapper}>
          <span
            className={`${styles.arrowIcon} ${
              activeSort === "period-desc" ? styles.activeArrow : ""
            }`}
          >
            ↑
          </span>
          <span
            className={`${styles.arrowIcon} ${
              activeSort === "period-asc" ? styles.activeArrow : ""
            }`}
          >
            ↓
          </span>
        </span>
      </button>
    </div>
  )
}
