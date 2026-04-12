'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react'
import { cn, CATEGORY_LABELS, CATEGORY_COLORS, formatDate } from '@/lib/utils'
import type { Platform } from '@prisma/client'

export default function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchPlatforms = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/platforms?active=false')
    const data: Platform[] = await res.json()
    setPlatforms(data)
    setLoading(false)
  }, [])

  useEffect(() => { void fetchPlatforms() }, [fetchPlatforms])

  async function toggleActive(platform: Platform) {
    setToggling(platform.id)
    await fetch(`/api/platforms/${platform.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !platform.isActive }),
    })
    await fetchPlatforms()
    setToggling(null)
  }

  async function deletePlatform(id: string, name: string) {
    if (!confirm(`Excluir a plataforma "${name}"? Esta ação não pode ser desfeita.`)) return
    await fetch(`/api/platforms/${id}`, { method: 'DELETE' })
    await fetchPlatforms()
  }

  const filtered = platforms.filter((p) => {
    const matchCat = category === 'todos' || p.category === category
    const q = search.toLowerCase()
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const CATEGORIES = ['todos', 'cassino', 'casual', 'esporte', 'lootbox']

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Plataformas</h1>
          <p className="text-zinc-400 mt-1">
            {platforms.length} plataforma{platforms.length !== 1 ? 's' : ''} cadastrada{platforms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/plataformas/nova" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nova plataforma
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar plataformas..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
                category === cat
                  ? 'bg-amber-500 text-zinc-950 border-amber-500'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-amber-500/50'
              )}
            >
              {cat === 'todos' ? 'Todos' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="card-glass overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            Nenhuma plataforma encontrada
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((platform) => (
                  <tr key={platform.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-zinc-100">
                          {platform.name}
                          {platform.featured && (
                            <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-md border border-amber-500/30">
                              Destaque
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">{platform.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'badge',
                          CATEGORY_COLORS[platform.category] ??
                            'bg-zinc-800 text-zinc-400 border-zinc-700'
                        )}
                      >
                        {CATEGORY_LABELS[platform.category] ?? platform.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {platform.views}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(platform)}
                        disabled={toggling === platform.id}
                        className="flex items-center gap-2 transition-colors"
                        title={platform.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {toggling === platform.id ? (
                          <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                        ) : platform.isActive ? (
                          <ToggleRight className="w-6 h-6 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-zinc-600" />
                        )}
                        <span className={cn(
                          'text-xs font-medium',
                          platform.isActive ? 'text-green-400' : 'text-zinc-500'
                        )}>
                          {platform.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {formatDate(platform.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/plataforma/${platform.slug}`}
                          target="_blank"
                          className="btn-ghost p-2 text-xs"
                          title="Ver demo"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/plataformas/${platform.id}`}
                          className="btn-ghost p-2 text-xs"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deletePlatform(platform.id, platform.name)}
                          className="btn-ghost p-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
