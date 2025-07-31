import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

// カテゴリ一覧取得
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('カテゴリ取得エラー:', error)
    return []
  }

  return data || []
}

// メインカテゴリ一覧取得
export async function getMainCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'main')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('メインカテゴリ取得エラー:', error)
    return []
  }

  return data || []
}

// サブカテゴリ一覧取得
export async function getSubCategories(parentId: string): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'sub')
    .eq('parent_id', parentId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('サブカテゴリ取得エラー:', error)
    return []
  }

  return data || []
}

// カテゴリID取得
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('カテゴリ取得エラー:', error)
    return null
  }

  return data
}