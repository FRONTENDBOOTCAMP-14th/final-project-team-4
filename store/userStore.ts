import { create } from "zustand"
import type { User } from "@/utils/supabase"
import browserClient from "@/utils/supabase/client"

interface UserStore {
  loggedInUser: User | null | undefined
  isLoading: boolean
  fetchLoggedInUser: () => Promise<void>
  storeLogout: () => void
  updateUserInStore: (updatedData: Partial<User>) => void
}

const useUserStore = create<UserStore>((set) => ({
  loggedInUser: undefined,
  isLoading: true,

  fetchLoggedInUser: async () => {
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

  updateUserInStore: (updatedData: Partial<User>) => {
    set((state) => ({
      loggedInUser: state.loggedInUser
        ? { ...state.loggedInUser, ...updatedData }
        : null,
    }))
  },
}))

export default useUserStore
