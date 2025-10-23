import { redirect } from "next/navigation"
import browserClient from "@/utils/supabase/client"

export default async function handleGoogleLogin(): Promise<void> {
  {
    const supabase = browserClient()
    const redirectURL =
      process.env.NODE_ENV === "production"
        ? "https://final-project-team-4-ruby.vercel.app/auth/callback"
        : "http://localhost:3000/auth/callback"

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
      },
    })

    if (error) throw new Error(error.message)
    redirect(data.url)
  }
}
