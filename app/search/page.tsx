import { searchThreads } from '@/lib/api/threads'
import { ThreadList } from '@/components/thread/ThreadList'
import { Card } from '@/components/ui/Card'
import { Search } from 'lucide-react'

export const metadata = {
  title: '検索結果 | PetQ（ペットキュー）',
  description: 'スレッドの検索結果を表示します',
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, category?: string }>
}) {
  const { q: query, category: categoryId } = await searchParams
  
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            検索キーワードを入力してください
          </p>
        </Card>
      </div>
    )
  }
  
  const threads = await searchThreads(query, categoryId)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          「{query}」の検索結果
        </h1>
        <p className="text-muted-foreground">
          {threads.length}件のスレッドが見つかりました
        </p>
      </div>
      
      <ThreadList threads={threads} />
    </div>
  )
}