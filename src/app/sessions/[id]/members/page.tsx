import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getSession, getSessionMembershipRequests } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { MemberList } from "./MemberList"
import { RequestList } from "./RequestList"

interface MembersPageProps {
  params: {
    id: string
  }
}

export default async function MembersPage({ params }: MembersPageProps) {
  // 인증이 필요한 페이지
  const user = await requireAuth()

  const session = await getSession(params.id)

  if (!session) {
    notFound()
  }

  // 세션 소유자만 접근 가능
  if (session.ownerId !== user.id) {
    redirect(`/sessions/${params.id}`)
  }

  // 멤버십 요청 가져오기
  const membershipRequests = await getSessionMembershipRequests(params.id)

  return (
    <div className="container py-10">
      <Link href={`/sessions/${params.id}`} className="flex items-center text-muted-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        세션으로 돌아가기
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">멤버 관리</h1>
          <p className="text-muted-foreground mt-2">{session.name}</p>
          <p className="text-sm text-muted-foreground mt-2">생성일: {formatDate(session.createdAt)}</p>
        </div>
      </div>

      {membershipRequests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">참여 요청</h2>
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 text-sm py-1 px-3 rounded-full">
              {membershipRequests.length}개의 요청
            </div>
          </div>
          <RequestList requests={membershipRequests} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">멤버</h2>
        <MemberList session={session} />
      </div>
    </div>
  )
}
