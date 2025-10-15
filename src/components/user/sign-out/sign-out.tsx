"use client"

import { handleSignOut } from "@/app/login/auth/actions"
import Button from "@/components/common/button/button"

export default function SignOutButton() {
  return (
    <Button onClick={handleSignOut} className="report">
      로그아웃
    </Button>
  )
}
