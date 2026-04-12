'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Lead {
  id: string
  name: string
  whatsapp: string
  platform: string
  source: string
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

  function exportCSV() {
    window.open('/api/leads/export', '_blank')
  }

  const filtered = leads.filter((l) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.name.toLowerCase().includes(q) ||
      l.whatsapp.includes(q) ||
      l.platform.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-zinc-400 mt-1">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} captado{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, WhatsApp ou plataforma..."
          className="input-field max-w-sm"
        />
      </div>

      <div className="card-glass overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum lead encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Nome', 'WhatsApp', 'Plataforma', 'Fonte', 'Data'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-zinc-200">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://wa.me/${lead.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{lead.platform}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md border border-zinc-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
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
