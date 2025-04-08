import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/UserNav"
import type { User } from "@/lib/types"

interface MainNavProps {
  user: User | null
}

export function MainNav({ user }: MainNavProps) {
  return (
    <div className="border-b border-mc-brown bg-mc-brown text-white">
      <div className="flex h-16 items-center px-4 container">
        <Link href="/" className="font-bold text-xl">
          MC Archive
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-mc-green hover:bg-mc-green/90 text-white">회원가입</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
