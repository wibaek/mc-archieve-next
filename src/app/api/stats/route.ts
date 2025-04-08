import { NextResponse } from "next/server"
import { getSiteStats } from "@/lib/data"

export async function GET() {
  try {
    const stats = await getSiteStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "통계 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}
