import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2),
  whatsapp: z.string().min(10),
  platform: z.string().min(1),
  source: z.string().default('site'),
})

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('GET /api/leads error:', error)
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const data = leadSchema.parse(body)

    const lead = await prisma.lead.create({ data })
    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('POST /api/leads error:', error)
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 })
  }
}
