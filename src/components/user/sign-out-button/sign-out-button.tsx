"use client"

import { handleSignOut } from "@/app/auth/login/actions"
import Button from "@/components/common/button/button"
import useUserStore from "store/userStore"

export default function SignOutButton() {
  const storeLogout = useUserStore((state) => state.storeLogout)

  const signOutActions = async () => {
    await handleSignOut()
    storeLogout()
  }

  return (
    <Button onClick={signOutActions} className="report" type="button">
      로그아웃
    </Button>
  )
}
