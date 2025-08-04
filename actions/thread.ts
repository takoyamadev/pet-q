"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createThreadSchema, type CreateThreadInput } from "@/types/actions";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

// スレッド作成アクション
export async function createThread(input: CreateThreadInput) {
  try {
    // バリデーション
    const validatedData = createThreadSchema.parse(input);

    // IPアドレス取得
    const headersList = await headers();
    const userIp =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      null;
    
    // レートリミットチェック
    const identifier = userIp || "anonymous";
    const { success } = await checkRateLimit(`thread:${identifier}`);
    
    if (!success) {
      return {
        success: false,
        error: "リクエスト数が制限を超えました。しばらく待ってから再度お試しください。",
      };
    }

    // Supabaseクライアント作成
    const supabase = await createClient();

    // RPC関数呼び出し
    const { data, error } = await supabase.rpc("create_thread", {
      p_title: validatedData.title,
      p_content: validatedData.content,
      p_category_id: validatedData.categoryId,
      p_sub_category_id: validatedData.subCategoryId,
      p_image_urls: validatedData.imageUrls || [],
      p_user_ip: userIp,
    });

    if (error) {
      if (error.message.includes("連続投稿")) {
        return {
          success: false,
          error: "連続投稿はできません。1分後に再度お試しください。",
        };
      }
      throw error;
    }

    // キャッシュをクリア
    revalidatePath("/");
    revalidatePath(`/category/${validatedData.categoryId}`);

    return { success: true, data };
  } catch (error) {
    console.error("スレッド作成エラー:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: "スレッドの作成に失敗しました" };
  }
}
