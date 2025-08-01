import type { Announcement } from "@/types";
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// お知らせ一覧取得
export async function getAnnouncements(limit: number = 10) {
  try {
    const response = await client.get({
      endpoint: "announcements",
      queries: { limit },
    });
    return response.contents as Announcement[];
  } catch (error) {
    console.error("お知らせ取得エラー:", error);
    return [];
  }
}

// お知らせ詳細取得
export async function getAnnouncementById(id: string) {
  try {
    const announcement = await client.get({
      endpoint: "announcements",
      contentId: id,
    });
    console.log(announcement);
    return announcement as Announcement;
  } catch (error) {
    console.error("お知らせ詳細取得エラー:", error);
    return null;
  }
}
