"use client"

import { useState, useEffect } from "react"
import clsx from "clsx"
import Image from "next/image"
import styles from "./file-input.module.css"
import type { InputId } from "../const"

export interface FileInputProps {
  id: InputId
  value?: File | string
  onChange: (fileOrUrl: File | string) => void
  error?: string
  defaultImages?: string[]
}

export default function FileInput({
  id,
  value,
  onChange,
  error,
  defaultImages = [],
}: FileInputProps) {
  const [preview, setPreview] = useState<string>("")

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(value)
    } else if (typeof value === "string") {
      setPreview(value)
    } else {
      setPreview("")
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    onChange(e.target.files[0])
  }

  const handleDefaultClick = (url: string) => {
    onChange(url)
  }

  return (
    <div className={styles[id]}>
      {preview && (
        <div className={styles.preview}>
          <Image src={preview} alt="미리보기" width={400} height={800} />
        </div>
      )}
      <label htmlFor={id} tabIndex={50}>
        이미지 등록
      </label>

      <input type="file" id={id} name={id} onChange={handleFileChange} />

      {defaultImages.length > 0 && (
        <div className={styles.defaultImages}>
          {defaultImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDefaultClick(img)}
              className={clsx(
                styles.defaultImageBtn,
                value === img ? styles.selected : ""
              )}
            >
              <Image
                src={img}
                alt={`기본 이미지 ${idx + 1}`}
                width={400}
                height={800}
              />
            </button>
          ))}
        </div>
      )}

      <small>썸네일 권장 크기: 400 x 800</small>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
