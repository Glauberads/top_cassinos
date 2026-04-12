import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const platform = await prisma.platform.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { views: true },
    })
    return NextResponse.json({ views: platform.views })
  } catch (error) {
    console.error('POST /api/platforms/[id]/view error:', error)
    return NextResponse.json({ error: 'Erro ao registrar visualização' }, { status: 500 })
  }
}
