import type { Challenge } from "@/utils/supabase"
import useInputConfig from "../useInputConfig"
import styles from "./date-input.module.css"
import type { InputId } from "../const"

export interface DateInputProps {
  id: InputId
  value: Challenge["start_at"]
  onChange: (value: Challenge["start_at"]) => void
  min?: string
  max?: string
  error?: string
}

export default function DateInput({
  id,
  value,
  onChange,
  min,
  max,
  error,
}: DateInputProps) {
  const { className, label } = useInputConfig(id)

  return (
    <div className={styles[className]}>
      <label htmlFor={id}>{label}</label>
      <input
        type="date"
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
