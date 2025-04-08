import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { User } from "./types"

// 이 파일은 실제로는 데이터베이스 연결과 암호화가 필요합니다
// 현재는 예시 구현입니다

// 예시 사용자 데이터
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "테스트 사용자",
    createdAt: new Date("2023-01-01"),
  },
]

// 세션 토큰 저장소 (실제로는 데이터베이스에 저장해야 합니다)
const SESSION_TOKENS: Record<string, { userId: string; expires: Date }> = {}

// 이메일 유효성 검사 스키마
export const emailSchema = z.string().email("유효한 이메일 주소를 입력해주세요.")

// 비밀번호 유효성 검사 스키마
export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
  .regex(/[A-Z]/, "비밀번호는 최소 하나의 대문자를 포함해야 합니다.")
  .regex(/[a-z]/, "비밀번호는 최소 하나의 소문자를 포함해야 합니다.")
  .regex(/[0-9]/, "비밀번호는 최소 하나의 숫자를 포함해야 합니다.")

// 로그인 유효성 검사 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

// 회원가입 유효성 검사 스키마
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

// 로그인 함수
export async function login(email: string, password: string) {
  // 실제로는 데이터베이스에서 사용자를 찾고 비밀번호를 검증해야 합니다
  const user = SAMPLE_USERS.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }
  }

  // 실제로는 비밀번호 해시를 비교해야 합니다
  // 예시 구현에서는 모든 비밀번호가 "Password123"이라고 가정합니다
  if (password !== "Password123") {
    return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }
  }

  // 세션 토큰 생성 (실제로는 보안 토큰을 생성해야 합니다)
  const token = Math.random().toString(36).substring(2, 15)
  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // 7일 후 만료

  // 세션 토큰 저장
  SESSION_TOKENS[token] = { userId: user.id, expires }

  // 쿠키에 세션 토큰 저장
  cookies().set("session_token", token, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return { success: true, user }
}

// 회원가입 함수
export async function register(email: string, password: string, name: string) {
  // 실제로는 데이터베이스에서 이메일 중복 확인을 해야 합니다
  const existingUser = SAMPLE_USERS.find((u) => u.email === email)

  if (existingUser) {
    return { success: false, error: "이미 사용 중인 이메일입니다." }
  }

  // 실제로는 비밀번호를 해시화하고 데이터베이스에 사용자를 저장해야 합니다
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 9),
    email,
    name,
    createdAt: new Date(),
  }

  // 예시 구현에서는 사용자를 배열에 추가합니다
  SAMPLE_USERS.push(newUser)

  // 자동 로그인
  await login(email, password)

  return { success: true, user: newUser }
}

// 로그아웃 함수
export async function logout() {
  // 세션 토큰 쿠키 삭제
  cookies().delete("session_token")
}

// 현재 로그인한 사용자 가져오기
export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get("session_token")?.value

  if (!token || !SESSION_TOKENS[token]) {
    return null
  }

  const session = SESSION_TOKENS[token]

  // 세션이 만료되었는지 확인
  if (new Date() > session.expires) {
    delete SESSION_TOKENS[token]
    cookies().delete("session_token")
    return null
  }

  // 사용자 찾기
  const user = SAMPLE_USERS.find((u) => u.id === session.userId)

  return user || null
}

// 인증이 필요한 페이지에서 사용할 함수
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=" + encodeURIComponent(cookies().get("next-url")?.value || "/"))
  }

  return user
}
