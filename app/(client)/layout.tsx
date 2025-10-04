import type React from "react"
import type { Metadata } from "next"

import { Suspense } from "react"
import { Header } from "@/components/header/header"
import FestivalBanner from "@/components/header/festival-banner"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Seemanchal Makhana - Authentic Traditional Foods",
  description: "Discover the finest selection of traditional Indian foods, spices, and ingredients",
  generator: "Next.js",
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={null}>
      <FestivalBanner />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </Suspense>
  )
}
