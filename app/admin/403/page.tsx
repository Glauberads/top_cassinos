import Link from 'next/link'
import { ShieldAlert, Home } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">403: Acesso Negado</h1>
          <p className="text-zinc-400">
            Você não tem permissão para acessar esta área. Esta seção é reservada apenas para administradores.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  )
}
