"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ResponseForm } from "@/components/response/ResponseForm";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ThreadContentProps {
  threadId: string;
  responses: any[];
}

export function ThreadContent({ threadId, responses }: ThreadContentProps) {
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);

  const handleResponseNumberClick = (number: number) => {
    const form = document.querySelector('textarea');
    if (form) {
      const currentContent = form.value || "";
      form.value = `>>${number}\n${currentContent}`;
      form.focus();
      
      // React Hook Formのvalueを更新
      const event = new Event('input', { bubbles: true });
      form.dispatchEvent(event);
    }
  };

  return (
    <>
      {/* レス投稿フォーム */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold mb-4">レスを投稿</h3>
        <ResponseForm 
          threadId={threadId} 
          responses={responses}
          onResponseClick={(num) => setSelectedResponse(num)}
        />
      </Card>

      {/* レスポンス一覧 */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">レス（{responses.length}件）</h2>

        {responses.length === 0 ? (
          <Card>
            <p className="text-center text-muted-foreground py-8">
              まだレスがありません
            </p>
          </Card>
        ) : (
          responses.map((response, index) => (
            <Card key={response.id} id={`res-${index + 1}`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span 
                    className="font-semibold text-primary cursor-pointer hover:underline"
                    onClick={() => handleResponseNumberClick(index + 1)}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(
                      new Date(response.created_at),
                      "yyyy/MM/dd HH:mm:ss",
                      { locale: ja },
                    )}
                  </span>
                </div>

                {/* アンカー表示 */}
                {response.anchor_to && (
                  <div className="text-sm text-primary">
                    {`>>${responses.findIndex((r) => r.id === response.anchor_to) + 1}`}
                  </div>
                )}

                <div className="whitespace-pre-wrap">
                  {response.content.split(/(>>\d+)/).map((part, idx) => {
                    const match = part.match(/^>>(\d+)$/);
                    if (match) {
                      const num = parseInt(match[1]);
                      return (
                        <a
                          key={idx}
                          href={`#res-${num}`}
                          className="text-primary hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(`res-${num}`);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          {part}
                        </a>
                      );
                    }
                    return <span key={idx}>{part}</span>;
                  })}
                </div>

                {/* 画像表示（TODO: 実装） */}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}