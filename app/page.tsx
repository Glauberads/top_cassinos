'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  MessageCircle,
  ChevronDown,
  Star,
  Zap,
  Shield,
  Headphones,
  LayoutDashboard,
  Trophy,
  Search,
  Gamepad2,
  Dices,
  Target,
  Package,
} from 'lucide-react'
import { PlatformCard } from '@/components/PlatformCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { MainHeader } from '@/components/MainHeader'
import { WhatsAppLeadTrigger } from '@/components/WhatsAppLeadTrigger'
import { getWhatsappUrl, parseTags } from '@/lib/utils'
import type { Platform } from '@/lib/types'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function AnimatedCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = Math.ceil(end / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 24)
    return () => clearInterval(timer)
  }, [end])

  return (
    <motion.div
      variants={fadeUp}
      className="text-center"
    >
      <div className="text-4xl font-bold gradient-text">{count}+</div>
      <div className="text-zinc-400 text-sm mt-1">{label}</div>
    </motion.div>
  )
}

const FEATURES = [
  {
    icon: Shield,
    title: 'Sistemas Testados',
    description:
      'Todas as plataformas são revisadas e testadas antes de entrar em nosso catálogo.',
  },
  {
    icon: Headphones,
    title: 'Suporte Incluso',
    description:
      'Suporte técnico via WhatsApp 24h incluso na compra. Nunca estará sozinho.',
  },
  {
    icon: Zap,
    title: 'Entrega Imediata',
    description:
      'Após a compra, receba acesso completo em minutos. Sem burocracia.',
  },
  {
    icon: LayoutDashboard,
    title: 'Painel Admin',
    description:
      'Gerencie usuários, pagamentos e configurações pelo painel administrativo completo.',
  },
  {
    icon: Trophy,
    title: 'Alta Performance',
    description:
      'Servidores otimizados para suportar milhares de usuários simultâneos.',
  },
  {
    icon: Star,
    title: 'Marca Própria',
    description:
      'Personalize com seu logo, cores e domínio. A plataforma fica com sua cara.',
  },
]

const CATEGORY_ICONS = {
  todos: Gamepad2,
  cassino: Dices,
  casual: Target,
  esporte: Trophy,
  lootbox: Package,
}

export default function HomePage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [filtered, setFiltered] = useState<Platform[]>([])
  const [category, setCategory] = useState('todos')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [settings, setSettings] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    // Fetch platforms
    fetch('/api/platforms')
      .then((r) => r.json())
      .then((data: Platform[]) => {
        setPlatforms(data)
        setFiltered(data)
        setTotal(data.length)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Fetch settings
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: Record<string, any>) => setSettings(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    let result = platforms
    if (category !== 'todos') {
      result = result.filter((p) => p.category === category)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          parseTags(p.tags).some((t: string) => t.toLowerCase().includes(q))
      )
    }
    setFiltered(result)
  }, [category, search, platforms])

  const siteName = settings?.siteName || 'Top Cassinos'
  const brandFirst = siteName.split(' ')[0] || 'Top'
  const brandRest = siteName.split(' ').slice(1).join(' ') || 'Cassinos'

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainHeader 
        settings={settings} 
        siteName={siteName} 
        brandFirst={brandFirst} 
        brandRest={brandRest} 
      />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background efeitos */}
        {/* Background efeitos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--brand-primary,rgba(245,158,11,0.08))_0%,_transparent_60%)] opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        
        {/* Partículas decorativas */}
        <div className="absolute top-32 left-10 w-2 h-2 rounded-full bg-primary/40 animate-float" />
        <div className="absolute top-48 right-20 w-1 h-1 rounded-full bg-primary/60 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                <Star className="w-3.5 h-3.5" />
                Líder em plataformas de entretenimento 🇧🇷
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              {settings?.heroTitle ? (
                <>
                  {settings.heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
                  <span className="gradient-text">{settings.heroTitle.split(' ').slice(-2).join(' ')}</span>
                </>
              ) : (
                <>
                  As melhores <span className="gradient-text">plataformas prontas</span> para você lucrar
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {settings?.heroSubtitle || 'Sistemas de cassino, jogos e entretenimento prontos para lançar. Sem código, sem complicação.'}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a href="#plataformas" className="btn-primary text-base px-8 py-4">
                Ver plataformas
                <ArrowRight className="w-5 h-5" />
              </a>
              <WhatsAppLeadTrigger origin="Hero Specialist">
                <button className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Falar com Especialista Agora
                </button>
              </WhatsAppLeadTrigger>
            </motion.div>
          </motion.div>

          {/* MÉTRICAS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mt-20 grid grid-cols-3 gap-8 border-t border-zinc-800 pt-12"
          >
            <AnimatedCounter end={total || 50} label="Plataformas no catálogo" />
            <AnimatedCounter end={4} label="Categorias disponíveis" />
            <AnimatedCounter end={24} label="Horas de suporte" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <a href="#plataformas" className="text-zinc-500 hover:text-primary transition-colors flex flex-col items-center gap-2">
              <span className="text-sm">Explorar catálogo</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="plataformas" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              Catálogo de <span className="gradient-text">Plataformas</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 max-w-xl mx-auto">
              Escolha a plataforma ideal para o seu negócio e comece a lucrar hoje mesmo.
            </motion.p>
          </motion.div>

          {/* FILTROS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <CategoryFilter
              value={category}
              onChange={setCategory}
              icons={CATEGORY_ICONS}
            />
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* GRID */}
          {loading ? (
            <div className="platforms-grid">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="card-glass rounded-2xl overflow-hidden"
                >
                  <div className="h-48 shimmer bg-zinc-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-24 rounded shimmer bg-zinc-800" />
                    <div className="h-6 w-3/4 rounded shimmer bg-zinc-800" />
                    <div className="h-4 w-full rounded shimmer bg-zinc-800" />
                    <div className="h-4 w-2/3 rounded shimmer bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">Nenhuma plataforma encontrada</p>
              <button
                onClick={() => { setSearch(''); setCategory('todos') }}
                className="mt-4 text-amber-400 hover:text-amber-300 text-sm underline"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="platforms-grid"
            >
              {filtered.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              Por que escolher a{' '}
              <span className="gradient-text">Top Cassinos</span>?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 max-w-xl mx-auto">
              Mais do que sistemas prontos — entregamos tranquilidade, suporte e resultados.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feat) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                className="card-glass p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="card-glass p-12 glow-amber"
          >
            <motion.div variants={fadeUp} className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-amber-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para começar?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 mb-8 text-lg">
              Fale com nosso especialista agora mesmo e monte seu negócio digital hoje.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppLeadTrigger origin="Final CTA">
                <button className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Falar via WhatsApp
                </button>
              </WhatsAppLeadTrigger>
              <Link href="/contato" className="btn-secondary text-base px-8 py-4">
                Formulário de contato
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Dices className="w-5 h-5 text-zinc-950" />
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {brandFirst}<span className="text-primary">{brandRest}</span>
                    </div>
                    <div className="text-xs text-zinc-500">{settings?.heroSubtitle?.substring(0, 50) || 'Plataformas prontas para lucrar'}...</div>
                  </div>
                </>
              )}
            </Link>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-zinc-400">
              <WhatsAppLeadTrigger origin="Footer">
                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  +55 22 99215-7330
                </button>
              </WhatsAppLeadTrigger>
              <span className="hidden sm:block text-zinc-700">•</span>
              <Link href="/contato" className="hover:text-primary transition-colors">
                Contato
              </Link>
              <span className="hidden sm:block text-zinc-700">•</span>
              <Link href="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
            </div>

            <div className="text-zinc-600 text-sm">
              © 2025 {siteName}. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
