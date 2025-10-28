import type { Metadata } from "next"
import "@/styles/main.css"
import Footer from "@/components/layout/footer/footer"
import Header from "@/components/layout/header/header"
import { AuthProvider } from "@/contexts/AuthContext"
import { createClient } from "@/utils/supabase/server"
import ToasterProvider from "./toast-provider"
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
              let theme;
              if (saved) {
                theme = saved;
                document.documentElement.style.colorScheme = saved;
                document.documentElement.classList.add(saved);
              } else {
                const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = dark ? 'dark' : 'light';
                document.documentElement.style.colorScheme = theme;
                document.documentElement.classList.add(theme);
              }
              
              // CSS 변수를 직접 설정
              const root = document.documentElement;
              if (theme === 'dark') {
                root.style.setProperty('--surface-bg-main', '#171717');
                root.style.setProperty('--surface-bg-sub', '#3a3a3a');
                root.style.setProperty('--myPage-info-bg', '#232323');
                root.style.setProperty('--shadow-color', 'rgba(255 255 255 / 30%)');
                root.style.setProperty('--divider', '#666666');
                root.style.setProperty('--text-color-main', '#f5f5f5');
                root.style.setProperty('--text-color-sub', '#fafafa');
                root.style.setProperty('--text-color-sub2', '#eaeaea');
                root.style.setProperty('--text-color-reverse', '#201e1f');
              } else {
                root.style.setProperty('--surface-bg-main', '#fafafa');
                root.style.setProperty('--surface-bg-sub', '#f5f5f5');
                root.style.setProperty('--myPage-info-bg', '#fff8ec');
                root.style.setProperty('--shadow-color', 'rgba(0 0 0 / 10%)');
                root.style.setProperty('--divider', '#d3d3d3');
                root.style.setProperty('--text-color-main', '#201e1f');
                root.style.setProperty('--text-color-sub', '#3a3a3a');
                root.style.setProperty('--text-color-sub2', '#afafaf');
                root.style.setProperty('--text-color-reverse', '#f5f5f5');
              }
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <UserProvider initialUser={userData}>
            <Header />
            {children}
            <ToasterProvider />
            <Footer />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
