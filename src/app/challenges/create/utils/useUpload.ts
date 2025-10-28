import { useState } from "react"
import { uploadFile } from "@/utils/supabase/api/storage"

export function useUpload() {
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File | string) => {
    if (typeof file === "string") return file
    setUploading(true)
    try {
      return await uploadFile(file)
    } finally {
      setUploading(false)
    }
  }

  return { uploading, upload }
}
