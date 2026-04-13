'use client'

import { useEffect, useState, use } from 'react'
import { 
  ArrowLeft, 
  Loader2, 
  BarChart3, 
  Eye, 
  MousePointer2, 
  TrendingUp,
  Package,
  ExternalLink,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { getCategoryStats } from '@/app/actions/categories'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCategoryStats(id).then(result => {
      if (result.success) setData(result.data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-zinc-500 font-medium">Carregando métricas de BI...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-white text-xl">Categoria não encontrada.</h1>
        <Link href="/admin/categorias" className="text-amber-500 hover:underline mt-4 inline-block">
          Voltar para categorias
        </Link>
      </div>
    )
  }

  const filteredPlatforms = data.platforms.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/categorias"
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            {data.name}
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] uppercase tracking-widest rounded-md">
              BI Dashboard
            </span>
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Estatísticas detalhadas e performance da categoria
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          label="Total de Produtos" 
          value={data.totalProducts} 
          icon={Package} 
          color="amber"
        />
        <MetricCard 
          label="Soma de Views" 
          value={data.totalViews.toLocaleString()} 
          icon={Eye} 
          color="blue"
        />
        <MetricCard 
          label="Cliques Externos" 
          value={data.totalClicks.toLocaleString()} 
          icon={MousePointer2} 
          color="green"
        />
        <MetricCard 
          label="Conversão Média" 
          value={`${data.conversionRate}%`} 
          icon={TrendingUp} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Section */}
        <div className="lg:col-span-2 card-glass p-6 min-h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Top 5 Produtos por Acesso
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topPlatforms}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Bar 
                  dataKey="views" 
                  fill="#fbbf24" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {data.topPlatforms.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.15)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Table / Side List */}
        <div className="card-glass overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Lista de Auditoria</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 text-xs py-2"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px] divide-y divide-zinc-800">
            {filteredPlatforms.map((platform: any) => (
              <div key={platform.id} className="p-4 hover:bg-zinc-800/30 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">{platform.name}</h4>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {platform.views}</span>
                    <span className="flex items-center gap-1"><MousePointer2 className="w-3 h-3" /> {platform.externalClicks}</span>
                  </p>
                </div>
                <Link 
                  href={`/plataforma/${platform.id}`} 
                  target="_blank"
                  className="p-2 text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
            {filteredPlatforms.length === 0 && (
              <div className="p-8 text-center text-zinc-600 text-xs italic">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 mt-auto">
            <Link 
              href="/admin/plataformas" 
              className="text-[10px] uppercase tracking-widest font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 justify-center"
            >
              Gerenciar todos os produtos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, color }: any) {
  const colorMap: any = {
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  }

  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg border", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}
