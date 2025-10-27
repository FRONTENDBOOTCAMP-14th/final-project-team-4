"use client"

import { toast } from "sonner"
import Button from "@/components/common/button/button"

interface ShareButton {
  url?: string
  className?: string
  children?: React.ReactNode
}

export default function ShareButton({
  url,
  className = "share",
  children = "공유하기",
}: ShareButton) {
  const handleClick = async () => {
    const target =
      url ?? (typeof window !== "undefined" ? window.location.href : "")

    if (!target) {
      toast.error("URL을 찾지 못했어요 😢")
      return
    }

    try {
      await navigator.clipboard.writeText(target)
      toast.success("클립보드에 URL이 복사됐어요!")
    } catch {
      toast.error("클립보드 복사에 실패했어요")
    }
  }

  return (
    <Button className={className} type="button" onClick={handleClick}>
      {children}
    </Button>
  )
}
