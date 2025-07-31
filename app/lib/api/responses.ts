import { createClient } from "@/lib/supabase/server";
import type { Response } from "@/types";

// レスポンス一覧取得
export async function getResponsesByThreadId(
  threadId: string,
): Promise<Response[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("レスポンス取得エラー:", error);
    return [];
  }

  return data || [];
}
