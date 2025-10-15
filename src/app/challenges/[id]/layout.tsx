import type { PropsWithChildren } from "react"
import Footer from "@/components/layout/footer/footer"
import Header from "@/components/layout/header/header"

export default function DetailLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
