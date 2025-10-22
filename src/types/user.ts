export interface User {
  id: string
  username: string
  profile_image: string | null
  bio: string | null
  is_public: boolean
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at?: string
}

export interface ChallengeWishlist {
  id: string
  user_id: string
  challenge_id: string
}
