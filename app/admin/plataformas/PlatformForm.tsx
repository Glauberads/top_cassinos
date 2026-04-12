'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Upload,
  CheckCircle2,
  X,
  Image as ImageIcon,
} from 'lucide-react'
import { generateSlug } from '@/lib/utils'

const CATEGORIES = ['cassino', 'casual', 'esporte', 'lootbox'] as const
type Category = typeof CATEGORIES[number]

const platformSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.string().min(1, 'Categoria obrigatória'),
  bannerUrl: z.string().url('URL do banner inválida'),
  previewUrl: z.string().url('URL do preview inválida'),
  clientUrl: z.string().url('URL do cliente inválida'),
  adminUrl: z.string().url('URL do admin inválida'),
  adminLogin: z.string().optional().default(''),
  adminPassword: z.string().optional().default(''),
  instructions: z.string().optional().default(''),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  tags: z.string().optional().default(''),
})

type PlatformFormData = z.infer<typeof platformSchema>

interface PlatformFormProps {
  defaultValues?: Partial<PlatformFormData>
  platformId?: string
  isEdit?: boolean
}

export function PlatformForm({ defaultValues, platformId, isEdit }: PlatformFormProps) {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(defaultValues?.bannerUrl ?? '')
  const [uploading, setUploading] = useState<'banner' | 'preview' | null>(null)
  const bannerRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlatformFormData>({
    resolver: zodResolver(platformSchema) as never,
    defaultValues: {
      isActive: true,
      featured: false,
      order: 0,
      adminLogin: '',
      adminPassword: '',
      instructions: '',
      tags: '',
      ...defaultValues,
    },
  })

  const nameValue = watch('name')

  function handleNameBlur() {
    if (nameValue && !isEdit) {
      setValue('slug', generateSlug(nameValue))
    }
  }

  async function uploadFile(file: File, field: 'bannerUrl' | 'previewUrl') {
    const type = field === 'bannerUrl' ? 'banner' : 'preview'
    setUploading(type)
    const form = new FormData()
    form.append('file', file)
    form.append('folder', 'top-cassinos')
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const data = (await res.json()) as { url?: string }
    if (data.url) {
      setValue(field, data.url)
      if (field === 'bannerUrl') setBannerPreview(data.url)
    }
    setUploading(null)
  }

  async function onSubmit(data: PlatformFormData) {
    const body = { ...data }

    const url = isEdit ? `/api/platforms/${platformId}` : '/api/platforms'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/admin/plataformas'), 1000)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/plataformas"
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Editar plataforma' : 'Nova plataforma'}
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {isEdit ? 'Atualize os dados da plataforma' : 'Preencha os dados da nova plataforma'}
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">
            {isEdit ? 'Plataforma atualizada!' : 'Plataforma criada!'} Redirecionando...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-6">

        {/* BANNER UPLOAD */}
        <div className="card-glass p-6">
          <h2 className="text-base font-semibold text-white mb-4">Banner</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="label">URL do Banner</label>
              <div className="flex gap-2">
                <input
                  {...register('bannerUrl')}
                  onBlur={(e) => setBannerPreview(e.target.value)}
                  className="input-field flex-1"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => bannerRef.current?.click()}
                  className="btn-secondary px-3"
                  disabled={uploading === 'banner'}
                >
                  {uploading === 'banner' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </button>
                <input
                  ref={bannerRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'bannerUrl')}
                />
              </div>
              {errors.bannerUrl && (
                <p className="text-red-400 text-xs mt-1">{errors.bannerUrl.message}</p>
              )}
            </div>

            {bannerPreview && (
              <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerPreview} alt="Preview banner" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setBannerPreview(''); setValue('bannerUrl', '') }}
                  className="absolute top-1 right-1 p-1 bg-zinc-950/80 rounded-md text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {!bannerPreview && (
              <div className="w-32 h-20 rounded-xl border border-zinc-700 border-dashed flex items-center justify-center shrink-0">
                <ImageIcon className="w-6 h-6 text-zinc-600" />
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW URL */}
        <div className="card-glass p-6">
          <h2 className="text-base font-semibold text-white mb-4">Preview / Thumbnail</h2>
          <div className="flex gap-2">
            <input
              {...register('previewUrl')}
              className="input-field flex-1"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => previewRef.current?.click()}
              className="btn-secondary px-3"
              disabled={uploading === 'preview'}
            >
              {uploading === 'preview' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </button>
            <input
              ref={previewRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'previewUrl')}
            />
          </div>
          {errors.previewUrl && (
            <p className="text-red-400 text-xs mt-1">{errors.previewUrl.message}</p>
          )}
        </div>

        {/* DADOS BÁSICOS */}
        <div className="card-glass p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Dados básicos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nome *</label>
              <input
                {...register('name')}
                onBlur={handleNameBlur}
                className="input-field"
                placeholder="GoldenSpin Casino"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Slug *</label>
              <input
                {...register('slug')}
                className="input-field"
                placeholder="goldenspin-casino"
              />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Categoria *</label>
            <select {...register('category')} className="input-field">
              <option value="">Selecione...</option>
              {CATEGORIES.map((cat: Category) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="label">Descrição *</label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field resize-none"
              placeholder="Descreva a plataforma..."
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Tags (separadas por vírgula)</label>
            <input
              {...register('tags')}
              className="input-field"
              placeholder="pix, afiliados, pragmatic"
            />
          </div>
        </div>

        {/* LINKS */}
        <div className="card-glass p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Links</h2>

          <div>
            <label className="label">URL do Cliente *</label>
            <input {...register('clientUrl')} className="input-field" placeholder="https://..." />
            {errors.clientUrl && <p className="text-red-400 text-xs mt-1">{errors.clientUrl.message}</p>}
          </div>

          <div>
            <label className="label">URL do Admin *</label>
            <input {...register('adminUrl')} className="input-field" placeholder="https://..." />
            {errors.adminUrl && <p className="text-red-400 text-xs mt-1">{errors.adminUrl.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Login Admin</label>
              <input {...register('adminLogin')} className="input-field" placeholder="admin@..." />
            </div>
            <div>
              <label className="label">Senha Admin</label>
              <input {...register('adminPassword')} className="input-field" placeholder="senha..." />
            </div>
          </div>
        </div>

        {/* INSTRUÇÕES */}
        <div className="card-glass p-6">
          <h2 className="text-base font-semibold text-white mb-4">Instruções de uso</h2>
          <textarea
            {...register('instructions')}
            rows={8}
            className="input-field resize-y font-mono text-sm"
            placeholder="# Como usar&#10;&#10;1. Acesse o painel&#10;2. ..."
          />
        </div>

        {/* OPÇÕES */}
        <div className="card-glass p-6">
          <h2 className="text-base font-semibold text-white mb-4">Opções</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input {...register('isActive')} type="checkbox" className="sr-only peer" />
              <div className="w-10 h-6 bg-zinc-700 peer-checked:bg-amber-500 rounded-full relative transition-colors after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
              <span className="text-sm text-zinc-300">Ativo</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input {...register('featured')} type="checkbox" className="sr-only peer" />
              <div className="w-10 h-6 bg-zinc-700 peer-checked:bg-amber-500 rounded-full relative transition-colors after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
              <span className="text-sm text-zinc-300">Destaque</span>
            </label>

            <div>
              <label className="label">Ordem</label>
              <input
                {...register('order', { valueAsNumber: true })}
                type="number"
                className="input-field"
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={isSubmitting || success} className="btn-primary flex-1 justify-center py-3">
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : null}
            {isSubmitting ? 'Salvando...' : isEdit ? 'Atualizar plataforma' : 'Criar plataforma'}
          </button>
          <Link href="/admin/plataformas" className="btn-secondary px-6">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
