"use server"

import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { z } from "zod"
import { requireAuth } from "./auth"
import { checkMembershipRequest, isSessionMember } from "./data"

// 이 파일은 실제로는 데이터베이스 연결이 필요합니다
// 현재는 예시 구현입니다

const sessionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  ownerId: z.string(),
})

export async function createSession(data: z.infer<typeof sessionSchema>) {
  // 인증 확인
  await requireAuth()

  // 데이터 유효성 검사
  const validatedData = sessionSchema.parse(data)

  // 실제로는 데이터베이스에 세션을 생성합니다
  // 예시 구현이므로 ID를 반환합니다
  const sessionId = Math.random().toString(36).substring(2, 9)

  revalidatePath("/")
  return sessionId
}

interface UploadImageParams {
  sessionId: string
  name: string
  caption?: string
  file: File
}

export async function uploadImage({ sessionId, name, caption, file }: UploadImageParams) {
  // 인증 확인
  const user = await requireAuth()

  // 파일 유효성 검사
  if (!file || !(file instanceof File)) {
    throw new Error("유효한 파일이 아닙니다")
  }

  try {
    // Vercel Blob에 이미지 업로드
    const blob = await put(`minecraft/${sessionId}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // 실제로는 데이터베이스에 스토리 정보를 저장합니다
    // blob.url은 이미지의 URL입니다
    // 예시 구현이므로 아무 작업도 하지 않습니다

    revalidatePath(`/sessions/${sessionId}`)
    return blob.url
  } catch (error) {
    console.error("이미지 업로드 오류:", error)
    throw new Error("이미지 업로드 중 오류가 발생했습니다")
  }
}

// 멤버십 요청 생성
export async function createMembershipRequest(sessionId: string, message?: string) {
  // 인증 확인
  const user = await requireAuth()

  // 이미 멤버인지 확인
  const isMember = await isSessionMember(sessionId, user.id)
  if (isMember) {
    throw new Error("이미 세션의 멤버입니다")
  }

  // 이미 요청을 보냈는지 확인
  const existingRequest = await checkMembershipRequest(sessionId, user.id)
  if (existingRequest) {
    throw new Error("이미 멤버십 요청을 보냈습니다")
  }

  // 실제로는 데이터베이스에 멤버십 요청을 생성합니다
  // 예시 구현이므로 성공 여부만 반환합니다

  revalidatePath(`/sessions/${sessionId}`)
  revalidatePath("/my-requests")
  return { success: true }
}

// 멤버십 요청 수락
export async function acceptMembershipRequest(requestId: string) {
  // 인증 확인
  const user = await requireAuth()

  // 실제로는 데이터베이스에서 요청을 찾고 세션 소유자인지 확인합니다
  // 예시 구현이므로 성공 여부만 반환합니다

  revalidatePath("/sessions/[id]/members")
  revalidatePath("/sessions/[id]/requests")
  return { success: true }
}

// 멤버십 요청 거절
export async function rejectMembershipRequest(requestId: string) {
  // 인증 확인
  const user = await requireAuth()

  // 실제로는 데이터베이스에서 요청을 찾고 세션 소유자인지 확인합니다
  // 예시 구현이므로 성공 여부만 반환합니다

  revalidatePath("/sessions/[id]/members")
  revalidatePath("/sessions/[id]/requests")
  return { success: true }
}

// 세션 멤버 제거
export async function removeSessionMember(sessionId: string, memberId: string) {
  // 인증 확인
  const user = await requireAuth()

  // 실제로는 데이터베이스에서 세션을 찾고 소유자인지 확인합니다
  // 예시 구현이므로 성공 여부만 반환합니다

  revalidatePath(`/sessions/${sessionId}/members`)
  return { success: true }
}
