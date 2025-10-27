import type { Database } from "@/utils/supabase/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]

export interface UserPageComponentsProps {
  pageUser?: User
  isMyPage?: boolean
  pageUserOauth?: string
}
