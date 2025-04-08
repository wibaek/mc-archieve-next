"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { acceptMembershipRequest, rejectMembershipRequest } from "@/lib/actions"
import type { MembershipRequest } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface RequestListProps {
  requests: MembershipRequest[]
}

export function RequestList({ requests }: RequestListProps) {
  const router = useRouter()
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const handleAccept = async (requestId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId))
      await acceptMembershipRequest(requestId)
      toast.success("멤버십 요청이 수락되었습니다")
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: "요청을 처리하는 중 문제가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId))
      await rejectMembershipRequest(requestId)
      toast.success("멤버십 요청이 거절되었습니다")
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: "요청을 처리하는 중 문제가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={request.user?.image} />
                <AvatarFallback>{request.user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.user?.name}</p>
                <p className="text-sm text-muted-foreground">{request.user?.email}</p>
                <p className="text-xs text-muted-foreground">요청일: {formatDate(request.createdAt)}</p>
              </div>
            </div>
            {request.message && (
              <CardDescription className="mt-4 p-3 bg-muted rounded-md">{request.message}</CardDescription>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleReject(request.id)} disabled={processingIds.has(request.id)}>
              거절
            </Button>
            <Button onClick={() => handleAccept(request.id)} disabled={processingIds.has(request.id)}>
              수락
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
