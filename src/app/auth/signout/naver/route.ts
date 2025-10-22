import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/utils/supabase/database.types"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const jar = cookies()

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          async get(name: string) {
            return (await jar).get(name)?.value ?? null
          },
          async set(name: string, value: string, options: CookieOptions) {
            try {
              ;(await jar).set({ name, value, ...options })
            } catch {}
          },
          async remove(name: string, options: CookieOptions) {
            try {
              ;(await jar).set({ name, value: "", ...options })
            } catch {}
          },
        },
      }
    )

    await supabase.auth.signOut()
    return NextResponse.redirect(new URL("/", request.url))
  } catch (e) {
    console.error("로그아웃 에러:", e)
    return NextResponse.json({ error: "로그아웃 실패" }, { status: 500 })
  }
}

export const GET = POST
