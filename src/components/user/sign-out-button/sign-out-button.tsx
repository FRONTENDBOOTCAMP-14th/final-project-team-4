"use client"

import { handleSignOut } from "@/app/auth/login/actions"
import Button from "@/components/common/button/button"

export default function SignOutButton() {
  return (
    <Button onClick={handleSignOut} className="report" type="button">
      로그아웃
    </Button>
  )
}
