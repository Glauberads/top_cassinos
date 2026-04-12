'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { UserPlus, X, Loader2, User, ShieldCheck } from 'lucide-react'
import { adminCreateUser } from '@/app/actions/user'
import { useToast } from '@/components/ToastProvider'
import { cn } from '@/lib/utils'

export function AddUserModal() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [role, setRole] = React.useState<'ADMIN' | 'USER'>('USER')
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: role
    }

    try {
      const result = await adminCreateUser(data)
      
      if (result.success) {
        toast({
          title: 'Usuário criado!',
          description: `O acesso para ${data.name} foi configurado com sucesso.`,
          type: 'success'
        })
        setOpen(false)
        setRole('USER')
      } else {
        toast({
          title: 'Erro ao criar usuário',
          description: result.error || 'Ocorreu um erro inesperado.',
          type: 'error'
        })
      }
    } catch (error) {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível se comunicar com o servidor.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn-primary">
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-800 bg-zinc-950 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
          
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-500" />
              </div>
              Cadastrar Novo Usuário
            </Dialog.Title>
            <Dialog.Description className="text-zinc-400 text-sm">
              Preencha os dados abaixo para criar uma nova conta de acesso manualmente.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="label">Nome Completo</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="input-field" 
                placeholder="Ex: João Silva"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="label">E-mail</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="input-field" 
                placeholder="joao@exemplo.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="label">Senha Inicial</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="input-field" 
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="label">Nível de Acesso</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  disabled={loading}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-semibold",
                    role === 'USER' 
                      ? "bg-zinc-800 border-zinc-600 text-white" 
                      : "bg-transparent border-zinc-800 text-zinc-500 hover:bg-zinc-900"
                  )}
                >
                  <User className="w-4 h-4" />
                  USER
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  disabled={loading}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-semibold",
                    role === 'ADMIN' 
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                      : "bg-transparent border-zinc-800 text-zinc-500 hover:bg-zinc-900"
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                  ADMIN
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
              <Dialog.Close asChild>
                <button type="button" className="btn-secondary justify-center py-2.5" disabled={loading}>
                  Cancelar
                </button>
              </Dialog.Close>
              <button type="submit" className="btn-primary justify-center py-2.5 min-w-[120px]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 outline-none">
            <X className="h-4 w-4 text-zinc-400" />
            <span className="sr-only">Fechar</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
