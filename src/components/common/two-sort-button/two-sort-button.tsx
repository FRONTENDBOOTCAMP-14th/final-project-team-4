"use client"

import { useState } from "react"
import styles from "./two-sort-button.module.css"

export type TwoSortType = "latest" | "oldest"

interface TwoSortButtonProps {
  defaultSort?: TwoSortType
  onSortChange?: (sortType: TwoSortType) => void
}

export default function TwoSortButton({
  defaultSort = "latest",
  onSortChange,
}: TwoSortButtonProps) {
  const [activeSort, setActiveSort] = useState<TwoSortType>(defaultSort)

  function handleSortClick(sortType: TwoSortType) {
    setActiveSort(sortType)
    onSortChange?.(sortType)
  }

  return (
    <div className={styles.twoSortButtonContainer}>
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
          activeSort === "oldest" ? styles.active : ""
        }`}
        onClick={() => handleSortClick("oldest")}
      >
        오래된 순
      </button>
    </div>
  )
}
