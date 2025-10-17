import type { Metadata } from "next"
import "@/styles/main.css"
import UserProvider from "./user-providers"

export const metadata: Metadata = {
  title: "Minimo",
  description: "Minimo, create small challenges",
  manifest: "./manifest.ts",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
