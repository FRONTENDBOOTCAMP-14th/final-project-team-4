/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import Button from "@/components/common/button/button"
import browserClient from "@/utils/supabase/client"
import styles from "./record-create-form.module.css"

interface RecordCreateForm {
  challengeId: string
  userId: string
}

const BUCKET_NAME = "challenge-records"
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
])

const getTodayKR = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
    .toISOString()
    .slice(0, 10)

interface FormValues {
  file: FileList | null
  content: string
}

export default function RecordCreateForm({
  challengeId,
  userId,
}: RecordCreateForm) {
  const router = useRouter()
  const supabase = browserClient()
  const [fileInputKey, setFileInputKey] = useState(0)

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: { file: null, content: "" },
  })

  const fileList = watch("file")
  const fileObj = useMemo(
    () => (fileList && fileList.length > 0 ? fileList[0] : null),
    [fileList]
  )
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    if (!fileObj) {
      setPreviewUrl("")
      return
    }
    const okType = ALLOWED_MIME.has(fileObj.type)
    const okSize = fileObj.size <= MAX_SIZE
    if (!okType || !okSize) return

    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(fileObj)
    return () => reader.abort()
  }, [fileObj])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  const onSubmit = handleSubmit(async ({ file, content }) => {
    try {
      if (!userId) {
        toast.error("로그인이 필요합니다.")
        return
      }
      if (!file || file.length === 0) {
        setError("file", {
          type: "required",
          message: "이미지를 업로드해주세요.",
        })
        return
      }
      const f = file[0]
      if (!ALLOWED_MIME.has(f.type)) {
        setError("file", {
          type: "validate",
          message: "허용되지 않은 이미지 형식입니다. (jpeg/png/webp/avif)",
        })
        return
      }
      if (f.size > MAX_SIZE) {
        setError("file", {
          type: "validate",
          message: "파일 용량은 최대 5MB까지만 업로드할 수 있어요.",
        })
        return
      }
      clearErrors("file")

      const todayKR = getTodayKR()
      const { count: todayCount, error: headErr } = await supabase
        .from("challenge_records")
        .select("id", { head: true, count: "exact" })
        .eq("user_id", userId)
        .eq("challenge_id", challengeId)
        .eq("created_kr_date", todayKR)

      if (headErr) throw headErr
      if ((todayCount ?? 0) > 0) {
        toast("오늘은 이미 인증글을 올렸어요. 내일 다시 시도해 주세요!")
        reset(
          { file: null, content: "" },
          { keepErrors: false, keepDirty: false }
        )
        setPreviewUrl("")
        setFileInputKey((k) => k + 1)
        return
      }

      const safeName = f.name.replace(/[^\w.\-]/g, "_")
      const path = `${challengeId}/${userId}/${Date.now()}_${safeName}`

      const { error: upErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, f, {
          cacheControl: "3600",
          upsert: false,
          contentType: f.type,
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
          content: content?.trim() ? content : null,
          image_urls: [publicUrl],
        })

      if (insErr) {
        if ((insErr as any).code === "23505") {
          toast("오늘은 이미 인증글을 올렸어요. 내일 다시 시도해 주세요!")
          reset(
            { file: null, content: "" },
            { keepErrors: false, keepDirty: false }
          )
          setPreviewUrl("")
          setFileInputKey((k) => k + 1)
          throw insErr
        } else {
          toast.error("업로드 중 오류가 발생했습니다.")
        }
        throw insErr
      }

      toast.success("업로드가 완료되었습니다!")
      reset()
      setPreviewUrl("")
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message ?? "업로드 중 오류가 발생했습니다.")
    }
  })

  return (
    <section className={styles.section}>
      <h2 id="recordCreate" className={styles.title}>
        인증하기
      </h2>

      <form className={styles.form} onSubmit={onSubmit}>
        <Controller
          control={control}
          name="file"
          rules={{
            required: "이미지를 업로드해주세요.",
            validate: (v) => {
              if (!v || v.length === 0) return "이미지를 업로드해주세요."
              const f = v[0]
              if (!ALLOWED_MIME.has(f.type)) {
                return "허용되지 않은 이미지 형식입니다. (jpeg/png/webp/avif)"
              }
              if (f.size > MAX_SIZE) {
                return "파일 용량은 최대 5MB까지만 업로드할 수 있어요."
              }
              return true
            },
          }}
          render={({ field: { onChange, ref } }) => (
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
                key={fileInputKey}
                ref={ref}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  onChange(e.target.files)
                }}
                className={styles.fileInput}
                aria-label="이미지 파일 선택"
                disabled={isSubmitting}
              />
            </label>
          )}
        />
        {errors.file && <p className={styles.error}>{errors.file.message}</p>}

        <div className={styles.textareaWrap}>
          <textarea
            className={styles.textarea}
            placeholder="오늘의 챌린지에 대한 설명을 적어주세요!"
            rows={5}
            maxLength={1000}
            disabled={isSubmitting}
            {...register("content")}
          />
          <div className={styles.length}>
            {(watch("content") || "").length}/1000
          </div>
        </div>
        {errors.content && (
          <p className={styles.error}>{errors.content.message}</p>
        )}

        <Button className="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "업로드 중..." : "이미지 업로드"}
        </Button>
      </form>
    </section>
  )
}
