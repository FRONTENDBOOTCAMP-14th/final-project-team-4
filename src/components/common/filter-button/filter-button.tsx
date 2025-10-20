import styles from "./filter-button.module.css"

interface FilterButtonProps {
  label: string
  isSelected: boolean
  onClick: () => void
  isAllButton?: boolean
}

/** 다중 선택 가능한 필터 버튼 컴포넌트 */
export default function FilterButton({
  label,
  isSelected,
  onClick,
  isAllButton = false,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.filterButton} ${isSelected ? styles.selected : ""} ${
        isAllButton ? styles.allButton : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
