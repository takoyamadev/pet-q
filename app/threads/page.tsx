import { ThreadList } from "@/components/thread/ThreadList";
import { Card } from "@/components/ui/Card";
import { getLatestThreads } from "@/lib/api/threads";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "新着スレッド一覧 | PetQ（ペットキュー）",
  description: "ペット飼育に関する最新の相談・質問スレッド一覧",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const THREADS_PER_PAGE = 20;

export default async function ThreadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);

  const threads = await getLatestThreads(THREADS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくず */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          トップ
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-primary">新着スレッド</span>
      </div>

      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">新着スレッド一覧</h1>
        <p className="text-muted-foreground">
          すべてのカテゴリから最新のスレッドを表示しています
        </p>
      </div>

      {/* スレッド一覧 */}
      {threads.length > 0 ? (
        <>
          <ThreadList threads={threads} />

          {/* ページネーション（今後実装予定） */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              前のページ
            </button>
            
            <span className="px-4 py-2 text-sm">
              {currentPage}ページ目
            </span>

            <button
              disabled={threads.length < THREADS_PER_PAGE}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              次のページ
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      ) : (
        <Card>
          <p className="text-center text-muted-foreground py-12">
            スレッドがまだありません
          </p>
        </Card>
      )}
    </div>
  );
}