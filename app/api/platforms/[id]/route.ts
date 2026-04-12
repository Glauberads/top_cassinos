import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(['cassino', 'casual', 'esporte', 'lootbox']).optional(),
  bannerUrl: z.string().url().optional(),
  previewUrl: z.string().url().optional(),
  clientUrl: z.string().url().optional(),
  adminUrl: z.string().url().optional(),
  adminLogin: z.string().optional(),
  adminPassword: z.string().optional(),
  instructions: z.string().optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  tags: z.array(z.string()).optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const platform = await prisma.platform.findUnique({ where: { id } })
    if (!platform) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }
    return NextResponse.json(platform)
  } catch (error) {
    console.error('GET /api/platforms/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao buscar plataforma' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const body: unknown = await request.json()
    const parsed = updateSchema.parse(body)

    const data = {
      ...parsed,
      tags: parsed.tags ? parsed.tags.join(', ') : undefined,
    }

    const platform = await prisma.platform.update({ where: { id }, data })
    return NextResponse.json(platform)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('PUT /api/platforms/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar plataforma' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    await prisma.platform.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/platforms/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao excluir plataforma' }, { status: 500 })
  }
}
