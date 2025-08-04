"use client";

import { createResponse } from "@/actions/response";
import { Button } from "@/components/ui/Button";
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

export function ResponseForm({
  threadId,
  onSuccess,
}: ResponseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const result = await createResponse({
        threadId,
        content: data.content,
      } as CreateResponseInput);

      if (result.success) {
        reset();
        router.refresh();
        onSuccess?.();
      } else {
        alert(result.error || "レスの投稿に失敗しました");
      }
    } catch {
      alert("エラーが発生しました");
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
