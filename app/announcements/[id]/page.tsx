import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/lib/microcms/client";
import { Card } from "@/components/ui/Card";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);

  if (!announcement) {
    return {
      title: "お知らせが見つかりません | PetQ（ペットキュー）",
    };
  }

  return {
    title: `${announcement.title} | PetQ（ペットキュー）`,
    description: announcement.content.slice(0, 160),
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 戻るボタン */}
      <Link
        href="/announcements"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft size={20} />
        お知らせ一覧に戻る
      </Link>

      <Card>
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-4">{announcement.title}</h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar size={16} />
            <time>
              {format(
                new Date(announcement.publishedAt),
                "yyyy年MM月dd日 HH:mm",
                { locale: ja },
              )}
            </time>
            {announcement.revisedAt !== announcement.publishedAt && (
              <span className="text-xs">
                （更新:{" "}
                {format(new Date(announcement.revisedAt), "yyyy年MM月dd日", {
                  locale: ja,
                })}
                ）
              </span>
            )}
          </div>

          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </article>
      </Card>
    </div>
  );
}
