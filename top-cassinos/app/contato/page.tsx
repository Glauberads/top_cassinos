'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Dices,
  Send,
} from 'lucide-react'
import { getWhatsappUrl } from '@/lib/utils'
import type { Platform } from '@/lib/types'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .regex(/^\d+$/, 'Apenas números'),
  platform: z.string().min(1, 'Selecione uma plataforma de interesse'),
  source: z.string().default('contato-page'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContatoPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch('/api/platforms')
      .then((r) => r.json())
      .then((data: Platform[]) => setPlatforms(data))
      .catch(console.error)

    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(console.error)
  }, [])

  const siteName = settings?.siteName || 'Top Cassinos'
  const brandFirst = siteName.split(' ')[0] || 'Top'
  const brandRest = siteName.split(' ').slice(1).join(' ') || 'Cassinos'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema) as never,
    defaultValues: { source: 'contato-page' },
  })

  async function onSubmit(data: ContactForm) {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSuccess(true)
      reset()
      setTimeout(() => {
        window.open(
          getWhatsappUrl(`Olá! Vim pelo ${siteName}`),
          '_blank'
        )
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={siteName} className="h-7 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <Dices className="w-4 h-4 text-zinc-950" />
                  </div>
                  <span className="font-bold text-white">
                    {brandFirst}<span className="text-primary">{brandRest}</span>
                  </span>
                </>
              )}
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-3">
            Entre em <span className="gradient-text">contato</span>
          </h1>
          <p className="text-zinc-400">
            Preencha o formulário e nossa equipe entrará em contato pelo WhatsApp.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass p-8"
        >
          {success ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                Mensagem enviada!
              </h2>
              <p className="text-zinc-400 mb-6">
                Em breve você será redirecionado para o WhatsApp...
              </p>
              <a
                href={getWhatsappUrl('Olá, vim pelo Top Cassinos!')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp agora
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-5">
              <div>
                <label className="label">Seu nome *</label>
                <input
                  {...register('name')}
                  className="input-field"
                  placeholder="João Silva"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="label">WhatsApp (somente números) *</label>
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

              <div>
                <label className="label">Plataforma de interesse *</label>
                <select {...register('platform')} className="input-field">
                  <option value="">Selecione...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Não sei ainda">Não sei ainda / Outros</option>
                </select>
                {errors.platform && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.platform.message}
                  </p>
                )}
              </div>

              <input type="hidden" {...register('source')} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
              </button>

              <p className="text-zinc-600 text-xs text-center">
                Após o envio, você será redirecionado para o nosso WhatsApp.
              </p>
            </form>
          )}
        </motion.div>

        {/* Direct WA link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-zinc-500 text-sm mb-3">Prefere falar direto?</p>
          <a
            href={getWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            +55 22 99215-7330
          </a>
        </motion.div>
      </div>
    </div>
  )
}
