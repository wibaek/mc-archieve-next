"use client"

import { useEffect, useState } from "react"
import type { SiteStats } from "@/lib/types"

export function SiteFooter() {
  const [stats, setStats] = useState<SiteStats>({
    totalMembers: 0,
    totalSessions: 0,
    totalImages: 0,
  })

  useEffect(() => {
    // 실제 구현에서는 API 엔드포인트에서 통계를 가져옵니다
    // 예시 구현에서는 하드코딩된 값을 사용합니다
    setStats({
      totalMembers: 2,
      totalSessions: 2,
      totalImages: 2,
    })
  }, [])

  return (
    <footer className="border-t border-mc-brown mt-auto bg-mc-brown text-white">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-2xl font-bold">MC Archive</div>
          <p className="text-white/80 text-sm text-center">마인크래프트 서버별 이미지를 업로드하고 관리하세요</p>
          <div className="flex flex-wrap justify-center gap-8 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.totalMembers}</div>
              <div className="text-sm text-white/80">멤버</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.totalSessions}</div>
              <div className="text-sm text-white/80">세션</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.totalImages}</div>
              <div className="text-sm text-white/80">이미지</div>
            </div>
          </div>
          <div className="text-sm text-white/60 mt-8">
            &copy; {new Date().getFullYear()} MC Archive. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
