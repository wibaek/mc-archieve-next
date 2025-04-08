import { NewSessionForm } from "./NewSessionForm"
import { requireAuth } from "@/lib/auth"

export default async function NewSessionPage() {
  // 인증이 필요한 페이지
  const user = await requireAuth()

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">새 세션 만들기</h1>
      <NewSessionForm userId={user.id} />
    </div>
  )
}
