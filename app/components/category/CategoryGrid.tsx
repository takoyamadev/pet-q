import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Dog, Cat, Bird, Fish, Rabbit, HelpCircle } from 'lucide-react'
import type { Category } from '@/types'

interface CategoryGridProps {
  categories: Category[]
}

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  '犬': Dog,
  '猫': Cat,
  '鳥': Bird,
  '爬虫類': Fish, // 爬虫類用のアイコンがないため代替
  '小動物': Rabbit,
  'その他': HelpCircle,
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((category, index) => {
        const Icon = categoryIcons[category.name] || HelpCircle
        
        return (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card 
              className="hover:border-primary hover:shadow-lg transition-all duration-300 h-full animate-fade-in hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 bg-primary/10 rounded-full transition-all duration-300 hover:bg-primary/20">
                  <Icon size={32} className="text-primary transition-transform duration-300 hover:scale-110" />
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}