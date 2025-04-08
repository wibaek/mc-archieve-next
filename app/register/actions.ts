"use server"

import type { z } from "zod"
import { register, registerSchema } from "@/lib/auth"

export async function registerAction(data: z.infer<typeof registerSchema>) {
  // 데이터 유효성 검사
  const validatedData = registerSchema.safeParse(data)

  if (!validatedData.success) {
    return { success: false, error: "유효하지 않은 데이터입니다." }
  }

  // 회원가입 시도
  const result = await register(validatedData.data.email, validatedData.data.password, validatedData.data.name)

  return result
}
