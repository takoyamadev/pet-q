import { CategoryGrid } from "@/components/category/CategoryGrid";
import { ThreadList } from "@/components/thread/ThreadList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getMainCategories } from "@/lib/api/categories";
import { getLatestThreads, getPopularThreads } from "@/lib/api/threads";
import { getAnnouncements } from "@/lib/microcms/client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const categories = await getMainCategories();
  const latestThreads = await getLatestThreads(5);
  const popularThreads = await getPopularThreads(undefined, 5);
  const announcements = await getAnnouncements(3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          ペット飼育者のための匿名掲示板
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          犬・猫・小動物・鳥・爬虫類など、あらゆるペットの飼育相談・健康・しつけについて
          気軽に情報交換できるコミュニティです
        </p>
      </section>

      {/* カテゴリ一覧 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">ペットカテゴリから選ぶ</h2>
        <CategoryGrid categories={categories} />
      </section>

      {/* 新着スレッド */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">新着スレッド</h2>
          <Link href="/threads">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              すべて見る →
            </Button>
          </Link>
        </div>
        {latestThreads.length > 0 ? (
          <ThreadList threads={latestThreads} />
        ) : (
          <Card>
            <p className="text-muted-foreground text-center py-8">
              新着スレッドはまだありません
            </p>
          </Card>
        )}
      </section>

      {/* 人気スレッド */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">人気スレッド</h2>
          <Link href="/threads/popular">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              すべて見る →
            </Button>
          </Link>
        </div>
        {popularThreads.length > 0 ? (
          <ThreadList threads={popularThreads} />
        ) : (
          <Card>
            <p className="text-muted-foreground text-center py-8">
              人気スレッドはまだありません
            </p>
          </Card>
        )}
      </section>

      {/* お知らせ */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">お知らせ</h2>
          <Link href="/announcements">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              すべて見る →
            </Button>
          </Link>
        </div>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/announcements/${announcement.id}`}
              >
                <Card className="hover:border-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar size={14} />
                        <time>
                          {format(
                            new Date(announcement.publishedAt),
                            "yyyy/MM/dd",
                            { locale: ja },
                          )}
                        </time>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-muted-foreground text-center py-8">
              お知らせはまだありません
            </p>
          </Card>
        )}
      </section>

      {/* FAB（フローティングアクションボタン） */}
      <Link
        href="/threads/new"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 animate-bounce-in"
      >
        <Button className="rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          <Plus size={24} />
        </Button>
      </Link>
    </div>
  );
}
