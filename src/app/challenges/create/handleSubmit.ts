import type { FormEvent } from "react"
import type { Challenge } from "@/utils/supabase"
import { createChallenge } from "@/utils/supabase/api/challenges"

export const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const form = e.currentTarget
  const data = new FormData(form)

  const payload = {
    category: data.get("category") as Challenge["category"],
    title: data.get("title") as Challenge["title"],
    description: data.get("description") as Challenge["description"],
    is_public: Boolean(
      data.get("is_public")
    ) as unknown as Challenge["is_public"],
    tags: data.getAll("tags") as unknown as Challenge["tags"],
    start_at: data.get("start_at") as Challenge["start_at"],
    end_at: data.get("end_at") as Challenge["end_at"],
    success_threshold_percent: Number(data.get("success_threshold_percent")),
    uploading_type: data.get("uploading_type") as Challenge["uploading_type"],
  }

  await createChallenge(payload)
}
