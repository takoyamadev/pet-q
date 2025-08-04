import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Thread } from "@/types";

interface ThreadWithCategory extends Thread {
  category_name?: string;
  sub_category_name?: string;
  view_count?: number;
}

// スレッド一覧取得
export async function getThreads(
  categoryId?: string,
  subCategoryId?: string,
  limit: number = 20,
  offset: number = 0,
): Promise<ThreadWithCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_threads", {
    p_category_id: categoryId || null,
    p_sub_category_id: subCategoryId || null,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("スレッド取得エラー:", error);
    return [];
  }

  return data || [];
}

// 新着スレッド取得
export async function getLatestThreads(
  limit: number = 10,
): Promise<ThreadWithCategory[]> {
  return getThreads(undefined, undefined, limit, 0);
}

// 人気スレッド取得
export async function getPopularThreads(
  categoryId?: string,
  limit: number = 10,
): Promise<ThreadWithCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_popular_threads", {
    p_category_id: categoryId || null,
    p_limit: limit,
  });

  if (error) {
    console.error("人気スレッド取得エラー:", error);
    return [];
  }

  return data || [];
}

// スレッドIDで取得
export async function getThreadById(
  id: string,
): Promise<ThreadWithCategory | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("threads")
    .select(
      `
      *,
      category:categories!threads_category_id_fkey(name),
      sub_category:categories!threads_sub_category_id_fkey(name)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("スレッド取得エラー:", error);
    return null;
  }

  return {
    ...data,
    category_name: data.category?.name,
    sub_category_name: data.sub_category?.name,
  };
}

// スレッド検索
export async function searchThreads(
  keyword: string,
  categoryId?: string,
  limit: number = 20,
  offset: number = 0,
): Promise<ThreadWithCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_threads", {
    p_keyword: keyword,
    p_category_id: categoryId || null,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("スレッド検索エラー:", error);
    return [];
  }

  return data || [];
}
