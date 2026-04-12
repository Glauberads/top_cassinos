'use server'

import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function registerUser(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data

  try {
    // 1. Verificar se usuário já existe
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: 'Este e-mail já está cadastrado' }
    }

    // 2. Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Criar usuário (Role USER por padrão)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    return { success: true }
  } catch (err) {
    console.error('Erro no registro:', err)
    return { success: false, error: 'Falha ao criar conta. Tente novamente.' }
  }
}

export async function adminCreateUser(data: { name: string; email: string; password: string; role: 'ADMIN' | 'USER' }) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  const { name, email, password, role } = data

  try {
    // 1. Verificar se usuário já existe
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: 'Este e-mail já está cadastrado' }
    }

    // 2. Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Criar usuário
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath('/admin/configuracoes/usuarios')
    return { success: true }
  } catch (err) {
    console.error('Erro na criação de usuário (Admin):', err)
    return { success: false, error: 'Falha ao criar usuário' }
  }
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'USER') {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
    revalidatePath('/admin/configuracoes/usuarios')
    return { success: true }
  } catch (err) {
    console.error('Erro ao atualizar role:', err)
    return { success: false, error: 'Falha ao atualizar nível de acesso' }
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  // Impedir que o admin delete a si próprio
  if (session.user.id === userId) {
    return { success: false, error: 'Você não pode excluir sua própria conta' }
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    })
    revalidatePath('/admin/configuracoes/usuarios')
    return { success: true }
  } catch (err) {
    console.error('Erro ao deletar usuário:', err)
    return { success: false, error: 'Falha ao excluir usuário' }
  }
}
