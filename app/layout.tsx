import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import Providers from "@/lib/providers"
import { Toaster } from "react-hot-toast"


const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});



export const metadata: Metadata = {
    title: "Munna Mart - Authentic Traditional Foods",
    description: "Discover the finest selection of traditional Indian foods, spices, and ingredients",
    generator: "Next.js",
}



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Providers>
            <html lang="en">
                <body className={`${roboto.className} font-sans`}>
                    {children}
                    <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} reverseOrder={false} />
                </body>
            </html>
        </Providers>

    )
}
