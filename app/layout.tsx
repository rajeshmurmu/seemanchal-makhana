import type React from "react"
import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Suspense } from "react"
import "./globals.css"
import { Header } from "@/components/header/header"
import FestivalBanner from "@/components/header/festival-banner"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Seemanchal Makhana - Authentic Traditional Foods",
  description: "Discover the finest selection of traditional Indian foods, spices, and ingredients",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CartProvider>
              <FestivalBanner />
              <Header />
              <main>
                {children}
              </main>
              <Footer />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
