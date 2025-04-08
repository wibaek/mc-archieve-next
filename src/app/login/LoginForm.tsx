"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/lib/auth"
import { loginAction } from "@/app/actions"

interface LoginFormProps {
  callbackUrl?: string
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true)
      const result = await loginAction(values)

      if (!result.success) {
        toast.error("로그인 실패", {
          description: result.error,
        })
        return
      }

      toast.success("로그인 성공", {
        description: "환영합니다!",
      })

      router.push(callbackUrl || "/")
      router.refresh()
    } catch (error) {
      toast.error("오류가 발생했습니다", {
        description: "로그인 중 문제가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </Form>
  )
}
