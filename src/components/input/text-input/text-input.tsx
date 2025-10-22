import type { Challenge } from "@/utils/supabase"
import useInputConfig from "../useInputConfig"
import styles from "./text-input.module.css"
import type { InputId } from "../const"

interface TextInputProps {
  id: InputId
  as?: "input" | "textarea"
  value?: Challenge["title"]
  onChange?: (value: Challenge["title"]) => void
  error?: string
}

export default function TextInput({
  id,
  as = "input",
  value = "",
  onChange,
  error,
}: TextInputProps) {
  const { label, placeholder, maxLength } = useInputConfig(id)
  const isActive = !!value && value.length < maxLength

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(e.target.value)
  }

  const props = {
    id,
    name: id,
    placeholder,
    maxLength,
    value,
    onChange: handleChange,
  }

  return (
    <div className={styles[id]}>
      <label htmlFor={id}>{label}</label>
      {as === "textarea" ? (
        <textarea {...props} />
      ) : (
        <input type="text" {...props} />
      )}
      {maxLength && (
        <span className={isActive ? styles.highlight : ""}>
          {value.length}/{maxLength}
        </span>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
