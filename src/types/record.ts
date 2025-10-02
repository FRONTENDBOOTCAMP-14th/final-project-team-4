export interface ChallengeRecord extends DateNow {
  id: string
  challenge_id: string
  user_id: string
  content: string | null
  image_urls: Array<string> | null
  like_count: number
  comment_count: number
}

export interface RecordComment extends DateNow {
  id: string
  record_id: string
  user_id: string
  content: string
}

export interface RecordLike {
  id: string
  record_id: string
  user_id: string
}

interface DateNow {
  created_at?: string
}
