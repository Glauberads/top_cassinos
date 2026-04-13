import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PlatformForm } from '@/app/admin/plataformas/PlatformForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPlatformPage({ params }: PageProps) {
  const { id } = await params
  const platform = await prisma.platform.findUnique({ where: { id } })
  if (!platform) notFound()

  return (
    <PlatformForm
      isEdit
      platformId={id}
      defaultValues={{
        name: platform.name,
        slug: platform.slug,
        description: platform.description,
        categoryId: platform.categoryId ?? '',
        bannerUrl: platform.bannerUrl,
        previewUrl: platform.previewUrl,
        clientUrl: platform.clientUrl,
        adminUrl: platform.adminUrl,
        adminLogin: platform.adminLogin ?? '',
        adminPassword: platform.adminPassword ?? '',
        instructions: platform.instructions ?? '',
        isActive: platform.isActive,
        featured: platform.featured,
        order: platform.order,
        tags: platform.tags ?? '',
      }}
    />
  )
}
