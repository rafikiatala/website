import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "RAFIKI - African Leadership Academy Translation Hub",
  description: "Your friend for navigating ALA in multiple languages",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <LanguageProvider>
            <LayoutWrapper>
              <Suspense fallback={null}>{children}</Suspense>
            </LayoutWrapper>
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
