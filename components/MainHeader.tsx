'use client'

import React from 'react'
import Link from 'next/link'
import { MessageCircle, Dices } from 'lucide-react'
import { WhatsAppLeadTrigger } from './WhatsAppLeadTrigger'

interface MainHeaderProps {
  settings?: any
  siteName: string
  brandFirst: string
  brandRest: string
}

export function MainHeader({ settings, siteName, brandFirst, brandRest }: MainHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Dices className="w-5 h-5 text-zinc-950" />
                </div>
                <span className="font-bold text-xl text-white">
                  {brandFirst}<span className="text-primary">{brandRest}</span>
                </span>
              </>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#plataformas" className="hover:text-amber-400 transition-colors">
              Plataformas
            </a>
            <a href="#diferenciais" className="hover:text-amber-400 transition-colors">
              Diferenciais
            </a>
            <Link href="/contato" className="hover:text-amber-400 transition-colors">
              Contato
            </Link>
          </nav>

          <WhatsAppLeadTrigger origin="Header">
            <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Suporte WhatsApp
            </button>
          </WhatsAppLeadTrigger>
        </div>
      </div>
    </header>
  )
}
