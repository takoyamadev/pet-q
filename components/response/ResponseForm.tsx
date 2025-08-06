"use client";

import { createResponse } from "@/actions/response";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { uploadImages } from "@/lib/supabase/storage";
import { logErrorClient, extractErrorDetails } from "@/lib/logger";
import { useToast } from "@/contexts/ToastContext";
import type { CreateResponseInput } from "@/types/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ResponseFormProps {
  threadId: string;
  onSuccess?: () => void;
}

const schema = z.object({
  content: z
    .string()
    .min(1, "本文を入力してください")
    .max(1000, "本文は1000文字以内で入力してください"),
});

type FormData = z.infer<typeof schema>;

export function ResponseForm({ threadId, onSuccess }: ResponseFormProps) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // 画像をアップロード
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        try {
          imageUrls = await uploadImages(selectedImages, "responses");
        } catch (error) {
          const errorDetails = extractErrorDetails(error);
          
          // エラーログを記録
          await logErrorClient({
            ...errorDetails,
            functionName: "ResponseForm.uploadImages",
            userAction: "upload_response_images",
            requestData: {
              threadId,
              imageCount: selectedImages.length,
              imageSizes: selectedImages.map(img => img.size),
              imageTypes: selectedImages.map(img => img.type),
            },
            severity: "error",
          });

          showError(error instanceof Error ? error.message : "画像のアップロードに失敗しました", {
            title: "画像アップロードエラー"
          });
          setIsSubmitting(false);
          return;
        }
      }

      // レスポンスを作成
      const responseData: CreateResponseInput = {
        threadId,
        content: data.content,
        imageUrls,
      };
      
      const result = await createResponse(responseData);

      if (result.success) {
        showSuccess("レスを投稿しました！");
        reset();
        setSelectedImages([]);
        router.refresh();
        onSuccess?.();
      } else {
        // サーバー側でエラーログは記録済みなので、クライアント側では簡単なログのみ
        await logErrorClient({
          errorMessage: `Response creation failed: ${result.error}`,
          functionName: "ResponseForm.createResponse",
          userAction: "create_response_failed",
          requestData: {
            threadId,
            hasImages: imageUrls.length > 0,
            contentLength: data.content.length,
          },
          severity: "warn",
        });
        
        showError(result.error || "レスの投稿に失敗しました", {
          title: "レス投稿エラー"
        });
      }
    } catch (error) {
      const errorDetails = extractErrorDetails(error);
      
      await logErrorClient({
        ...errorDetails,
        functionName: "ResponseForm.onSubmit",
        userAction: "create_response_exception",
        requestData: {
          threadId,
          hasSelectedImages: selectedImages.length > 0,
          contentLength: data.content?.length || 0,
        },
        severity: "error",
      });
      
      showError("予期しないエラーが発生しました", {
        title: "エラー"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 本文 */}
      <div>
        <textarea
          {...register("content")}
          rows={6}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="レスを入力..."
        />
        {errors.content && (
          <p className="text-error text-sm mt-1">{errors.content.message}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {watch("content")?.length || 0}/1000文字
        </p>

        {/* アンカーの使い方説明 */}
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
          <p>
            <strong>アンカーの付け方：</strong>
          </p>
          <p>• レス番号をクリックすると自動で「&gt;&gt;数字」が挿入されます</p>
          <p>• 手動で「&gt;&gt;1」のように入力することもできます</p>
          <p>
            •
            複数のレスに返信する場合は改行して「&gt;&gt;2」「&gt;&gt;3」と続けてください
          </p>
        </div>
      </div>

      {/* 画像アップロード */}
      <div>
        <label className="block text-sm font-medium mb-2">
          画像（任意）
        </label>
        <ImageUploader
          images={selectedImages}
          onImagesChange={setSelectedImages}
          maxImages={3}
          disabled={isSubmitting}
        />
      </div>

      {/* 注意事項 */}
      <div className="text-sm text-muted-foreground">
        <p>※ 連続投稿は1分間に1回までです</p>
        <p>※ 個人情報の投稿はお控えください</p>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "投稿中..." : "レスを投稿"}
        </Button>
      </div>
    </form>
  );
}
