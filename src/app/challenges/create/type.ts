import type { Challenge } from "@/utils/supabase"

export type FormValues = Pick<
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
