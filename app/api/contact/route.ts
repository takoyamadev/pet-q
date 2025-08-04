import { CONTACT_SUBJECTS } from "@/lib/constants/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

// バリデーションスキーマ
const contactSchema = z.object({
  name: z.string().max(100, "名前は100文字以内で入力してください").optional(),
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .max(255, "メールアドレスは255文字以内で入力してください")
    .optional()
    .or(z.literal("")),
  subject: z.string().optional(),
  message: z
    .string()
    .min(1, "本文は必須です")
    .max(5000, "本文は5000文字以内で入力してください"),
});

export async function POST(request: Request) {
  try {
    // レートリミットチェック
    const headersList = await headers();
    const identifier =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      "anonymous";

    const { success, limit, remaining, reset } =
      await checkRateLimit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error:
            "リクエスト数が制限を超えました。しばらく待ってから再度お試しください。",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          },
        },
      );
    }

    const body = await request.json();

    // Zodでバリデーション
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      return NextResponse.json({ error: errors.fieldErrors }, { status: 400 });
    }

    const { name, email, subject, message } = validationResult.data;

    // Discord Webhook URLの確認
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set");
      return NextResponse.json(
        { error: "サーバーエラーが発生しました" },
        { status: 500 },
      );
    }

    // 件名のラベルを取得
    const subjectLabel =
      CONTACT_SUBJECTS.find((s) => s.value === subject)?.label || "不明";

    // Discord用のメッセージを作成
    const discordMessage = {
      embeds: [
        {
          title: "新しいお問い合わせ",
          color: 0x3b82f6, // 青色
          fields: [
            {
              name: "👤 名前",
              value: name || "名無し",
              inline: true,
            },
            {
              name: "📧 メールアドレス",
              value: email || "未入力",
              inline: true,
            },
            {
              name: "📋 件名",
              value: subjectLabel,
              inline: true,
            },
            {
              name: "💬 本文",
              value:
                message.length > 1024
                  ? message.substring(0, 1021) + "..."
                  : message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "PetQ お問い合わせフォーム",
          },
        },
      ],
    };

    // Discordに送信
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!discordResponse.ok) {
      console.error("Discord webhook error:", await discordResponse.text());
      return NextResponse.json(
        { error: "送信に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "お問い合わせを受け付けました" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
