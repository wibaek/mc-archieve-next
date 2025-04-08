"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { setCurrentPathAction } from "./actions"

export function ClientPathTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      setCurrentPathAction(pathname)
    }
  }, [pathname])

  return null
}
