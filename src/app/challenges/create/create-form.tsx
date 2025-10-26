"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Button from "@/components/common/button/button"
import ToggleSwitch from "@/components/common/toggle-switch/toggle-switch"
import {
  ChoiceInput,
  DateInput,
  FileInput,
  RangeInput,
  TagInput,
  TextInput,
} from "@/components/input"
import type { Challenge } from "@/utils/supabase"
import { createChallenge } from "@/utils/supabase/api/challenges"
import { uploadFile } from "@/utils/supabase/api/storage"
import styles from "./create-form.module.css"

const todayStr = new Date().toLocaleDateString("sv-SE")

const DEFAULT_IMAGES = [
  "/images/thumbnail/default1.png",
  "/images/thumbnail/default2.png",
  "/images/thumbnail/default3.png",
  "/images/thumbnail/default4.png",
  "/images/thumbnail/default5.png",
]

type FormValues = Pick<
  Challenge,
  | "category"
  | "title"
  | "description"
  | "is_public"
  | "tags"
  | "start_at"
  | "end_at"
  | "success_threshold_percent"
  | "uploading_type"
  | "participants_count"
> & { thumbnail: File | string }

export default function CreateForm() {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      thumbnail: "",
      description: "",
      start_at: todayStr,
      end_at: todayStr,
      tags: [],
      is_public: true,
      success_threshold_percent: 90,
      category: "건강 / 운동",
      uploading_type: "사진 인증",
      participants_count: 1,
    },
  })

  const startDate = watch("start_at")
  const endDate = watch("end_at")
  const [uploading, setUploading] = useState(false)

  const maxEndDate = startDate
    ? new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : undefined

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0

  const successDays = (percent: number) =>
    Math.ceil((percent / 100) * totalDays)

  const onSubmit = async (data: FormValues) => {
    let thumbnailUrl = ""

    try {
      if (!data.thumbnail) throw new Error("썸네일 선택 필요")

      setUploading(true)

      thumbnailUrl =
        data.thumbnail instanceof File
          ? await uploadFile(data.thumbnail)
          : data.thumbnail

      const payload = { ...data, thumbnail: thumbnailUrl }
      await createChallenge(payload)

      alert("챌린지 생성 완료.")
    } catch (err: unknown) {
      console.error("onSubmit 에러:", err)
      alert(`오류 발생: ${(err as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  const onError = (errors: unknown) => {
    const firstErrorField = Object.keys(errors)[0]
    const el = document.querySelector<HTMLInputElement>(
      `[name="${firstErrorField}"]`
    )
    if (el) el.focus()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
      <div className={styles.imageArea}>
        <Controller
          name="thumbnail"
          control={control}
          rules={{ required: "썸네일을 등록해주세요." }}
          render={({ field, fieldState }) => (
            <FileInput
              id="thumbnail"
              value={field.value}
              onChange={(fileOrUrl) => setValue("thumbnail", fileOrUrl)}
              error={fieldState.error?.message}
              defaultImages={DEFAULT_IMAGES}
            />
          )}
        />
      </div>

      <div className={styles.scrollArea}>
        <Controller
          name="title"
          control={control}
          rules={{
            required: "타이틀을 입력해주세요.",
            maxLength: { value: 40, message: "40자 이내로 입력해주세요." },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              id="title"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <ChoiceInput
              id="category"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput id="tags" value={field.value} onChange={field.onChange} />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: { value: 300, message: "300글자 이내로 입력해주세요" },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              id="description"
              as="textarea"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="uploading_type"
          control={control}
          render={({ field }) => (
            <ChoiceInput
              id="uploading_type"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className={styles.dates}>
          <span>기간</span>
          <div>
            <Controller
              name="start_at"
              control={control}
              render={({ field }) => (
                <DateInput
                  id="start_at"
                  value={field.value}
                  onChange={field.onChange}
                  min={todayStr}
                />
              )}
            />
            <Controller
              name="end_at"
              control={control}
              rules={{ required: "종료일을 선택해주세요." }}
              render={({ field }) => (
                <DateInput
                  id="end_at"
                  value={field.value}
                  onChange={field.onChange}
                  min={startDate || todayStr}
                  max={maxEndDate}
                />
              )}
            />
          </div>
        </div>

        <Controller
          name="success_threshold_percent"
          control={control}
          render={({ field }) => (
            <RangeInput
              id="success_threshold_percent"
              value={field.value}
              onChange={field.onChange}
              min={80}
              max={100}
              step={10}
              infoMessage={`챌린지 기간 ${totalDays}일 기준, 성공 기준: ${successDays(
                field.value || 80
              )}일`}
            />
          )}
        />

        <Controller
          name="is_public"
          control={control}
          render={({ field }) => (
            <div className={styles.toggle}>
              <span>챌린지 공개 여부</span>
              <ToggleSwitch
                name="is_public"
                onLabel="공개"
                offLabel="비공개"
                onChange={field.onChange}
                checked={field.value}
              />
            </div>
          )}
        />

        <div className={styles.buttons}>
          <Button type="submit" className="primary" disabled={uploading}>
            {uploading ? "업로드 중..." : "생성하기"}
          </Button>
          <Button type="reset" className="edit">
            취소하기
          </Button>
        </div>
      </div>
    </form>
  )
}
