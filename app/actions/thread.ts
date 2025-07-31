'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// バリデーションスキーマ
const createThreadSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string().min(1, '本文を入力してください').max(2000, '本文は2000文字以内で入力してください'),
  categoryId: z.string().uuid('カテゴリを選択してください'),
  subCategoryId: z.string().uuid('サブカテゴリを選択してください'),
  imageUrls: z.array(z.string().url()).max(3, '画像は3枚まで投稿できます').optional()
})

export type CreateThreadInput = z.infer<typeof createThreadSchema>

// スレッド作成アクション
export async function createThread(input: CreateThreadInput) {
  try {
    // バリデーション
    const validatedData = createThreadSchema.parse(input)
    
    // IPアドレス取得
    const headersList = await headers()
    const userIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
    
    // Supabaseクライアント作成
    const supabase = await createClient()
    
    // RPC関数呼び出し
    const { data, error } = await supabase.rpc('create_thread', {
      p_title: validatedData.title,
      p_content: validatedData.content,
      p_category_id: validatedData.categoryId,
      p_sub_category_id: validatedData.subCategoryId,
      p_image_urls: validatedData.imageUrls || [],
      p_user_ip: userIp
    })
    
    if (error) {
      if (error.message.includes('連続投稿')) {
        return { success: false, error: '連続投稿はできません。1分後に再度お試しください。' }
      }
      throw error
    }
    
    // キャッシュをクリア
    revalidatePath('/')
    revalidatePath(`/category/${validatedData.categoryId}`)
    
    return { success: true, data }
  } catch (error) {
    console.error('スレッド作成エラー:', error)
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    
    return { success: false, error: 'スレッドの作成に失敗しました' }
  }
}