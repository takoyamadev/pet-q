import { ThreadList } from "@/components/thread/ThreadList";
import { Card } from "@/components/ui/Card";
import { getPopularThreads } from "@/lib/api/threads";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "人気スレッド一覧 | PetQ（ペットキュー）",
  description: "ペット飼育に関する人気の相談・質問スレッド一覧",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const THREADS_PER_PAGE = 20;

export default async function PopularThreadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);

  const threads = await getPopularThreads(undefined, THREADS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくず */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          トップ
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-primary">人気スレッド</span>
      </div>

      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-primary" size={24} />
          <h1 className="text-2xl font-bold">人気スレッド一覧</h1>
        </div>
        <p className="text-muted-foreground">
          レスポンスが多い順に人気のスレッドを表示しています
        </p>
      </div>

      {/* スレッド一覧 */}
      {threads.length > 0 ? (
        <>
          <div className="space-y-4">
            {threads.map((thread, index) => (
              <div key={thread.id} className="relative">
                {/* ランキング番号 */}
                {index < 3 && (
                  <div
                    className={`absolute -left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-yellow-900"
                        : index === 1
                          ? "bg-gray-400 text-gray-900"
                          : "bg-orange-600 text-orange-100"
                    }`}
                  >
                    {index + 1}
                  </div>
                )}
                <ThreadList threads={[thread]} />
              </div>
            ))}
          </div>

          {/* ページネーション（今後実装予定） */}
          <div className="mt-8 flex justify-center items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/threads/popular?page=${currentPage - 1}`}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                <ChevronLeft size={16} />
                前のページ
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background opacity-50 cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                前のページ
              </button>
            )}

            <span className="px-4 py-2 text-sm">{currentPage}ページ目</span>

            {threads.length >= THREADS_PER_PAGE ? (
              <Link
                href={`/threads/popular?page=${currentPage + 1}`}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                次のページ
                <ChevronRight size={16} />
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background opacity-50 cursor-not-allowed"
              >
                次のページ
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </>
      ) : (
        <Card>
          <p className="text-center text-muted-foreground py-12">
            人気スレッドがまだありません
          </p>
        </Card>
      )}
    </div>
  );
}
