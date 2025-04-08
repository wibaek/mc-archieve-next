"use server"

import { cookies } from "next/headers"
import { login, register, getCurrentUser, requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// 쿠키 관리 함수
export async function setSessionCookie(token: string, expires: Date) {
  cookies().set("session_token", token, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function removeSessionCookie() {
  cookies().delete("session_token")
}

export async function getSessionCookie() {
  return cookies().get("session_token")?.value
}

export async function setNextUrlCookie(url: string) {
  cookies().set("next-url", url)
}

export async function getNextUrlCookie() {
  return cookies().get("next-url")?.value || "/"
}

// 인증 관련 서버 액션
export async function loginAction(data: any) {
  const result = await login(data.email, data.password)

  if (result.success && result.token) {
    await setSessionCookie(result.token, result.expires)
  }

  return result
}

export async function registerAction(data: any) {
  const result = await register(data.email, data.password, data.name)

  if (result.success && result.token) {
    await setSessionCookie(result.token, result.expires)
  }

  return result
}

export async function logoutAction() {
  await removeSessionCookie()
  revalidatePath("/")
  return { success: true }
}

export async function getCurrentUserAction() {
  const token = await getSessionCookie()
  return getCurrentUser(token)
}

export async function requireAuthAction(redirectUrl: string) {
  const token = await getSessionCookie()
  return requireAuth(token, redirectUrl)
}

export async function setCurrentPathAction(path: string) {
  await setNextUrlCookie(path)
}
