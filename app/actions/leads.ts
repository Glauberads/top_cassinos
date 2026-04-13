'use server'

import { prisma } from '@/lib/db'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string().min(10, 'Número de WhatsApp inválido'),
  origin: z.string().optional().default('Home'),
})

export async function createLead(formData: {
  name: string
  whatsapp: string
  origin?: string
}) {
  try {
    const validated = leadSchema.parse(formData)

    const lead = await prisma.lead.create({
      data: {
        name: validated.name,
        whatsapp: validated.whatsapp,
        origin: validated.origin,
        status: 'Pendente',
      },
    })

    return { success: true, id: lead.id }
  } catch (error) {
    console.error('Error creating lead:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Falha ao salvar contato. Tente novamente.' }
  }
}
