"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CONTACT_SUBJECTS } from "@/lib/constants/contact";
import { Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.message.trim()) {
      setSubmitStatus({
        type: "error",
        message: "本文を入力してください",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // APIに送信
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || "名無し",
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "送信に失敗しました");
      }
      
      // 成功時の処理
      setSubmitStatus({
        type: "success",
        message: "お問い合わせを受け付けました。ありがとうございます。",
      });
      
      // フォームをリセット
      setFormData({
        name: "",
        email: "",
        subject: "general",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "送信に失敗しました。時間をおいて再度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // エラーメッセージをクリア
    if (submitStatus.type === "error") {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">お問い合わせ</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              お名前（任意）
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="名無し"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              メールアドレス（任意）
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              返信が必要な場合はメールアドレスをご入力ください
            </p>
          </div>

          {/* 件名 */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              件名
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {CONTACT_SUBJECTS.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>

          {/* 本文 */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              本文 <span className="text-destructive">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="お問い合わせ内容をご記入ください"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
              required
            />
          </div>

          {/* ステータスメッセージ */}
          {submitStatus.type && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* 送信ボタン */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              "送信中..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                送信する
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* 注意事項 */}
      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <p>※ お問い合わせいただいた内容は、サービス改善のために利用させていただきます。</p>
        <p>※ 返信が必要な場合は、メールアドレスを必ずご入力ください。</p>
        <p>※ 通常、3営業日以内に返信いたします。</p>
      </div>
    </div>
  );
}