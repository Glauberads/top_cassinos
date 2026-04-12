'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, Star, ArrowRight } from 'lucide-react'
import { cn, CATEGORY_LABELS, CATEGORY_COLORS, parseTags } from '@/lib/utils'
import type { Platform } from '@/lib/types'

interface PlatformCardProps {
  platform: Platform
}

export function PlatformCard({ platform }: PlatformCardProps) {
  const categoryColor = CATEGORY_COLORS[platform.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'
  const categoryLabel = CATEGORY_LABELS[platform.category] ?? platform.category

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group card-glass overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      {/* BANNER */}
      <div className="relative h-48 overflow-hidden bg-zinc-800">
        <Image
          src={platform.bannerUrl}
          alt={`Banner ${platform.name}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay ao hover */}
        <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            href={`/plataforma/${platform.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-zinc-950 font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver demo
          </Link>
        </div>

        {/* Badges no banner */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={cn('badge', categoryColor)}>
            {categoryLabel}
          </span>
          {platform.featured && (
            <span className="badge bg-primary/90 text-zinc-950 border-primary/40">
              <Star className="w-3 h-3" />
              Destaque
            </span>
          )}
        </div>

        {/* Views */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-zinc-950/70 rounded-lg text-zinc-400 text-xs">
          <Eye className="w-3 h-3" />
          {platform.views}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {platform.name}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
          {platform.description}
        </p>

        {/* TAGS */}
        {parseTags(platform.tags).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {parseTags(platform.tags).slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-md text-xs border border-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/plataforma/${platform.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 border border-zinc-700 text-zinc-300 hover:border-primary hover:text-primary rounded-xl text-sm font-medium transition-all duration-200 group/btn"
        >
          Ver detalhes
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}
