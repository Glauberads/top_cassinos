'use client'

import { useState, useEffect } from 'react'
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  Shield, 
  Share2, 
  Settings as SettingsIcon, 
  Globe, 
  CreditCard, 
  Star, 
  LayoutDashboard 
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'geral' | 'pagamentos' | 'marketing'

export default function AdminConfigsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('geral')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [config, setConfig] = useState({
    companyName: '',
    whatsapp: '',
    instagram: '',
    seoTitle: '',
    seoDescription: '',
    metaPixelId: '',
    gtmId: '',
    stripePublicKey: '',
    stripeSecretKey: '',
    mpPublicKey: '',
    mpAccessToken: '',
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#fbbf24',
    secondaryColor: '#000000',
    heroTitle: '',
    heroSubtitle: '',
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  async function fetchConfigs() {
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Erro ao carregar configurações')
      const data = await res.json()
      setConfig({
        companyName: data.companyName || '',
        whatsapp: data.whatsapp || '',
        instagram: data.instagram || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        metaPixelId: data.metaPixelId || '',
        gtmId: data.gtmId || '',
        stripePublicKey: data.stripePublicKey || '',
        stripeSecretKey: data.stripeSecretKey || '',
        mpPublicKey: data.mpPublicKey || '',
        mpAccessToken: data.mpAccessToken || '',
        siteName: data.siteName || '',
        logoUrl: data.logoUrl || '',
        faviconUrl: data.faviconUrl || '',
        primaryColor: data.primaryColor || '#fbbf24',
        secondaryColor: data.secondaryColor || '#000000',
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(key: keyof typeof config, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'faviconUrl') {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'branding')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Erro no upload')
      const data = await res.json()
      handleChange(key, data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      
      if (!res.ok) throw new Error('Erro ao salvar configurações')
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Globe },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'marketing', label: 'Marketing', icon: Share2 },
  ]

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-400 mt-1">Gerencie a identidade, pagamentos e marketing da plataforma</p>
      </div>

      {/* Tabs Sub-navigation */}
      <div className="flex gap-2 p-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl mb-8 w-fit shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-zinc-950' : 'text-zinc-500')} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {(saved || error) && (
        <div className={cn(
          "flex items-center gap-3 p-4 border rounded-2xl mb-6 animate-in fade-in slide-in-from-top-4 duration-300",
          saved ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          <span className="text-sm font-medium">{saved ? "Configurações salvas com sucesso!" : error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'geral' && (
          <div className="space-y-6 animate-in fade-in blur-in-sm duration-500">
            {/* Branding & Visual UI */}
            <div className="card-glass p-8 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-lg font-semibold text-white">Identidade Visual</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="label">Nome do Site (White Label)</label>
                  <input
                    value={config.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="input-field"
                    placeholder="Ex: Top Cassinos"
                  />
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="label">Cor Primária</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer overflow-hidden p-0"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="input-field font-mono text-xs py-2 px-3"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="label">Cor Secundária</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer overflow-hidden p-0"
                      />
                      <input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="input-field font-mono text-xs py-2 px-3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-800/50">
                <div>
                  <label className="label text-zinc-400">Logo do Site (PNG/SVG)</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                      {config.logoUrl ? (
                        <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Globe className="w-8 h-8 text-zinc-700" />
                      )}
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors">
                      {saving ? 'Enviando...' : 'Alterar Logo'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label text-zinc-400">Favicon (Ícone da aba)</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                      {config.faviconUrl ? (
                        <img src={config.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Globe className="w-5 h-5 text-zinc-700" />
                      )}
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors">
                      {saving ? 'Enviando...' : 'Alterar Ícone'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'faviconUrl')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Content Section */}
            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <LayoutDashboard className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-white">Conteúdo Principal (Hero)</h2>
              </div>

              <div>
                <label className="label">Título do Banner Inicial</label>
                <input
                  value={config.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="input-field"
                  placeholder="Ex: As melhores plataformas prontas..."
                />
              </div>

              <div>
                <label className="label">Subtítulo do Banner</label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Descreva sua plataforma em poucas palavras..."
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-white">SEO & Indexação</h2>
              </div>

              <div>
                <label className="label">Título Global (SEO)</label>
                <input
                  value={config.seoTitle}
                  onChange={(e) => handleChange('seoTitle', e.target.value)}
                  className="input-field"
                />
                <p className="text-xs text-zinc-500 mt-2">Recomendado: 50 a 60 caracteres.</p>
              </div>

              <div>
                <label className="label">Meta Descrição</label>
                <textarea
                  value={config.seoDescription}
                  onChange={(e) => handleChange('seoDescription', e.target.value)}
                  rows={4}
                  className="input-field resize-none"
                />
                <p className="text-xs text-zinc-500 mt-2">Recomendado: 150 a 160 caracteres.</p>
              </div>
            </div>

            {/* Legacy Ops Data */}
            <div className="card-glass p-8 space-y-6 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-zinc-500/10 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-zinc-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Dados Operacionais (Legado)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Nome da Empresa</label>
                  <input
                    value={config.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">WhatsApp</label>
                  <input
                    value={config.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pagamentos' && (
          <div className="space-y-6 animate-in fade-in blur-in-sm duration-500">
            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://stripe.com/favicon.ico" className="w-5 h-5 filter grayscale brightness-200" alt="Stripe" />
                <h2 className="text-lg font-semibold text-white">Integração Stripe</h2>
              </div>

              <div>
                <label className="label">Public Key (pk_test_...)</label>
                <input
                  value={config.stripePublicKey}
                  onChange={(e) => handleChange('stripePublicKey', e.target.value)}
                  className="input-field font-mono text-xs"
                  placeholder="pk_..."
                />
              </div>

              <div>
                <label className="label">Secret Key (sk_test_...)</label>
                <input
                  type="password"
                  value={config.stripeSecretKey}
                  onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                  className="input-field font-mono text-xs"
                  placeholder="sk_..."
                />
              </div>
            </div>

            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://www.mercadopago.com/favicon.ico" className="w-5 h-5" alt="MP" />
                <h2 className="text-lg font-semibold text-white">Integração Mercado Pago</h2>
              </div>

              <div>
                <label className="label">Public Key (APP_USR-...)</label>
                <input
                  value={config.mpPublicKey}
                  onChange={(e) => handleChange('mpPublicKey', e.target.value)}
                  className="input-field font-mono text-xs"
                  placeholder="APP_USR-..."
                />
              </div>

              <div>
                <label className="label">Access Token (APP_USR-...)</label>
                <input
                  type="password"
                  value={config.mpAccessToken}
                  onChange={(e) => handleChange('mpAccessToken', e.target.value)}
                  className="input-field font-mono text-xs"
                  placeholder="APP_USR-..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-6 animate-in fade-in blur-in-sm duration-500">
            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Share2 className="w-6 h-6" />
                <h2 className="text-lg font-semibold text-white">Meta Pixel (Facebook)</h2>
              </div>

              <div>
                <label className="label">ID do Pixel</label>
                <input
                  value={config.metaPixelId}
                  onChange={(e) => handleChange('metaPixelId', e.target.value)}
                  className="input-field"
                  placeholder="Ex: 123456789012345"
                />
                <p className="text-xs text-zinc-500 mt-2">O script será injetado automaticamente em todas as páginas.</p>
              </div>
            </div>

            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-3 mb-4 text-green-400">
                <SettingsIcon className="w-6 h-6" />
                <h2 className="text-lg font-semibold text-white">Google Tag Manager (GTM)</h2>
              </div>

              <div>
                <label className="label">ID do Recipiente (GTM-XXXXXXX)</label>
                <input
                  value={config.gtmId}
                  onChange={(e) => handleChange('gtmId', e.target.value)}
                  className="input-field"
                  placeholder="Ex: GTM-ABC1234"
                />
                <p className="text-xs text-zinc-500 mt-2">Inclui suporte para Google Analytics 4 via GTM.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary min-w-[200px] justify-center shadow-xl shadow-amber-500/10"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Salvando...' : 'Salvar todas alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
