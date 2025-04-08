import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SonnerProvider } from "@/components/sonner-provider"
import { MainNav } from "@/components/MainNav"
import { getCurrentUser } from "@/lib/auth"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MC Archive",
  description: "마인크래프트 서버별 이미지를 업로드하고 관리하세요",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 현재 URL을 쿠키에 저장 (인증 리다이렉트용)
  cookies().set("next-url", "/")

  // 현재 로그인한 사용자 가져오기
  const user = await getCurrentUser()

  return (
    <html lang="ko">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainNav user={user} />
          <main className="flex-1">{children}</main>
          <SonnerProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
