// app/api/auth/signout/route.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/types/supabase"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const bag = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (n: string) => bag.get(n)?.value,
          set: (n: string, v: string, o: any) =>
            bag.set({ name: n, value: v, ...o }),
          remove: (n: string, o: any) => bag.set({ name: n, value: "", ...o }),
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

// 브라우저 직접 접근도 허용
export const GET = POST
