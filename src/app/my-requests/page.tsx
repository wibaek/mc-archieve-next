import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getUserMembershipRequests } from "@/lib/data"
import { requireAuth } from "@/lib/auth"
import { MyRequestList } from "./MyRequestList"

export default async function MyRequestsPage() {
  // 인증이 필요한 페이지
  const user = await requireAuth()

  // 사용자의 멤버십 요청 가져오기
  const membershipRequests = await getUserMembershipRequests(user.id)

  return (
    <div className="container py-10">
      <Link href="/" className="flex items-center text-muted-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        홈으로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">내 참여 요청</h1>
        <p className="text-muted-foreground mt-2">세션 참여 요청 상태를 확인하세요</p>
      </div>

      {membershipRequests.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">요청이 없습니다</h2>
          <p className="text-muted-foreground mb-6">아직 세션 참여 요청을 보내지 않았습니다</p>
          <Link href="/">
            <Button>세션 둘러보기</Button>
          </Link>
        </div>
      ) : (
        <MyRequestList requests={membershipRequests} />
      )}
    </div>
  )
}
