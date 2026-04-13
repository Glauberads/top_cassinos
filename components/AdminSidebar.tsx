'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Monitor,
  Users,
  Settings,
  LogOut,
  Dices,
  ChevronRight,
  Shield,
  LayoutGrid,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Plataformas',
    href: '/admin/plataformas',
    icon: Monitor,
  },
  {
    label: 'Categorias',
    href: '/admin/categorias',
    icon: LayoutGrid,
  },
  {
    label: 'Leads',
    href: '/admin/leads',
    icon: Users,
  },
  {
    label: 'Usuários',
    href: '/admin/configuracoes/usuarios',
    icon: Shield,
  },
  {
    label: 'Configurações',
    href: '/admin/configuracoes',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  adminName?: string | null
  adminEmail?: string | null
}

export function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
            <Dices className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">
              Top<span className="text-amber-500">Cassinos</span>
            </div>
            <div className="text-[10px] text-zinc-500">Painel Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                )}
              >
                <item.icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
                  )}
                />
                {item.label}
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto text-amber-400" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold">
            {adminName?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-200 truncate">
              {adminName ?? 'Admin'}
            </div>
            <div className="text-xs text-zinc-500 truncate">{adminEmail}</div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
