import { LoginForm } from "./LoginForm"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  // 이미 로그인한 사용자는 홈으로 리다이렉트
  const user = await getCurrentUser()
  if (user) {
    redirect(searchParams.callbackUrl || "/")
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center max-w-md">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="text-sm text-muted-foreground">이메일과 비밀번호를 입력하여 계정에 로그인하세요</p>
        </div>
        <LoginForm callbackUrl={searchParams.callbackUrl} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href={`/register${searchParams.callbackUrl ? `?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}` : ""}`}
            className="underline underline-offset-4 hover:text-primary"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
