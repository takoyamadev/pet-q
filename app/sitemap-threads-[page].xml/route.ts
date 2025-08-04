import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1時間キャッシュ

const THREADS_PER_SITEMAP = 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return new Response("Invalid page number", { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev";
  const supabase = await createClient();
  
  // ページングでスレッドを取得
  const offset = (pageNum - 1) * THREADS_PER_SITEMAP;
  
  const { data: threads, error } = await supabase
    .from("threads")
    .select("id, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + THREADS_PER_SITEMAP - 1);

  if (error || !threads || threads.length === 0) {
    return new Response("No threads found", { status: 404 });
  }

  // XML生成
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${threads.map(thread => `  <url>
    <loc>${baseUrl}/thread/${thread.id}</loc>
    <lastmod>${new Date(thread.updated_at || thread.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}