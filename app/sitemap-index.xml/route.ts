import { createClient } from "@/lib/supabase/server";

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1時間キャッシュ

const THREADS_PER_SITEMAP = 1000;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev";
  const supabase = await createClient();
  
  // スレッドの総数を取得
  const { count, error } = await supabase
    .from("threads")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error counting threads:", error);
    return new Response("Error generating sitemap index", { status: 500 });
  }

  const totalThreads = count || 0;
  const totalPages = Math.ceil(totalThreads / THREADS_PER_SITEMAP);

  // XMLサイトマップインデックスを生成
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
${Array.from({ length: totalPages }, (_, i) => `  <sitemap>
    <loc>${baseUrl}/sitemap-threads-${i + 1}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}