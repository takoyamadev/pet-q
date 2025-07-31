'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// バリデーションスキーマ
const createResponseSchema = z.object({
  threadId: z.string().uuid('スレッドIDが無効です'),
  content: z.string().min(1, '本文を入力してください').max(1000, '本文は1000文字以内で入力してください'),
  anchorTo: z.string().uuid().optional(),
  imageUrls: z.array(z.string().url()).max(3, '画像は3枚まで投稿できます').optional()
})

export type CreateResponseInput = z.infer<typeof createResponseSchema>

// レスポンス作成アクション
export async function createResponse(input: CreateResponseInput) {
  try {
    // バリデーション
    const validatedData = createResponseSchema.parse(input)
    
    // IPアドレス取得
    const headersList = await headers()
    const userIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
    
    // Supabaseクライアント作成
    const supabase = await createClient()
    
    // RPC関数呼び出し
    const { data, error } = await supabase.rpc('create_response', {
      p_thread_id: validatedData.threadId,
      p_content: validatedData.content,
      p_image_urls: validatedData.imageUrls || [],
      p_anchor_to: validatedData.anchorTo || null,
      p_user_ip: userIp
    })
    
    if (error) {
      if (error.message.includes('連続投稿')) {
        return { success: false, error: '連続投稿はできません。1分後に再度お試しください。' }
      }
      throw error
    }
    
    // キャッシュをクリア
    revalidatePath(`/thread/${validatedData.threadId}`)
    
    return { success: true, data }
  } catch (error) {
    console.error('レスポンス作成エラー:', error)
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    
    return { success: false, error: 'レスの投稿に失敗しました' }
  }
}