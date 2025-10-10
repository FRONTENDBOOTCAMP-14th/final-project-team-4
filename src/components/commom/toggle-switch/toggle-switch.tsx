"use client"
import { useState } from "react"
import styles from "./toggle-switch.module.css"

interface BaseToggleProps {
  name: string
  onLabel?: string
  offLabel?: string
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export default function ToggleSwitch({
  name,
  onLabel = "ON",
  offLabel = "OFF",
  defaultChecked = false,
  onChange,
}: BaseToggleProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleToggle = () => {
    const next = !isChecked
    setIsChecked(next)
    onChange?.(next)
  }

  return (
    <label className={styles.toggle}>
      {isChecked ? onLabel : offLabel}
      <input
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={handleToggle}
        aria-checked={isChecked}
      />
    </label>
  )
}
