'use client'

import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'todos', label: 'Todos' },
  { value: 'cassino', label: 'Cassino' },
  { value: 'casual', label: 'Casual' },
  { value: 'esporte', label: 'Esporte' },
  { value: 'lootbox', label: 'Lootbox' },
]

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
  icons?: Record<string, React.ComponentType<{ className?: string }>>
}

export function CategoryFilter({ value, onChange, icons }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const Icon = icons?.[cat.value]
        const isActive = value === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
              isActive
                ? 'bg-primary text-zinc-950 border-primary shadow-lg shadow-primary/20'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-primary/50 hover:text-primary'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
