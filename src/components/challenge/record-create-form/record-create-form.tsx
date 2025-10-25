/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import Button from "@/components/common/button/button"
import browserClient from "@/utils/supabase/client"
import { useRecordCreateStore } from "store/useRecordCreateStore"
import styles from "./record-create-form.module.css"

interface Props {
  challengeId: string
  userId: string
}

const BUCKET_NAME = "record-images"

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

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있어요.")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("파일 용량은 10MB 이하만 가능합니다.")
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
      const path = `${userId}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, { cacheControl: "3600", upsert: false })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)
      const publicUrl = pub?.publicUrl
      if (!publicUrl) throw new Error("공개 URL 생성 실패")

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
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "업로드 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className={styles.title}>인증하기</h2>
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
