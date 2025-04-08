import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, ArrowLeft, Users } from "lucide-react"
import { StoryGrid } from "./StoryGrid"
import { getSessionWithStories, checkMembershipRequest, isSessionMember } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { JoinSessionButton } from "./JoinSessionButton"

interface SessionPageProps {
  params: {
    id: string
  }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const session = await getSessionWithStories(params.id)
  const user = await getCurrentUser()

  if (!session) {
    notFound()
  }

  let isOwnerOrMember = false
  let existingRequest = null

  if (user) {
    isOwnerOrMember = await isSessionMember(params.id, user.id)

    if (!isOwnerOrMember) {
      existingRequest = await checkMembershipRequest(params.id, user.id)
    }
  }

  const isOwner = user && session.ownerId === user.id

  return (
    <div className="container py-10">
      <Link href="/" className="flex items-center text-muted-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        모든 세션으로 돌아가기
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{session.name}</h1>
          {session.description && <p className="text-muted-foreground mt-2">{session.description}</p>}
          <p className="text-sm text-muted-foreground mt-2">
            생성일: {formatDate(session.createdAt)} • {session.stories.length} 이미지
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isOwner && (
            <Link href={`/sessions/${session.id}/members`}>
              <Button variant="outline" className="border-mc-gray/50">
                <Users className="mr-2 h-4 w-4" />
                멤버 관리
              </Button>
            </Link>
          )}

          {isOwnerOrMember ? (
            <Link href={`/sessions/${session.id}/upload`}>
              <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                <Upload className="mr-2 h-4 w-4" />
                이미지 업로드
              </Button>
            </Link>
          ) : user ? (
            <JoinSessionButton sessionId={params.id} existingRequest={existingRequest} />
          ) : (
            <Link href={`/login?callbackUrl=%2Fsessions%2F${session.id}%2Fupload`}>
              <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                <Upload className="mr-2 h-4 w-4" />
                이미지 업로드
              </Button>
            </Link>
          )}
        </div>
      </div>

      {session.stories.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-mc-gray/30">
          <h2 className="text-xl font-semibold mb-4">이미지가 없습니다</h2>
          <p className="text-muted-foreground mb-6">이 세션에 마인크래프트 이미지를 업로드하세요</p>
          {isOwnerOrMember ? (
            <Link href={`/sessions/${session.id}/upload`}>
              <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                <Upload className="mr-2 h-4 w-4" />
                이미지 업로드
              </Button>
            </Link>
          ) : user ? (
            <JoinSessionButton sessionId={params.id} existingRequest={existingRequest} />
          ) : (
            <Link href={`/login?callbackUrl=%2Fsessions%2F${session.id}%2Fupload`}>
              <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                <Upload className="mr-2 h-4 w-4" />
                이미지 업로드
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <StoryGrid stories={session.stories} />
      )}
    </div>
  )
}
