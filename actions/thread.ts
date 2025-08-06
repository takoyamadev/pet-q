"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createThreadSchema, type CreateThreadInput } from "@/types/actions";
import { logError, withErrorLogging, extractErrorDetails } from "@/lib/logger";

// スレッド作成アクション
export async function createThread(input: CreateThreadInput) {
  return await withErrorLogging(
    async () => {
      try {
        // バリデーション
        const validatedData = createThreadSchema.parse(input);

        // IPアドレス取得
        const headersList = await headers();
        const userIp =
          headersList.get("x-forwarded-for") ||
          headersList.get("x-real-ip") ||
          null;

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
          // DB固有のエラーをログに記録
          await logError({
            errorMessage: `Database error in createThread: ${error.message}`,
            errorStack: error.stack,
            errorType: "DatabaseError",
            functionName: "createThread",
            userAction: "create_thread",
            requestData: { 
              title: validatedData.title,
              categoryId: validatedData.categoryId,
              hasImages: (validatedData.imageUrls?.length || 0) > 0
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
        revalidatePath("/");
        revalidatePath(`/category/${validatedData.categoryId}`);

        return { success: true, data };
      } catch (error) {
        if (error instanceof z.ZodError) {
          // バリデーションエラーをログに記録
          await logError({
            errorMessage: `Validation error in createThread: ${error.issues[0].message}`,
            errorType: "ValidationError",
            functionName: "createThread",
            userAction: "create_thread",
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
      functionName: "createThread",
      userAction: "create_thread",
      requestData: {
        title: input.title?.substring(0, 50) + (input.title?.length > 50 ? "..." : ""),
        categoryId: input.categoryId,
        hasImages: (input.imageUrls?.length || 0) > 0,
      },
    }
  ).catch((error) => {
    console.error("スレッド作成エラー:", error);
    return { success: false, error: "スレッドの作成に失敗しました" };
  });
}
