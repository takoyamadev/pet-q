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
import { logError, withErrorLogging } from "@/lib/logger";

// レスポンス作成アクション
export async function createResponse(input: CreateResponseInput) {
  return await withErrorLogging(
    async () => {
      try {
        // バリデーション
        const validatedData = createResponseSchema.parse(input);

        // IPアドレス取得
        const headersList = await headers();
        const userIp =
          headersList.get("x-forwarded-for") ||
          headersList.get("x-real-ip") ||
          null;

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
          // DB固有のエラーをログに記録
          await logError({
            errorMessage: `Database error in createResponse: ${error.message}`,
            errorStack: error.stack,
            errorType: "DatabaseError",
            functionName: "createResponse",
            userAction: "create_response",
            requestData: {
              threadId: validatedData.threadId,
              hasImages: (validatedData.imageUrls?.length || 0) > 0,
              hasAnchor: !!validatedData.anchorTo,
              contentLength: validatedData.content.length,
            },
            severity: "error",
          });

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
        if (error instanceof z.ZodError) {
          // バリデーションエラーをログに記録
          await logError({
            errorMessage: `Validation error in createResponse: ${error.issues[0].message}`,
            errorType: "ValidationError",
            functionName: "createResponse",
            userAction: "create_response",
            requestData: input,
            severity: "warn",
          });
          
          return { success: false, error: error.issues[0].message };
        }

        // その他のエラーは withErrorLogging で処理される
        throw error;
      }
    },
    {
      functionName: "createResponse",
      userAction: "create_response",
      requestData: {
        threadId: input.threadId,
        hasImages: (input.imageUrls?.length || 0) > 0,
        contentLength: input.content?.length || 0,
      },
    }
  ).catch((error) => {
    console.error("レスポンス作成エラー:", error);
    return { success: false, error: "レスの投稿に失敗しました" };
  });
}
