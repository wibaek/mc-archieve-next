import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { MembershipRequest } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface MyRequestListProps {
  requests: MembershipRequest[]
}

export function MyRequestList({ requests }: MyRequestListProps) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/sessions/${request.sessionId}`} className="font-medium text-lg hover:underline">
                  세션 #{request.sessionId}
                </Link>
                <p className="text-sm text-muted-foreground">요청일: {formatDate(request.createdAt)}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>
            {request.message && (
              <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">내 메시지:</p>
                <p>{request.message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href={`/sessions/${request.sessionId}`} className="text-sm text-muted-foreground hover:underline">
              세션 보기
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: MembershipRequest["status"] }) {
  if (status === "pending") {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800"
      >
        대기 중
      </Badge>
    )
  } else if (status === "accepted") {
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800"
      >
        수락됨
      </Badge>
    )
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800"
      >
        거절됨
      </Badge>
    )
  }
}
