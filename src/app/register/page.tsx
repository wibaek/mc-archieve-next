import { RegisterForm } from "./RegisterForm"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUserAction } from "@/app/actions"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  // 이미 로그인한 사용자는 홈으로 리다이렉트
  const user = await getCurrentUserAction()
  if (user) {
    redirect(searchParams.callbackUrl || "/")
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center max-w-md">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="text-sm text-muted-foreground">아래 정보를 입력하여 계정을 만드세요</p>
        </div>
        <RegisterForm callbackUrl={searchParams.callbackUrl} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href={`/login${searchParams.callbackUrl ? `?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}` : ""}`}
            className="underline underline-offset-4 hover:text-primary"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
