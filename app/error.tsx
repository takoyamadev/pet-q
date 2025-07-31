'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center animate-fade-in">
        <div className="space-y-6">
          <div className="text-error">
            <AlertTriangle size={64} className="mx-auto" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">エラーが発生しました</h1>
            <p className="text-muted-foreground">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
          </div>
          <Button 
            onClick={reset}
            className="flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={20} />
            再試行
          </Button>
        </div>
      </Card>
    </div>
  )
}