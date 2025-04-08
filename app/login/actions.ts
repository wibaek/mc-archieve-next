"use server"

import type { z } from "zod"
import { login, loginSchema } from "@/lib/auth"

export async function loginAction(data: z.infer<typeof loginSchema>) {
  // 데이터 유효성 검사
  const validatedData = loginSchema.safeParse(data)

  if (!validatedData.success) {
    return { success: false, error: "유효하지 않은 데이터입니다." }
  }

  // 로그인 시도
  const result = await login(validatedData.data.email, validatedData.data.password)

  return result
}
