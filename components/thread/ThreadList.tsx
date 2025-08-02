import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ThreadWithCategory {
  id: string;
  title: string;
  content: string;
  category_name?: string;
  sub_category_name?: string;
  response_count: number;
  created_at: Date;
  last_response_at?: Date;
}

interface ThreadListProps {
  threads: ThreadWithCategory[];
  showCategory?: boolean;
}

export function ThreadList({ threads, showCategory = true }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <Card>
        <p className="text-center text-muted-foreground py-8">
          スレッドがありません
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Link key={thread.id} href={`/thread/${thread.id}`}>
          <Card className="hover:border-primary transition-colors">
            <div className="space-y-2">
              {/* カテゴリ表示 */}
              {showCategory &&
                (thread.category_name || thread.sub_category_name) && (
                  <div className="flex items-center gap-2 text-sm">
                    {thread.category_name && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {thread.category_name}
                      </span>
                    )}
                    {thread.sub_category_name && (
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">
                        {thread.sub_category_name}
                      </span>
                    )}
                  </div>
                )}

              {/* タイトル */}
              <h3 className="font-semibold text-lg line-clamp-2">
                {thread.title}
              </h3>

              {/* 本文プレビュー */}
              <p className="text-muted-foreground line-clamp-2">
                {thread.content}
              </p>

              {/* メタ情報 */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  {thread.response_count}件
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {format(new Date(thread.created_at), "yyyy/MM/dd HH:mm", {
                    locale: ja,
                  })}
                </span>
                {thread.last_response_at && (
                  <span className="text-xs">
                    最終:{" "}
                    {format(new Date(thread.last_response_at), "MM/dd HH:mm", {
                      locale: ja,
                    })}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
