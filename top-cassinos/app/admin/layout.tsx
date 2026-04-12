import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar
        adminName={session.user?.name}
        adminEmail={session.user?.email}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
