'use server'

import { prisma } from '@/lib/db'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional().default(''),
})

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { platforms: true }
        }
      },
      orderBy: { name: 'asc' }
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: 'Falha ao buscar categorias' }
  }
}

export async function createCategory(data: { name: string; description?: string }) {
  try {
    const validated = categorySchema.parse(data)

    // Check for duplicates
    const existing = await prisma.category.findUnique({
      where: { name: validated.name }
    })

    if (existing) {
      return { success: false, error: 'Já existe uma categoria com este nome.' }
    }

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        description: validated.description,
      }
    })

    revalidatePath('/admin/categorias')
    return { success: true, data: category }
  } catch (error) {
    console.error('Error creating category:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Falha ao criar categoria.' }
  }
}

export async function updateCategory(id: string, data: { name: string; description?: string }) {
  try {
    const validated = categorySchema.parse(data)

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
      }
    })

    revalidatePath('/admin/categorias')
    revalidatePath(`/admin/categorias/${id}`)
    return { success: true, data: category }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: 'Falha ao atualizar categoria.' }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check for linked products
    const platformCount = await prisma.platform.count({
      where: { categoryId: id }
    })

    if (platformCount > 0) {
      return { 
        success: false, 
        error: `Não é possível excluir esta categoria pois ela possui ${platformCount} produtos vinculados.` 
      }
    }

    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/admin/categorias')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Falha ao excluir categoria.' }
  }
}

export async function getCategoryStats(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        platforms: {
          select: {
            id: true,
            name: true,
            views: true,
            externalClicks: true,
          },
          orderBy: {
            views: 'desc'
          }
        }
      }
    })

    if (!category) return { success: false, error: 'Categoria não encontrada' }

    const totalProducts = category.platforms.length
    const totalViews = category.platforms.reduce((acc, p) => acc + p.views, 0)
    const totalClicks = category.platforms.reduce((acc, p) => acc + p.externalClicks, 0)
    const conversionRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

    return {
      success: true,
      data: {
        ...category,
        totalProducts,
        totalViews,
        totalClicks,
        conversionRate: conversionRate.toFixed(2),
        topPlatforms: category.platforms.slice(0, 5)
      }
    }
  } catch (error) {
    console.error('Error fetching category stats:', error)
    return { success: false, error: 'Falha ao buscar estatísticas' }
  }
}
