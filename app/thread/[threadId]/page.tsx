import { notFound } from "next/navigation";
import { getThreadById } from "@/lib/api/threads";
import { getResponsesByThreadId } from "@/lib/api/responses";
import { Card } from "@/components/ui/Card";
import { ThreadContent } from "@/components/thread/ThreadContent";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThreadById(threadId);

  if (!thread) {
    return {
      title: "スレッドが見つかりません | PetQ（ペットキュー）",
    };
  }

  return {
    title: `${thread.title} | PetQ（ペットキュー）`,
    description: thread.content.slice(0, 160),
  };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThreadById(threadId);

  if (!thread) {
    notFound();
  }

  const responses = await getResponsesByThreadId(threadId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくず */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          トップ
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href={`/category/${thread.category_id}`}
          className="text-muted-foreground hover:text-primary"
        >
          {thread.category_name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href={`/category/${thread.category_id}?sub=${thread.sub_category_id}`}
          className="text-muted-foreground hover:text-primary"
        >
          {thread.sub_category_name}
        </Link>
      </div>

      {/* スレッド本文 */}
      <Card className="mb-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{thread.title}</h1>

          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
              {thread.category_name}
            </span>
            <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">
              {thread.sub_category_name}
            </span>
          </div>

          <div className="whitespace-pre-wrap">{thread.content}</div>

          {/* 画像表示（TODO: 実装） */}
          {thread.image_urls && thread.image_urls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {/* 画像表示の実装 */}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            投稿日時:{" "}
            {format(new Date(thread.created_at), "yyyy/MM/dd HH:mm:ss", {
              locale: ja,
            })}
          </div>
        </div>
      </Card>

      {/* スレッド内容とレス */}
      <ThreadContent threadId={threadId} responses={responses} />

      {/* 画面上まで戻るボタン */}
      <ScrollToTopButton />
    </div>
  );
}