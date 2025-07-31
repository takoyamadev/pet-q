import { Card } from '@/components/ui/Card'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        {/* スケルトンローダー */}
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}