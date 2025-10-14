import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = process.env

const supabase = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default supabase
