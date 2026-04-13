'use client'

import React, { useState } from 'react'
import { WhatsAppContactModal } from './WhatsAppContactModal'

interface WhatsAppLeadTriggerProps {
  children: React.ReactNode
  origin?: string
}

export function WhatsAppLeadTrigger({ children, origin }: WhatsAppLeadTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // We wrap the children in a div with display: contents to avoid layout issues
  // while still capturing the click event.
  return (
    <>
      <div 
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
        style={{ display: 'contents', cursor: 'pointer' }}
      >
        {children}
      </div>
      <WhatsAppContactModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        origin={origin} 
      />
    </>
  )
}
