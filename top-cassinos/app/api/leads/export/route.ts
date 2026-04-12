import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { leadsToCSV, formatDate } from '@/lib/utils'

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const csv = leadsToCSV(leads)
    const date = formatDate(new Date())

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${date}.csv"`,
      },
    })
  } catch (error) {
    console.error('GET /api/leads/export error:', error)
    return NextResponse.json({ error: 'Erro ao exportar leads' }, { status: 500 })
  }
}
