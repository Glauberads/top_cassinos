import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const WHATSAPP_NUMBER = '5522992157330'

export function getWhatsappUrl(message?: string) {
  const text = message
    ? encodeURIComponent(message)
    : encodeURIComponent('Olá! venho atraves do site Plataformas Top')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export const CATEGORY_LABELS: Record<string, string> = {
  cassino: 'Cassino',
  casual: 'Casual',
  esporte: 'Esporte',
  lootbox: 'Lootbox',
}

export const CATEGORY_COLORS: Record<string, string> = {
  cassino: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  casual: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  esporte: 'bg-green-500/20 text-green-400 border-green-500/30',
  lootbox: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num)
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function leadsToCSV(
  leads: Array<{
    id: string
    name: string
    whatsapp: string
    platform?: string | null
    source?: string | null
    status?: string | null
    origin?: string | null
    createdAt: Date
  }>
): string {
  const headers = ['ID', 'Nome', 'WhatsApp', 'Plataforma', 'Fonte', 'Status', 'Origem', 'Data']
  const escape = (val: string | null | undefined) => {
    const s = String(val || '').replace(/"/g, '""')
    return `"${s}"`
  }

  const rows = leads.map((lead) => [
    escape(lead.id),
    escape(lead.name),
    escape(lead.whatsapp),
    escape(lead.platform),
    escape(lead.source),
    escape(lead.status || 'Pendente'),
    escape(lead.origin || 'Home'),
    escape(formatDate(lead.createdAt)),
  ])
  return [headers.map(h => `"${h}"`), ...rows].map((row) => row.join(',')).join('\n')
}

export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim()).filter(Boolean)
}

export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Basic conversion to HSL components for tailwind compatibility
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  // Rounding for cleaner variables
  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`
}
