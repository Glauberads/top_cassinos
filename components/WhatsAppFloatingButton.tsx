'use client'

import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { WhatsAppContactModal } from './WhatsAppContactModal'

interface WhatsAppFloatingButtonProps {
  origin?: string
  whatsappNumber?: string
}

export function WhatsAppFloatingButton({ 
  origin = 'Home', 
  whatsappNumber
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 glow-green"
        aria-label="Suporte via WhatsApp"
      >
        {/* Efeito de Pulso (Ping) */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-20" />
        
        <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" />
      </button>

      <WhatsAppContactModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        origin={origin}
        whatsappNumber={whatsappNumber}
      />

      <style jsx global>{`
        .glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  )
}
