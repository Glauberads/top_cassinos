import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const platformSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['cassino', 'casual', 'esporte', 'lootbox']),
  bannerUrl: z.string().url(),
  previewUrl: z.string().url(),
  clientUrl: z.string().url(),
  adminUrl: z.string().url(),
  adminLogin: z.string().optional(),
  adminPassword: z.string().optional(),
  instructions: z.string().optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('active') !== 'false'

    const platforms = await prisma.platform.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(category && category !== 'todos' ? { category } : {}),
      },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(platforms)
  } catch (error) {
    console.error('GET /api/platforms error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar plataformas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = platformSchema.parse(body)

    const data = {
      ...parsed,
      tags: parsed.tags.join(', '),
    }

    const platform = await prisma.platform.create({ data })
    return NextResponse.json(platform, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('POST /api/platforms error:', error)
    return NextResponse.json({ error: 'Erro ao criar plataforma' }, { status: 500 })
  }
}
