'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MessageCircle, X, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createLead } from '@/app/actions/leads'
import { useToast } from './ToastProvider'
import { cn } from '@/lib/utils'

interface WhatsAppFloatingButtonProps {
  origin?: string
  whatsappNumber?: string
}

export function WhatsAppFloatingButton({ 
  origin = 'Home', 
  whatsappNumber = '5522992157330' 
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const { toast } = useToast()

  // Máscara de telefone brasileiro: (99) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1')
    }
    
    setPhone(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const rawPhone = phone.replace(/\D/g, '')
    
    if (name.length < 2) {
      toast({ type: 'error', title: 'Erro', description: 'Por favor, insira seu nome completo.' })
      setLoading(false)
      return
    }

    if (rawPhone.length < 10) {
      toast({ type: 'error', title: 'Erro', description: 'Por favor, insira um número de WhatsApp válido.' })
      setLoading(false)
      return
    }

    const result = await createLead({
      name,
      whatsapp: rawPhone,
      origin: origin
    })

    if (result.success) {
      toast({ type: 'success', title: 'Sucesso!', description: 'Iniciando conversa no WhatsApp...' })
      
      // Pequeno delay para o toast ser lido
      setTimeout(() => {
        const message = `Olá, me chamo ${name}, gostaria de suporte.`
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
        setIsOpen(false)
        setLoading(false)
        setName('')
        setPhone('')
      }, 1000)
    } else {
      toast({ type: 'error', title: 'Erro', description: result.error || 'Ocorreu um erro ao salvar seu contato.' })
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 glow-green"
            aria-label="Suporte via WhatsApp"
          >
            {/* Efeito de Pulso (Ping) */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-20" />
            
            <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" />
          </button>
        </Dialog.Trigger>

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
                  className="fixed left-[50%] top-[50%] z-[101] w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none"
                >
                  <div className="card-glass overflow-hidden border border-zinc-700/50 bg-zinc-900/90 shadow-2xl">
                    {/* Header */}
                    <div className="relative border-b border-zinc-800 p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                        <MessageCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        Inicie seu suporte
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-zinc-400">
                        Preencha os dados abaixo para falar agora mesmo com nosso time no WhatsApp.
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
                          Seu Nome
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: João Silva"
                          className="input-field"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          WhatsApp
                        </label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="(99) 99999-9999"
                          className="input-field"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center py-4 text-base font-bold shadow-lg shadow-amber-500/10"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-5 w-5" />
                        )}
                        {loading ? 'Processando...' : 'Iniciar Conversa'}
                      </button>

                      <p className="text-center text-[10px] text-zinc-500">
                        Ao clicar em "Iniciar Conversa", você concorda com nossos termos de privacidade.
                      </p>
                    </form>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <style jsx global>{`
        .glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  )
}
