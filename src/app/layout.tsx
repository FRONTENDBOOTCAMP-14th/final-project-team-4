import type { Metadata } from "next"

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
      <body>{children}</body>
    </html>
  )
}
