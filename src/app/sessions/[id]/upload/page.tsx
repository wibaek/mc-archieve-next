import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ImageUploadForm } from "./ImageUploadForm"
import { getSession } from "@/lib/data"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

interface UploadPageProps {
  params: {
    id: string
  }
}

export default async function UploadPage({ params }: UploadPageProps) {
  // 인증이 필요한 페이지
  const user = await requireAuth()

  const session = await getSession(params.id)

  if (!session) {
    notFound()
  }

  return (
    <div className="container py-10 max-w-2xl">
      <Link href={`/sessions/${params.id}`} className="flex items-center text-muted-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        세션으로 돌아가기
      </Link>

      <h1 className="text-3xl font-bold mb-2">{session.name}</h1>
      <p className="text-muted-foreground mb-8">이 세션에 마인크래프트 이미지를 업로드하세요</p>

      <ImageUploadForm sessionId={params.id} userId={user.id} />
    </div>
  )
}
