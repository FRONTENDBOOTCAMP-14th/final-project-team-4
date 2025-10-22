import browserClient from "@/utils/supabase/client"

export async function uploadFile(file: File): Promise<string> {
  if (!file) throw new Error("업로드할 파일이 없습니다.")

  const fileName = `${Date.now()}-${file.name}`
  const client = browserClient()

  const { data: uploadData, error: uploadError } = await client.storage
    .from("challenge-thumbnail")
    .upload(fileName, file, { cacheControl: "3600", upsert: false })

  if (uploadError || !uploadData)
    throw new Error(uploadError?.message || "업로드 실패")

  const { data } = client.storage
    .from("challenge-thumbnail")
    .getPublicUrl(fileName)

  if (!data?.publicUrl) throw new Error("URL 생성 실패")

  return data.publicUrl
}
