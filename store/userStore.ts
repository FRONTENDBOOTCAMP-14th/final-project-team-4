import { create } from "zustand"
import type { User } from "@/types"
import browserClient from "@/utils/supabase/client"

interface UserStore {
  loggedInUser: User | null
  isLoading: boolean
  fetchLoggedInUser: () => Promise<void>
  storeLogout: () => void
}

const useUserStore = create<UserStore>((set) => ({
  loggedInUser: undefined,
  isLoading: false,

  fetchLoggedInUser: async () => {
    set({ isLoading: true })

    try {
      const supabase = browserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        set({
          loggedInUser: userData,
          isLoading: false,
        })
      } else {
        set({ loggedInUser: null, isLoading: false })
      }
    } catch (error) {
      console.error("유저 정보 가져오기 실패: ", error)
      set({ loggedInUser: null, isLoading: false })
    }
  },

  storeLogout: () => {
    set({ loggedInUser: null })
  },
}))

export default useUserStore
