'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWhatsappUrl } from '@/lib/utils'
import { createLead } from '@/app/actions/leads'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .regex(/^\d+$/, 'Apenas números'),
  platform: z.string().min(1, 'Selecione uma plataforma'),
  source: z.string().default('plataforma-page'),
})

type LeadForm = z.infer<typeof leadSchema>

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  platformName: string
}

export function LeadModal({ isOpen, onClose, platformName }: LeadModalProps) {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema) as never,
    defaultValues: {
      platform: platformName,
      source: 'plataforma-page',
    },
  })

  async function onSubmit(data: LeadForm) {
    const result = await createLead({
      name: data.name,
      whatsapp: data.whatsapp,
      platform: data.platform,
      source: data.source,
      origin: 'Plataforma Page'
    })
    
    if (result.success) {
      setSuccess(true)
      reset()
      setTimeout(() => {
        window.open(
          getWhatsappUrl(
            `Olá! Vim pelo Top Cassinos e tenho interesse na plataforma ${platformName}`
          ),
          '_blank'
        )
        onClose()
        setSuccess(false)
      }, 1500)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Quero esta plataforma!
                  </h2>
                  <p className="text-zinc-400 text-sm mt-0.5">{platformName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {success ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Interesse registrado!
                    </h3>
                    <p className="text-zinc-400">
                      Redirecionando para o WhatsApp...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
                    <div>
                      <label className="label">Seu nome</label>
                      <input
                        {...register('name')}
                        className="input-field"
                        placeholder="João Silva"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">WhatsApp (somente números)</label>
                      <input
                        {...register('whatsapp')}
                        className="input-field"
                        placeholder="5511999999999"
                      />
                      {errors.whatsapp && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.whatsapp.message}
                        </p>
                      )}
                    </div>

                    <input type="hidden" {...register('platform')} />
                    <input type="hidden" {...register('source')} />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center py-3 mt-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MessageCircle className="w-5 h-5" />
                      )}
                      {isSubmitting ? 'Enviando...' : 'Continuar no WhatsApp'}
                    </button>

                    <p className="text-zinc-500 text-xs text-center">
                      Ao continuar, você será redirecionado para o WhatsApp do
                      nosso especialista.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
