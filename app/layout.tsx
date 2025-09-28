import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./globals.css"


const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});



export const metadata: Metadata = {
    title: "Seemanchal Makhana - Authentic Traditional Foods",
    description: "Discover the finest selection of traditional Indian foods, spices, and ingredients",
    generator: "Next.js",
}

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        // <QueryClientProvider client={queryClient}>
        <html lang="en">
            <body className={`${roboto.className} font-sans`}>
                {children}
            </body>
        </html>
        // </QueryClientProvider>
    )
}
