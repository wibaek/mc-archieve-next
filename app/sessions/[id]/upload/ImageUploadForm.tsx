"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Upload, X } from "lucide-react"
import { uploadImage } from "@/lib/actions"

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "이미지 이름은 최소 2자 이상이어야 합니다.",
  }),
  caption: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `최대 파일 크기는 4MB입니다.`)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "JPG, PNG, WEBP 형식만 지원합니다."),
})

interface ImageUploadFormProps {
  sessionId: string
  userId: string
}

export function ImageUploadForm({ sessionId, userId }: ImageUploadFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      caption: "",
    },
  })

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("file", file)
    } else {
      setPreview(null)
      form.setValue("file", undefined as any)
    }
  }

  const clearFile = () => {
    setPreview(null)
    form.setValue("file", undefined as any)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await uploadImage({
        sessionId,
        name: values.name,
        caption: values.caption,
        file: values.file,
      })
      toast.success("이미지가 업로드되었습니다", {
        description: "세션에 이미지가 추가되었습니다.",
      })
      router.push(`/sessions/${sessionId}`)
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: "이미지를 업로드하는 중 문제가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이미지 이름</FormLabel>
              <FormControl>
                <Input placeholder="예: 마인크래프트 성" {...field} />
              </FormControl>
              <FormDescription>이 이미지의 이름을 입력하세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택사항)</FormLabel>
              <FormControl>
                <Textarea placeholder="이 이미지에 대한 설명을 입력하세요" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>이 이미지에 대한 설명을 입력하세요. (선택사항)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>이미지 파일</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-center w-full">
                  {!preview ? (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">클릭하여 업로드</span> 또는 파일을 여기에 드래그하세요
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (최대 4MB)</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-64">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !preview}>
          {isSubmitting ? (
            "업로드 중..."
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              이미지 업로드
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
