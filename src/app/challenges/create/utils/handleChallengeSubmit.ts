import { toast } from "sonner"
import { createChallenge } from "@/utils/supabase/api/challenges"
import type { FormValues } from "../type"

export async function handleChallengeSubmit({
  data,
  upload,
  router,
}: {
  data: FormValues
  upload: (file: File | string) => Promise<string>
  router: { push: (url: string) => void }
}) {
  try {
    if (!data.thumbnail) throw new Error("썸네일 선택 필요")
    const thumbnailUrl = await upload(data.thumbnail)

    await createChallenge({ ...data, thumbnail: thumbnailUrl })

    toast("챌린지 생성 완료.", { duration: 2000 })
    router.push("/")
  } catch (err: unknown) {
    alert(`오류 발생: ${(err as Error).message}`)
  }
}
