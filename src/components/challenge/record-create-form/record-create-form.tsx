/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Button from "@/components/common/button/button"
import browserClient from "@/utils/supabase/client"
import { useRecordCreateStore } from "store/useRecordCreateStore"
import styles from "./record-create-form.module.css"

interface Props {
  challengeId: string
  userId: string
}

const BUCKET_NAME = "challenge-records"
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
])
const MAX_SIZE = 5 * 1024 * 1024

export default function RecordCreateForm({ challengeId, userId }: Props) {
  const router = useRouter()
  const supabase = browserClient()
  const {
    file,
    previewUrl,
    content,
    submitting,
    error,
    done,
    setFile,
    setContent,
    setSubmitting,
    setError,
    setDone,
    reset,
  } = useRecordCreateStore()

  const dirtyRef = useRef(false)
  dirtyRef.current = !!file || (content?.trim()?.length ?? 0) > 0

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!dirtyRef.current) return
      const a = (e.target as HTMLElement).closest("a")
      if (!a) return
      const href = a.getAttribute("href")
      if (!href || href.startsWith("#") || /^https?:\/\//.test(href)) return

      e.preventDefault()
      toast.warning("작성된 내용은 저장되지 않습니다.", {
        description: "계속 이동하시겠어요?",
        icon: null,
        action: {
          label: "나가기",
          onClick: () => {
            dirtyRef.current = false
            reset()
            window.location.href = href
          },
        },
        cancel: (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toast.dismiss()
            }}
            style={{
              background: "none",
              border: "none",
              borderRadius: 5,
              padding: 4,
              color: "var(--text-default-main)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            머무르기
          </button>
        ),
        duration: 5000,
      })
    }

    const handlePopState = (e: PopStateEvent) => {
      if (!dirtyRef.current) return
      e.preventDefault()
      history.pushState(null, "", location.href)
      toast.warning("작성된 내용은 저장되지 않습니다.", {
        description: "이전 페이지로 이동할까요?",
        icon: null,
        action: {
          label: "이동",
          onClick: () => {
            dirtyRef.current = false
            reset()
            history.back()
          },
        },
        cancel: (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toast.dismiss()
            }}
            style={{
              background: "none",
              border: "none",
              borderRadius: 5,
              padding: 4,
              color: "var(--text-default-main)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            머무르기
          </button>
        ),
        duration: 5000,
      })
    }

    document.addEventListener("click", handleClick, true)
    history.pushState(null, "", location.href)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleClick, true)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [file, content, reset])

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    if (!ALLOWED_MIME.has(f.type)) {
      setError("허용되지 않은 이미지 형식입니다. (jpeg/png/webp/avif)")
      return
    }
    if (f.size > MAX_SIZE) {
      setError("파일 용량은 최대 5MB까지만 업로드할 수 있어요.")
      return
    }
    setError(null)
    setFile(f)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("이미지를 업로드해주세요.")
      return
    }

    setSubmitting(true)
    setError(null)
    setDone(false)

    try {
      const safeName = file.name.replace(/[^\w.\-]/g, "_")
      const path = `${challengeId}/${userId}/${Date.now()}_${safeName}`

      const { error: upErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)
      const publicUrl = pub?.publicUrl
      if (!publicUrl) throw new Error("공개 URL 생성에 실패했습니다.")

      const { error: insErr } = await supabase
        .from("challenge_records")
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          content: content || null,
          image_urls: [publicUrl],
        })
      if (insErr) throw insErr

      setDone(true)
      reset()
      toast.success("업로드가 완료되었습니다!")
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "업로드 중 오류가 발생했습니다.")
      toast.error(err?.message ?? "업로드 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section}>
      <h2 id="recordCreate" className={styles.title}>
        인증하기
      </h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.dropzone}>
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="업로드 미리보기"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className={styles.previewImg}
            />
          ) : (
            <span className={styles.pickCta}>이미지 업로드</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onPickFile}
            className={styles.fileInput}
            aria-label="이미지 파일 선택"
            disabled={submitting}
          />
        </label>

        <div className={styles.textareaWrap}>
          <textarea
            className={styles.textarea}
            placeholder="오늘의 챌린지에 대한 설명을 적어주세요!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={1000}
            disabled={submitting}
          />
          <div className={styles.length}>{content.length}/1000</div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {done && <p className={styles.success}>업로드가 완료되었습니다</p>}

        <Button className="primary" type="submit" disabled={submitting}>
          이미지 업로드
        </Button>
      </form>
    </section>
  )
}
