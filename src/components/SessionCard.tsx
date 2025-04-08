import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Session } from "@/lib/types"

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Card className="overflow-hidden border border-mc-gray/30 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3 bg-mc-brown text-white">
        <CardTitle>{session.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {session.stories && session.stories.length > 0 ? (
          <div className="relative aspect-video">
            <Image
              src={session.stories[0].url || "/placeholder.svg"}
              alt={session.stories[0].name || "마인크래프트 이미지"}
              fill
              className="object-cover pixelated"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center aspect-video bg-mc-gray/10">
            <ImageIcon className="h-10 w-10 text-mc-gray/50" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          {session.stories?.length || 0} 이미지 • {formatDate(session.createdAt)}
        </div>
        <div className="flex gap-2">
          <Link href={`/sessions/${session.id}/upload`}>
            <Button size="sm" variant="outline" className="border-mc-gray/50">
              <Upload className="h-4 w-4 mr-1" />
              업로드
            </Button>
          </Link>
          <Link href={`/sessions/${session.id}`}>
            <Button size="sm" className="bg-mc-green hover:bg-mc-green/90 text-white">
              보기
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
