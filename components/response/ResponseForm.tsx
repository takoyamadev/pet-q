"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { createResponse } from "@/actions/response";
import type { CreateResponseInput } from "@/types/actions";

interface ResponseFormProps {
  threadId: string;
  onSuccess?: () => void;
  responses?: any[];
  onResponseClick?: (number: number) => void;
}

const schema = z.object({
  content: z
    .string()
    .min(1, "本文を入力してください")
    .max(1000, "本文は1000文字以内で入力してください"),
});

type FormData = z.infer<typeof schema>;

export function ResponseForm({ threadId, onSuccess, responses = [], onResponseClick }: ResponseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
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
        setSelectedResponses([]);
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

  // レス番号をクリックしたときの処理
  const handleResponseClick = (number: number) => {
    const currentContent = watch("content") || "";
    const anchorText = `>>${number}\n`;
    setValue("content", anchorText + currentContent);
    
    if (!selectedResponses.includes(number)) {
      setSelectedResponses([...selectedResponses, number]);
    }
    
    if (onResponseClick) {
      onResponseClick(number);
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
      </div>

      {/* レス選択ボタン */}
      {selectedResponses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">返信先:</span>
          {selectedResponses.map((num) => (
            <span
              key={num}
              className="text-sm px-2 py-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20"
              onClick={() => handleResponseClick(num)}
            >
              >>{num}
            </span>
          ))}
        </div>
      )}

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
