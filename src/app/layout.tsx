import type { Metadata } from "next"
import "@/styles/main.css"
import Footer from "@/components/layout/footer/footer"
import Header from "@/components/layout/header/header"
import { AuthProvider } from "@/contexts/AuthContext"
import { createClient } from "@/utils/supabase/server"
import UserProvider from "./user-providers"

export const metadata: Metadata = {
  title: "Minimo",
  description: "Minimo, create small challenges",
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
    <html lang="ko-KR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const saved = localStorage.getItem('theme');
              if (saved) {
                document.documentElement.style.colorScheme = saved;
              } else {
                const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
              }
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <UserProvider initialUser={userData}>
            <Header />
            <main>{children}</main>
            <Footer />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
