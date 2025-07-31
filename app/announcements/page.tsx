import { getAnnouncements } from '@/lib/microcms/client'
import { Card } from '@/components/ui/Card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export const metadata = {
  title: 'お知らせ | PetQ（ペットキュー）',
  description: 'PetQからのお知らせ一覧です',
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements(20)
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">お知らせ</h1>
      
      {announcements.length === 0 ? (
        <Card>
          <p className="text-center text-muted-foreground py-8">
            お知らせはありません
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Link key={announcement.id} href={`/announcements/${announcement.id}`}>
              <Card className="hover:border-primary transition-colors">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{announcement.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <time>
                      {format(new Date(announcement.publishedAt), 'yyyy年MM月dd日', { locale: ja })}
                    </time>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}