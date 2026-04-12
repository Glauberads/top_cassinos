// Tipos do domínio da aplicação (independentes do Prisma)
// Isso evita erros de importação quando @prisma/client não está gerado

export interface Platform {
  id: string
  name: string
  slug: string
  description: string
  category: string
  bannerUrl: string
  previewUrl: string
  clientUrl: string
  adminUrl: string
  adminLogin: string | null
  adminPassword: string | null
  instructions: string | null
  isActive: boolean
  featured: boolean
  order: number
  views: number
  tags: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  whatsapp: string
  platform: string
  source: string
  createdAt: Date
}

export interface Admin {
  id: string
  email: string
  password: string
  name: string
}
