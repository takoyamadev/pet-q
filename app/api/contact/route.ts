import { NextResponse } from "next/server";
import { CONTACT_SUBJECTS } from "@/lib/constants/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // バリデーション
    if (!message?.trim()) {
      return NextResponse.json(
        { error: "本文は必須です" },
        { status: 400 }
      );
    }

    // Discord Webhook URLの確認
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set");
      return NextResponse.json(
        { error: "サーバーエラーが発生しました" },
        { status: 500 }
      );
    }

    // 件名のラベルを取得
    const subjectLabel = CONTACT_SUBJECTS.find(
      (s) => s.value === subject
    )?.label || "不明";

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
              value: message.length > 1024 ? message.substring(0, 1021) + "..." : message,
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
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "お問い合わせを受け付けました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}