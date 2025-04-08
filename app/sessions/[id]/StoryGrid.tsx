"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import type { Story } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface StoryGridProps {
  stories: Story[]
}

export function StoryGrid({ stories }: StoryGridProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="relative aspect-square rounded-md overflow-hidden cursor-pointer border"
            onClick={() => setSelectedStory(story)}
          >
            <Image
              src={story.url || "/placeholder.svg"}
              alt={story.name || "마인크래프트 이미지"}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedStory?.name || "마인크래프트 이미지"}</DialogTitle>
            <DialogDescription>
              {selectedStory?.caption && <p className="mt-1">{selectedStory.caption}</p>}
              <p className="mt-1">업로드: {selectedStory && formatDate(selectedStory.createdAt)}</p>
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            {selectedStory && (
              <Image
                src={selectedStory.url || "/placeholder.svg"}
                alt={selectedStory.name || "마인크래프트 이미지"}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedStory(null)}>
              <X className="h-4 w-4 mr-2" />
              닫기
            </Button>
            {selectedStory && (
              <a href={selectedStory.downloadUrl} download target="_blank" rel="noopener noreferrer">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
