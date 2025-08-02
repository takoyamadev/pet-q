// スレッド
export interface Thread {
  id: string;
  title: string;
  content: string;
  category_id: string;
  sub_category_id: string;
  image_urls?: string[];
  user_ip?: string;
  created_at: Date;
  updated_at: Date;
  response_count: number;
  last_response_at?: Date;
}

// レス
export interface Response {
  id: string;
  thread_id: string;
  content: string;
  image_urls?: string[];
  anchor_to?: string;
  user_ip?: string;
  created_at: Date;
}

// カテゴリ
export interface Category {
  id: string;
  name: string;
  type: "main" | "sub";
  parent_id?: string;
  display_order: number;
}

// お知らせ
export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  revisedAt: string;
}
