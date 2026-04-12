import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { Users as UsersIcon } from 'lucide-react'
import { UserTable } from './UserTable'

export const metadata = {
  title: 'Gestão de Usuários | Admin',
}

export default async function UsuariosPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/403')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Converter datas para JSON serializável
  const serializedUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }))

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Gestão de Usuários</h1>
            <p className="text-zinc-400">Total de {users.length} usuários cadastrados no sistema.</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <UserTable users={serializedUsers} currentUserId={session.user.id} />
      </div>
    </div>
  )
}
