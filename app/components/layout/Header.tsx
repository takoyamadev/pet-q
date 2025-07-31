'use client'

import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">PetQ</span>
            <span className="text-sm text-muted-foreground">ペットキュー</span>
          </Link>

          {/* 検索バー（デスクトップ） */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="スレッドを検索..."
                className="w-full px-4 py-2 pr-10 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/threads/new" className="text-foreground hover:text-primary transition-colors">
              スレッド作成
            </Link>
            <Link href="/announcements" className="text-foreground hover:text-primary transition-colors">
              お知らせ
            </Link>
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="スレッドを検索..."
                  className="w-full px-4 py-2 pr-10 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            <nav className="space-y-2">
              <Link 
                href="/threads/new" 
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                スレッド作成
              </Link>
              <Link 
                href="/announcements" 
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                お知らせ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}