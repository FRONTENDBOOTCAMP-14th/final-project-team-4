"use client"

import { useState } from "react"
import clsx from "clsx"
import useInputConfig from "../useInputConfig"
import styles from "./tag-input.module.css"
import type { InputId } from "../const"

export default function TagInput({ id }: { id: InputId }) {
  const { label, maxLength, placeholder } = useInputConfig(id)
  const [tags, setTags] = useState<string[]>([])
  const [value, setValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (value.length <= 0) return

    const trimTag = value.trim()

    if (e.key === "Enter" || (e.key === " " && trimTag)) {
      e.preventDefault()
      if (tags.length >= maxLength) return

      const newTag = trimTag.startsWith("#") ? trimTag : `#${trimTag}`

      if (!trimTag.includes("##") && !tags.includes(newTag)) {
        setTags((tags) => [...tags, newTag])
      }

      setValue("")
    }
  }

  const handleOnClick = (tag: string) => {
    setTags((tags) => tags.filter((t) => t !== tag))
  }

  return (
    <div className={styles[id]}>
      <label htmlFor={id}>
        {label}
        <span
          className={clsx(
            styles.count,
            tags.length > 0 ? styles.highlight : ""
          )}
        >
          ({tags.length} / {maxLength})
        </span>
      </label>
      <div className={styles.tagWrapper}>
        <div className={styles.tagButtons}>
          {tags.map((tag) => (
            <button type="button" key={tag} onClick={() => handleOnClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={tags.length >= maxLength}
        />
      </div>
      <input type="hidden" name={id} value={tags.join(",")} />
    </div>
  )
}
