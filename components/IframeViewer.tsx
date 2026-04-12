'use client'

import { useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IframeViewerProps {
  url: string
  title: string
}

export function IframeViewer({ url, title }: IframeViewerProps) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
        <button
          onClick={() => setMode('desktop')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            mode === 'desktop'
              ? 'bg-amber-500 text-zinc-950'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Monitor className="w-4 h-4" />
          Desktop
        </button>
        <button
          onClick={() => setMode('mobile')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            mode === 'mobile'
              ? 'bg-amber-500 text-zinc-950'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          <Smartphone className="w-4 h-4" />
          Mobile
        </button>
      </div>

      {/* Iframe Container */}
      <div
        className={cn(
          'mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden transition-all duration-500',
          mode === 'desktop'
            ? 'w-full'
            : 'w-[390px] shadow-2xl shadow-zinc-950'
        )}
      >
        {mode === 'mobile' && (
          <div className="h-6 bg-zinc-800 flex items-center justify-center">
            <div className="w-20 h-1.5 bg-zinc-700 rounded-full" />
          </div>
        )}
        <iframe
          src={url}
          title={title}
          aria-label={`Preview da plataforma ${title}`}
          className={cn(
            'w-full border-0',
            mode === 'desktop' ? 'h-[600px]' : 'h-[750px]'
          )}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  )
}
