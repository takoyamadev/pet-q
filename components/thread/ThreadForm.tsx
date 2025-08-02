"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createThread } from "@/actions/thread";
import type { CreateThreadInput } from "@/types/actions";
import type { Category } from "@/types";

interface ThreadFormProps {
  categories: Category[];
}

const schema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  content: z
    .string()
    .min(1, "本文を入力してください")
    .max(2000, "本文は2000文字以内で入力してください"),
  categoryId: z.string().min(1, "カテゴリを選択してください"),
  subCategoryId: z.string().min(1, "サブカテゴリを選択してください"),
});

type FormData = z.infer<typeof schema>;

export function ThreadForm({ categories }: ThreadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // メインカテゴリとサブカテゴリを分離
  const mainCategories = categories.filter((c) => c.type === "main");
  const subCategories = categories.filter(
    (c) => c.type === "sub" && c.parent_id === selectedMainCategory,
  );

  // メインカテゴリが変更されたらサブカテゴリをリセット
  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const categoryId = e.target.value;
    setSelectedMainCategory(categoryId);
    setValue("categoryId", categoryId);
    setValue("subCategoryId", "");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await createThread(data as CreateThreadInput);

      if (result.success && result.data) {
        router.push(`/thread/${result.data.id}`);
      } else {
        alert(result.error || "スレッドの作成に失敗しました");
      }
    } catch {
      alert("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* カテゴリ選択 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            ペットの種類 <span className="text-error">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={handleMainCategoryChange}
          >
            <option value="">選択してください</option>
            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-error text-sm mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* サブカテゴリ選択 */}
        {selectedMainCategory && (
          <div>
            <label className="block text-sm font-medium mb-2">
              相談内容 <span className="text-error">*</span>
            </label>
            <select
              {...register("subCategoryId")}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">選択してください</option>
              {subCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.subCategoryId && (
              <p className="text-error text-sm mt-1">
                {errors.subCategoryId.message}
              </p>
            )}
          </div>
        )}

        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium mb-2">
            タイトル <span className="text-error">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="例：子犬のしつけについて相談したいです"
          />
          {errors.title && (
            <p className="text-error text-sm mt-1">{errors.title.message}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {watch("title")?.length || 0}/100文字
          </p>
        </div>

        {/* 本文 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            本文 <span className="text-error">*</span>
          </label>
          <textarea
            {...register("content")}
            rows={8}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="詳しい内容を記入してください"
          />
          {errors.content && (
            <p className="text-error text-sm mt-1">{errors.content.message}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {watch("content")?.length || 0}/2000文字
          </p>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "投稿中..." : "スレッドを作成"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
