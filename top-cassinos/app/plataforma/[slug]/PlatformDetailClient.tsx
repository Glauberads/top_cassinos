'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Eye,
  MessageCircle,
  User,
  Lock,
  CheckCheck,
  Dices,
  Star,
} from 'lucide-react'
import { IframeViewer } from '@/components/IframeViewer'
import { LeadModal } from '@/components/LeadModal'
import { cn, CATEGORY_LABELS, CATEGORY_COLORS, getWhatsappUrl, parseTags } from '@/lib/utils'
import type { Platform } from '@/lib/types'

interface PlatformDetailClientProps {
  platform: Platform
}

export function PlatformDetailClient({ platform }: PlatformDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client')
  const [copied, setCopied] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [views, setViews] = useState(platform.views)
  const [settings, setSettings] = useState<any>(null)

  const currentUrl =
    activeTab === 'client' ? platform.clientUrl : platform.adminUrl

  useEffect(() => {
    fetch(`/api/platforms/${platform.id}/view`, { method: 'POST' })
      .then((r) => r.json())
      .then((data: { views: number }) => setViews(data.views))
      .catch(console.error)

    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(console.error)
  }, [platform.id])

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const categoryColor =
    CATEGORY_COLORS[platform.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'

  const siteName = settings?.siteName || 'Top Cassinos'
  const brandFirst = siteName.split(' ')[0] || 'Top'
  const brandRest = siteName.split(' ').slice(1).join(' ') || 'Cassinos'

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar ao catálogo</span>
            </Link>

            <div className="flex items-center gap-2">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={siteName} className="h-7 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <Dices className="w-4 h-4 text-zinc-950" />
                  </div>
                  <span className="font-bold text-white hidden sm:block">
                    {brandFirst}<span className="text-primary">{brandRest}</span>
                  </span>
                </>
              )}
            </div>

            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2 px-3"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:block">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">

            {/* INFO DA PLATAFORMA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass overflow-hidden"
            >
              <div className="relative h-64 sm:h-80">
                <Image
                  src={platform.bannerUrl}
                  alt={`Banner ${platform.name}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={cn('badge', categoryColor)}>
                      {CATEGORY_LABELS[platform.category]}
                    </span>
                    {platform.featured && (
                      <span className="badge bg-amber-500/90 text-zinc-950 border-amber-400">
                        <Star className="w-3 h-3" />
                        Destaque
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {platform.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-zinc-400 text-sm">
                    <Eye className="w-4 h-4" />
                    {views} visualizações
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-zinc-300 leading-relaxed">
                  {platform.description}
                </p>

                {parseTags(platform.tags).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {parseTags(platform.tags).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs border border-zinc-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* PREVIEW IFRAME */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-glass p-6"
            >
              {/* TABS */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex p-1 bg-zinc-800 rounded-xl">
                  <button
                    onClick={() => setActiveTab('client')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      activeTab === 'client'
                        ? 'bg-amber-500 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    Cliente
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      activeTab === 'admin'
                        ? 'bg-amber-500 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    Admin
                  </button>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => copyToClipboard(currentUrl, 'url')}
                    className="btn-ghost text-sm py-2"
                    title="Copiar link"
                  >
                    {copied === 'url' ? (
                      <CheckCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="hidden sm:block">
                      {copied === 'url' ? 'Copiado!' : 'Copiar'}
                    </span>
                  </button>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm py-2"
                    title="Abrir em nova aba"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:block">Abrir</span>
                  </a>
                </div>
              </div>

              <IframeViewer url={currentUrl} title={platform.name} />
            </motion.div>

            {/* INSTRUÇÕES */}
            {platform.instructions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-glass p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">
                  📋 Instruções de uso
                </h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed font-sans">
                    {platform.instructions}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>

          {/* SIDEBAR DIREITA */}
          <div className="space-y-4">

            {/* CREDENCIAIS ADMIN */}
            {(platform.adminLogin ?? platform.adminPassword) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-glass p-6"
              >
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Acesso Admin
                </h2>
                <div className="space-y-3">
                  {platform.adminLogin && (
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Login</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-zinc-800 rounded-lg text-zinc-300 text-sm flex items-center gap-2 border border-zinc-700">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          {platform.adminLogin}
                        </div>
                        <button
                          onClick={() => copyToClipboard(platform.adminLogin!, 'login')}
                          className="p-2 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Copiar login"
                        >
                          {copied === 'login' ? (
                            <CheckCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {platform.adminPassword && (
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Senha</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-zinc-800 rounded-lg text-zinc-300 text-sm flex items-center gap-2 border border-zinc-700">
                          <Lock className="w-3.5 h-3.5 text-zinc-500" />
                          {platform.adminPassword}
                        </div>
                        <button
                          onClick={() => copyToClipboard(platform.adminPassword!, 'pass')}
                          className="p-2 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Copiar senha"
                        >
                          {copied === 'pass' ? (
                            <CheckCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* LINKS RÁPIDOS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card-glass p-6"
            >
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-400" />
                Links
              </h2>
              <div className="space-y-2">
                <a
                  href={platform.clientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 rounded-lg text-zinc-300 text-sm transition-all group"
                >
                  <Eye className="w-4 h-4 text-zinc-500 group-hover:text-amber-400" />
                  <span className="flex-1 truncate">Área do cliente</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
                <a
                  href={platform.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 rounded-lg text-zinc-300 text-sm transition-all group"
                >
                  <Lock className="w-4 h-4 text-zinc-500 group-hover:text-amber-400" />
                  <span className="flex-1 truncate">Painel admin</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </div>
            </motion.div>

            {/* CTA COMPRAR */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-glass p-6 border-amber-500/20 glow-amber"
            >
              <p className="text-zinc-300 text-sm mb-4 text-center">
                Interessado nesta plataforma?
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary w-full justify-center py-3 text-base animate-pulse-glow"
              >
                <MessageCircle className="w-5 h-5" />
                Quero esta plataforma!
              </button>
              <a
                href={getWhatsappUrl(
                  `Olá! Tenho interesse na plataforma ${platform.name}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-center mt-2 text-sm"
              >
                Falar direto no WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-2xl shadow-2xl shadow-amber-500/40 transition-all duration-200 hover:shadow-amber-500/60 hover:scale-105 active:scale-95"
        aria-label="Quero esta plataforma"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:block">Quero esta plataforma!</span>
      </motion.button>

      {/* MODAL */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        platformName={platform.name}
      />
    </div>
  )
}
