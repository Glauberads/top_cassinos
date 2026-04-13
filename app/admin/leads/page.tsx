'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, Users, CheckCircle2, Clock } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { updateLeadStatus } from '@/app/actions/leads'

interface Lead {
  id: string
  name: string
  whatsapp: string
  platform: string | null
  source: string | null
  status: string
  origin: string
  createdAt: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((data: Lead[]) => {
        setLeads(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'Pendente' ? 'Concluído' : 'Pendente'
    
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
    
    const result = await updateLeadStatus(id, newStatus)
    if (!result.success) {
      // Rollback on error
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: currentStatus } : l))
    }
  }

  function exportCSV() {
    window.open('/api/leads/export', '_blank')
  }

  const filtered = leads.filter((l) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.name.toLowerCase().includes(q) ||
      l.whatsapp.includes(q) ||
      (l.platform?.toLowerCase() || '').includes(q) ||
      (l.origin?.toLowerCase() || '').includes(q) ||
      (l.status?.toLowerCase() || '').includes(q)
    )
  })

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-zinc-400 mt-1">
            Total de <span className="text-amber-500 font-semibold">{leads.length}</span> contatos captados
          </p>
        </div>
        <button 
          onClick={exportCSV} 
          className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-amber-500/10"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, WhatsApp, origem ou status..."
            className="input-field pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Users className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="card-glass overflow-hidden border border-zinc-800/50">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/20">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
              <Users className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-zinc-300 font-medium">Nenhum lead encontrado</h3>
            <p className="text-zinc-500 text-sm mt-1">Tente ajustar seus termos de busca.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40">
                  {['Nome', 'WhatsApp', 'Interesse / Origem', 'Status', 'Data'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-800/40 transition-all duration-200">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0 shadow-inner">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-100">{lead.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">ID: {lead.id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <a
                        href={`https://wa.me/${lead.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-green-400 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse group-hover:block" />
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-zinc-200">
                          {lead.platform || 'Suporte Geral'}
                        </span>
                        <span className="text-[11px] text-zinc-500 bg-zinc-800/50 w-fit px-2 py-0.5 rounded border border-zinc-700/30">
                          Origem: {lead.origin || lead.source || 'Site'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => toggleStatus(lead.id, lead.status || 'Pendente')}
                        className="flex items-center group/status"
                        title="Clique para alterar o status"
                      >
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all hover:scale-105 active:scale-95",
                          lead.status === 'Pendente' 
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]" 
                            : "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]"
                        )}>
                          {lead.status === 'Pendente' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {lead.status || 'Pendente'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-500 font-medium">
                      {formatDate(lead.createdAt)}
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
