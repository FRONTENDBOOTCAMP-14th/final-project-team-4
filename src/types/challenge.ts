export interface Challenge {
  id: string
  category: CategoryType
  title: string
  thumbnail: string
  description: string
  is_public: boolean
  is_finished: boolean
  tags: Array<string> | null
  created_by_id: string | null
  start_at?: string
  end_at: string
  success_threshold_percent: number | null
  uploading_type: string
  participants_count: number
}

export interface ChallengeParticipant {
  id: string
  user_id: string
  completed_days: number
  required_success_rate: number
  is_successful: boolean | null
  is_progress: boolean
  challenge_id: string
}

export type CategoryType = "건강 / 운동" | "학습" | "습관" | "취미"
