"use server"

import { logout } from "@/lib/auth"

export async function logoutAction() {
  await logout()
  return { success: true }
}
