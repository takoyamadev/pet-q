'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { createResponse, type CreateResponseInput } from '@/actions/response'

interface ResponseFormProps {
  threadId: string
  onSuccess?: () => void
}

const schema = z.object({
  content: z.string().min(1, '本文を入力してください').max(1000, '本文は1000文字以内で入力してください'),
})

type FormData = z.infer<typeof schema>

export function ResponseForm({ threadId, onSuccess }: ResponseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [anchorNumber, setAnchorNumber] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await createResponse({
        threadId,
        content: data.content,
      } as CreateResponseInput)
      
      if (result.success) {
        reset()
        setAnchorNumber('')
        router.refresh()
        onSuccess?.()
      } else {
        alert(result.error || 'レスの投稿に失敗しました')
      }
    } catch {
      alert('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // アンカー追加
  const addAnchor = (number: string) => {
    const currentContent = watch('content') || ''
    const anchorText = `>>${number}\n`
    setValue('content', anchorText + currentContent)
    setAnchorNumber(number)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* アンカー入力（簡易版） */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">返信先:</span>
        <input
          type="text"
          value={anchorNumber}
          onChange={(e) => setAnchorNumber(e.target.value)}
          placeholder="レス番号"
          className="w-20 px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => anchorNumber && addAnchor(anchorNumber)}
          disabled={!anchorNumber}
        >
          追加
        </Button>
      </div>
      
      {/* 本文 */}
      <div>
        <textarea
          {...register('content')}
          rows={6}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="レスを入力..."
        />
        {errors.content && (
          <p className="text-error text-sm mt-1">{errors.content.message}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {watch('content')?.length || 0}/1000文字
        </p>
      </div>
      
      {/* 注意事項 */}
      <div className="text-sm text-muted-foreground">
        <p>※ 連続投稿は1分間に1回までです</p>
        <p>※ 個人情報の投稿はお控えください</p>
      </div>
      
      {/* 送信ボタン */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '投稿中...' : 'レスを投稿'}
        </Button>
      </div>
    </form>
  )
}