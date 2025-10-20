"use client"

import { useState } from "react"
import useInputConfig from "../useInputConfig"
import styles from "./text-input.module.css"
import type { InputId } from "../const"

export interface TextInputProps {
  id: InputId
  as?: "input" | "textarea"
  required?: boolean
}

export default function TextInput({
  id,
  as = "input",
  required = true,
}: TextInputProps) {
  const { label, placeholder, maxLength } = useInputConfig(id)
  const [value, setValue] = useState("")
  const isActive = value.length > 0 && value.length < maxLength

  const props = {
    id,
    name: id,
    placeholder,
    maxLength,
    required,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
  }

  return (
    <div className={styles[id]}>
      <label htmlFor={id}>{label}</label>
      {as === "textarea" ? (
        <textarea {...props} />
      ) : (
        <input type="text" {...props} />
      )}
      <span className={isActive ? styles.highlight : ""}>
        {value.length}/{maxLength}
      </span>
    </div>
  )
}
