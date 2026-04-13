'use client'

import { useEffect, useState } from 'react'
import { Plus, LayoutGrid, Search, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getCategories } from '@/app/actions/categories'
import { CategoryFormModal } from '@/components/CategoryFormModal'
import { motion } from 'framer-motion'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getCategories()
      if (result.success) {
        setCategories(result.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categorias</h1>
          <p className="text-zinc-400 mt-1">
            Gerencie as categorias de sistemas e monitore a performance
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categorias..."
            className="input-field pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-zinc-800/50">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
            <LayoutGrid className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-zinc-300 font-medium">Nenhuma categoria encontrada</h3>
          <p className="text-zinc-500 text-sm mt-1">Clique no botão acima para criar sua primeira categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/admin/categorias/${category.id}`}>
                <div className="card-glass p-6 group cursor-pointer hover:border-amber-500/50 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                      <LayoutGrid className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="px-3 py-1 bg-zinc-800 rounded-lg border border-zinc-700 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {category._count.platforms} {category._count.platforms === 1 ? 'Produto' : 'Produtos'}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 min-h-[40px]">
                    {category.description || 'Sem descrição definida.'}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between text-zinc-400 group-hover:text-white transition-colors">
                    <span className="text-xs font-medium">Ver estatísticas</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}
