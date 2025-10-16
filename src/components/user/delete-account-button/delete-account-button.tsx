"use client"

import { handleDeleteAccount } from "@/app/auth/delete/actions"
import Button from "@/components/common/button/button"

export default function DeleteAccountButton() {
  return (
    <Button onClick={handleDeleteAccount} className="report">
      회원 탈퇴
    </Button>
  )
}
