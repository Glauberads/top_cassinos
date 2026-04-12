import { prisma } from '@/lib/db'
import { Monitor, Users, Eye, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

async function getDashboardData() {
  const [totalPlatforms, activePlatforms, totalLeads, leadsToday, totalViews] =
    await Promise.all([
      prisma.platform.count(),
      prisma.platform.count({ where: { isActive: true } }),
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.platform.aggregate({ _sum: { views: true } }),
    ])

  return {
    totalPlatforms,
    activePlatforms,
    totalLeads,
    leadsToday,
    totalViews: totalViews._sum.views ?? 0,
  }
}

const STAT_CARDS = (data: Awaited<ReturnType<typeof getDashboardData>>) => [
  {
    label: 'Total de Plataformas',
    value: formatNumber(data.totalPlatforms),
    icon: Monitor,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    label: 'Plataformas Ativas',
    value: formatNumber(data.activePlatforms),
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    label: 'Leads Hoje',
    value: formatNumber(data.leadsToday),
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    label: 'Views Totais',
    value: formatNumber(data.totalViews),
    icon: Eye,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
]

export default async function AdminDashboard() {
  const data = await getDashboardData()
  const stats = STAT_CARDS(data)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Visão geral da sua plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`card-glass p-6 border ${stat.border}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-sm">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Leads recentes */}
      <RecentLeads />
    </div>
  )
}

async function RecentLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="card-glass p-6">
      <h2 className="text-lg font-bold text-white mb-4">Leads Recentes</h2>
      {leads.length === 0 ? (
        <p className="text-zinc-500 text-sm">Nenhum lead registrado ainda.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-200">{lead.name}</div>
                <div className="text-xs text-zinc-500">{lead.platform}</div>
              </div>
              <div className="text-xs text-zinc-500 shrink-0">
                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
