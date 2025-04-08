"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createSession } from "@/lib/actions"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "세션 이름은 최소 2자 이상이어야 합니다.",
  }),
  description: z.string().optional(),
})

interface NewSessionFormProps {
  userId: string
}

export function NewSessionForm({ userId }: NewSessionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const sessionId = await createSession({
        ...values,
        ownerId: userId,
      })
      toast.success("세션이 생성되었습니다", {
        description: "이제 이미지를 업로드할 수 있습니다.",
      })
      router.push(`/sessions/${sessionId}`)
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: "세션을 생성하는 중 문제가 발생했습니다. 다시 시도해주세요.",
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
              <FormLabel>세션 이름</FormLabel>
              <FormControl>
                <Input placeholder="예: 서바이벌 서버" {...field} />
              </FormControl>
              <FormDescription>
                이 세션의 이름을 입력하세요. 서버 이름이나 월드 이름을 사용할 수 있습니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택사항)</FormLabel>
              <FormControl>
                <Textarea placeholder="이 세션에 대한 설명을 입력하세요" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "세션 생성하기"}
        </Button>
      </form>
    </Form>
  )
}
