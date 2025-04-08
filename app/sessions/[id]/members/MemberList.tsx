"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserMinus } from "lucide-react"
import { removeSessionMember } from "@/lib/actions"
import type { Session, User } from "@/lib/types"

interface MemberListProps {
  session: Session
}

export function MemberList({ session }: MemberListProps) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)

  const handleRemoveMember = async (memberId: string) => {
    try {
      setIsRemoving(true)
      await removeSessionMember(session.id, memberId)
      toast.success("멤버가 제거되었습니다")
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: "멤버를 제거하는 중 문제가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setIsRemoving(false)
      setSelectedMember(null)
    }
  }

  // 세션 소유자와 멤버 목록 준비
  const owner = session.owner || { id: session.ownerId, name: "소유자", email: "", createdAt: new Date() }
  const members = session.members?.filter((member) => member.id !== session.ownerId) || []

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={owner.image} />
                <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{owner.name}</p>
                <p className="text-sm text-muted-foreground">{owner.email}</p>
              </div>
            </div>
            <div className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full">소유자</div>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">아직 멤버가 없습니다</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.image} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedMember(member)} disabled={isRemoving}>
                  <UserMinus className="h-4 w-4 mr-2" />
                  제거
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>멤버 제거</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 {selectedMember?.name}님을 세션에서 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMember && handleRemoveMember(selectedMember.id)}
              disabled={isRemoving}
            >
              {isRemoving ? "제거 중..." : "제거"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
