'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function trackExternalClick(platformId: string) {
  try {
    const updated = await prisma.platform.update({
      where: { id: platformId },
      data: {
        externalClicks: {
          increment: 1
        }
      }
    })
    
    // We don't always need to revalidate the whole path for every click
    // but we might want to refresh the stats pages
    revalidatePath(`/admin/categorias/${updated.categoryId}`)
    
    return { success: true, clicks: updated.externalClicks }
  } catch (error) {
    console.error('Error tracking click:', error)
    return { success: false, error: 'Falha ao registrar clique.' }
  }
}

export async function getPlatforms() {
  try {
    const platforms = await prisma.platform.findMany({
      include: {
        categoryRef: true
      },
      orderBy: { order: 'asc' }
    })
    return { success: true, data: platforms }
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return { success: false, error: 'Falha ao buscar plataformas' }
  }
}
