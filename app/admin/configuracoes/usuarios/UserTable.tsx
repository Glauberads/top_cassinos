'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Trash2, 
  ShieldCheck, 
  User as UserIcon,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { updateUserRole, deleteUser } from '@/app/actions/user'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface UserTableProps {
  users: User[]
  currentUserId: string
}

export function UserTable({ users, currentUserId }: UserTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpdateRole = async (userId: string, newRole: 'ADMIN' | 'USER') => {
    setLoading(userId)
    setError(null)
    setSuccess(null)
    
    const result = await updateUserRole(userId, newRole)
    setLoading(null)

    if (result.success) {
      setSuccess(`Nível de acesso alterado para ${newRole}`)
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Falha ao atualizar nível')
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return
    }

    setLoading(userId)
    setError(null)
    setSuccess(null)

    const result = await deleteUser(userId)
    setLoading(null)

    if (result.success) {
      setSuccess('Usuário excluído permanentemente')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Falha ao excluir usuário')
      setTimeout(() => setError(null), 5000)
    }
  }

  return (
    <div className="overflow-x-auto">
      {/* Mensagens de Status */}
      {(success || error) && (
        <div className="px-6 py-4 animate-in fade-in slide-in-from-top-4">
          <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium
            ${success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
          >
            {success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {success || error}
          </div>
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-900/50 border-b border-zinc-800">
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Usuário</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Permissão</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cadastrado em</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      {user.name}
                      {user.id === currentUserId && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-700 font-normal">VOCÊ</span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="relative inline-block w-32 group">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value as 'ADMIN' | 'USER')}
                    disabled={loading === user.id}
                    className={`appearance-none w-full px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer outline-none pl-8
                      ${user.role === 'ADMIN' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                      }`}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {user.role === 'ADMIN' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </div>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {loading === user.id ? (
                      <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-zinc-500" />
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-zinc-400">
                  {format(new Date(user.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={loading === user.id || user.id === currentUserId}
                  className={`p-2 rounded-lg transition-all
                    ${user.id === currentUserId 
                      ? 'text-zinc-700 cursor-not-allowed' 
                      : 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                  title={user.id === currentUserId ? "Não é possível excluir sua própria conta" : "Excluir usuário"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="p-12 text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-zinc-800/50 items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-zinc-500">Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  )
}
