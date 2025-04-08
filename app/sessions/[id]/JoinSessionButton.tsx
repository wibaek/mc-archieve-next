"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createMembershipRequest } from "@/lib/actions"
import type { MembershipRequest } from "@/lib/types"

interface JoinSessionButtonProps {
  sessionId: string
  existingRequest: MembershipRequest | null
}

export function JoinSessionButton({ sessionId, existingRequest }: JoinSessionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await createMembershipRequest(sessionId, message)
      toast.success("참여 요청이 전송되었습니다", {
        description: "세션 관리자가 요청을 검토할 것입니다.",
      })
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: error instanceof Error ? error.message : "참여 요청을 보내는 중 문제가 발생했습니다.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (existingRequest) {
    if (existingRequest.status === "pending") {
      return (
        <Button variant="outline" disabled className="border-mc-gray/50">
          참여 요청 대기 중
        </Button>
      )
    } else if (existingRequest.status === "rejected") {
      return (
        <Button variant="outline" disabled className="border-mc-gray/50">
          참여 요청이 거절됨
        </Button>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-mc-green hover:bg-mc-green/90 text-white">세션 참여 요청</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>세션 참여 요청</DialogTitle>
          <DialogDescription>
            세션 관리자에게 참여 요청을 보냅니다. 메시지를 남겨 참여 이유를 설명할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="참여 이유를 입력하세요 (선택사항)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-mc-green hover:bg-mc-green/90 text-white"
          >
            {isSubmitting ? "요청 중..." : "요청 보내기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
