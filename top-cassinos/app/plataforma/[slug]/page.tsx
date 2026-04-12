import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { PlatformDetailClient } from './PlatformDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const platform = await prisma.platform.findUnique({ where: { slug } })
  if (!platform) return {}

  return {
    title: `${platform.name} – Plataforma`,
    description: platform.description.slice(0, 160),
    openGraph: {
      title: platform.name,
      description: platform.description.slice(0, 160),
      images: [{ url: platform.bannerUrl }],
    },
  }
}

export default async function PlatformPage({ params }: PageProps) {
  const { slug } = await params
  const platform = await prisma.platform.findUnique({ where: { slug } })

  if (!platform || !platform.isActive) {
    notFound()
  }

  return <PlatformDetailClient platform={platform} />
}
