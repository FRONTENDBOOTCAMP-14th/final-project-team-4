import type { Metadata } from "next"
import "@/styles/main.css"
import { createClient } from "@/utils/supabase/server"
import UserProvider from "./user-providers"

export const metadata: Metadata = {
  title: "Minimo",
  description: "Minimo, create small challenges",
  manifest: "./manifest.ts",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userData = null

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
    userData = data
  }

  return (
    <html lang="en">
      <body>
        <UserProvider initialUser={userData}>{children}</UserProvider>
      </body>
    </html>
  )
}
