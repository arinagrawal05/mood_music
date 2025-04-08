import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PlayerProvider } from "@/lib/player-context"
import { GlobalPlayer } from "@/components/global-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mood Music - Find songs that match your vibe",
  description: "Enter a mood or vibe and discover songs that match it",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PlayerProvider>
            {children}
            <GlobalPlayer />
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'