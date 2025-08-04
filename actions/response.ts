"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import {
  createResponseSchema,
  type CreateResponseInput,
} from "@/types/actions";
import { checkRateLimit } from "@/lib/rate-limit";

// レスポンス作成アクション
export async function createResponse(input: CreateResponseInput) {
  try {
    // バリデーション
    const validatedData = createResponseSchema.parse(input);

    // IPアドレス取得
    const headersList = await headers();
    const userIp =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      null;

    // レートリミットチェック
    const identifier = userIp || "anonymous";
    const { success } = await checkRateLimit(`response:${identifier}`);

    if (!success) {
      return {
        success: false,
        error:
          "リクエスト数が制限を超えました。しばらく待ってから再度お試しください。",
      };
    }

    // Supabaseクライアント作成
    const supabase = await createClient();

    // RPC関数呼び出し
    const { data, error } = await supabase.rpc("create_response", {
      p_thread_id: validatedData.threadId,
      p_content: validatedData.content,
      p_image_urls: validatedData.imageUrls || [],
      p_anchor_to: validatedData.anchorTo || null,
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
    revalidatePath(`/thread/${validatedData.threadId}`);

    return { success: true, data };
  } catch (error) {
    console.error("レスポンス作成エラー:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: "レスの投稿に失敗しました" };
  }
}
