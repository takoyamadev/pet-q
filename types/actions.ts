import { z } from "zod";

// Response action types
export const createResponseSchema = z.object({
  threadId: z.string().uuid("スレッドIDが無効です"),
  content: z
    .string()
    .min(1, "本文を入力してください")
    .max(1000, "本文は1000文字以内で入力してください"),
  anchorTo: z.string().uuid().optional(),
  imageUrls: z
    .array(z.string().url())
    .max(3, "画像は3枚まで投稿できます")
    .optional(),
});

export type CreateResponseInput = z.infer<typeof createResponseSchema>;

// Thread action types
export const createThreadSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  content: z
    .string()
    .min(1, "本文を入力してください")
    .max(2000, "本文は2000文字以内で入力してください"),
  categoryId: z.string().uuid("カテゴリを選択してください"),
  subCategoryId: z.string().uuid("サブカテゴリを選択してください"),
  imageUrls: z
    .array(z.string().url())
    .max(3, "画像は3枚まで投稿できます")
    .optional(),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;
