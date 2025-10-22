"use client"

import { useState } from "react"
import clsx from "clsx"
import type { Challenge } from "@/utils/supabase"
import useInputConfig from "../useInputConfig"
import styles from "./tag-input.module.css"
import type { InputId } from "../const"

export interface TagInputProps {
  id: InputId
  value: Challenge["tags"]
  onChange: (tags: Challenge["tags"]) => void
  error?: string
}

export default function TagInput({
  id,
  value = [],
  onChange,
  error,
}: TagInputProps) {
  const { label, maxLength, placeholder } = useInputConfig(id)
  const [inputValue, setInputValue] = useState("")

  const handleAddTag = (tag: string) => {
    if (value.length >= maxLength) return
    const newTag = tag.startsWith("#") ? tag : `#${tag}`
    if (!tag.includes("##") && !value.includes(newTag)) {
      onChange([...value, newTag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    const trimTag = inputValue.trim()
    if (e.key === "Enter" || (e.key === " " && trimTag)) {
      e.preventDefault()
      handleAddTag(trimTag)
      setInputValue("")
    }
  }

  return (
    <div className={styles[id]}>
      <label htmlFor={id}>
        {label}
        <span
          className={clsx(
            styles.count,
            value.length > 0 ? styles.highlight : ""
          )}
        >
          ({value.length} / {maxLength})
        </span>
      </label>

      <div className={styles.tagWrapper}>
        <div className={styles.tagButtons}>
          {value.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => handleRemoveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={value.length >= maxLength}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
