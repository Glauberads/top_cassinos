'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createCategory } from '@/app/actions/categories'
import { useToast } from './ToastProvider'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CategoryFormModal({ isOpen, onClose, onSuccess }: CategoryFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({ type: 'error', title: 'Erro', description: 'O nome da categoria é obrigatório.' })
      return
    }

    setLoading(true)

    const result = await createCategory({
      name: name.trim(),
      description: description.trim()
    })

    if (result.success) {
      toast({ type: 'success', title: 'Sucesso!', description: 'Categoria criada com sucesso.' })
      setName('')
      setDescription('')
      onSuccess()
      onClose()
    } else {
      toast({ type: 'error', title: 'Erro', description: result.error || 'Falha ao criar categoria.' })
    }

    setLoading(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-zinc-950/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed left-[50%] top-[50%] z-[101] w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none"
              >
                <div className="card-glass overflow-hidden border border-zinc-700/50 bg-zinc-900/90 shadow-2xl">
                  {/* Header */}
                  <div className="relative border-b border-zinc-800 p-6">
                    <Dialog.Title className="text-xl font-bold text-white">
                      Nova Categoria
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-zinc-400">
                      Crie uma nova categoria para agrupar suas plataformas.
                    </Dialog.Description>
                    <Dialog.Close asChild>
                      <button className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Nome da Categoria
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Cassinos VIP"
                        className="input-field"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Descrição (opcional)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o propósito desta categoria..."
                        className="input-field resize-none min-h-[100px]"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary flex-1 justify-center py-3"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 justify-center py-3 text-base font-bold shadow-lg shadow-amber-500/10"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-5 w-5" />
                        )}
                        {loading ? 'Criando...' : 'Criar Categoria'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
