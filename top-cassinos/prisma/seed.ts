import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? 'admin123',
    12
  )

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'admin@topcassinos.com.br' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? 'admin@topcassinos.com.br',
      password: hashedPassword,
      name: process.env.ADMIN_NAME ?? 'Administrador',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin criado: ${admin.email}`)

  // Criar plataformas de exemplo
  const platforms = [
    {
      name: 'GoldenSpin Casino',
      slug: 'goldenspin-casino',
      description:
        'Plataforma completa de cassino online com mais de 500 jogos, sistema de afiliados integrado, bônus automáticos e painel administrativo avançado. Sistema de pagamento PIX nativo, com saque automático em até 5 minutos. Suporte a múltiplos provedores de jogos como Pragmatic Play, Evolution e NetEnt.',
      category: 'cassino',
      bannerUrl:
        'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800&q=80',
      previewUrl:
        'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&q=80',
      clientUrl: 'https://demo.goldenspin.com',
      adminUrl: 'https://admin.goldenspin.com',
      adminLogin: 'demo@goldenspin.com',
      adminPassword: 'demo123456',
      instructions: `# Como usar o GoldenSpin Casino

## Acesso ao Painel Admin
1. Acesse o link do painel administrativo
2. Use as credenciais fornecidas acima
3. Configure seu domínio próprio em Configurações > Domínio

## Configuração de Pagamentos
- PIX: Configure suas chaves PIX em Financeiro > Gateways
- Suporta: Mercado Pago, PagSeguro, Asaas

## Jogos
- Mais de 500 jogos disponíveis
- Ative/desative jogos em Jogos > Gerenciar
- Configure Volatilidade RTP em Jogos > Configurações

## Afiliados
- Sistema de afiliados integrado
- Comissões configuráveis por nível
- Relatórios em tempo real`,
      isActive: true,
      featured: true,
      order: 1,
      tags: 'pix, afiliados, pragmatic, evolution, 500-jogos',
    },
    {
      name: 'LuckyBox Lootbox',
      slug: 'luckybox-lootbox',
      description:
        'Sistema de abertura de caixas (lootbox) gamificado com raridades, animações épicas e integração com PIX. Plataforma ideal para criar sua própria loja de lootbox com itens personalizáveis, sistema de inventário do usuário e marketplace interno. Inclui sistema de batalha de caixas ao vivo.',
      category: 'lootbox',
      bannerUrl:
        'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80',
      previewUrl:
        'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?w=400&q=80',
      clientUrl: 'https://demo.luckybox.com',
      adminUrl: 'https://admin.luckybox.com',
      adminLogin: 'demo@luckybox.com',
      adminPassword: 'demo123456',
      instructions: `# Como usar o LuckyBox

## Criando Caixas
1. Acesse Admin > Caixas > Nova Caixa
2. Defina nome, preço e imagem da caixa
3. Adicione itens com raridades (Comum, Raro, Épico, Lendário)
4. Publique a caixa

## Itens e Inventário
- Cadastre itens únicos com imagens personalizadas
- Defina probabilidades por raridade
- Usuários acumulam itens no inventário

## Batalha de Caixas
- Modo PvP onde dois usuários abrem caixas simultaneamente
- O maior valor total leva a aposta
- Configure salas públicas ou privadas

## Pagamentos
- PIX integrado com confirmação automática
- Saque via PIX em até 10 minutos`,
      isActive: true,
      featured: true,
      order: 2,
      tags: 'lootbox, gamificação, pix, inventário, batalha',
    },
    {
      name: 'PlayZone Games',
      slug: 'playzone-games',
      description:
        'Plataforma de jogos casuais e sociais com ranking, torneios e premiações em dinheiro. Conta com jogos de habilidade, trivia, puzzles e minijogos. Sistema de moedas virtuais com conversão para PIX. Ideal para criar uma comunidade engajada de jogadores casuais com monetização recorrente.',
      category: 'casual',
      bannerUrl:
        'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80',
      previewUrl:
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80',
      clientUrl: 'https://demo.playzone.com',
      adminUrl: 'https://admin.playzone.com',
      adminLogin: 'demo@playzone.com',
      adminPassword: 'demo123456',
      instructions: `# Como usar o PlayZone Games

## Configuração Inicial
1. Acesse o painel admin com as credenciais acima
2. Configure o nome da sua plataforma em Configurações > Geral
3. Faça upload do seu logo e banner

## Gerenciando Torneios
- Crie torneios em Competições > Novo Torneio
- Defina premiação, data e número máximo de participantes
- Transmita ao vivo via integração com YouTube/Twitch

## Sistema de Moedas
- Configure o valor da moeda virtual em Financeiro > Câmbio
- Mínimo de saque configurável
- Relatório de transações em tempo real

## Marketing e Retenção
- Notificações push integradas
- Emails automáticos de reengajamento
- Programa de indicação com bônus`,
      isActive: true,
      featured: false,
      order: 3,
      tags: 'casual, torneios, ranking, pix, social',
    },
  ]

  for (const platform of platforms) {
    const created = await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: platform,
      create: platform,
    })
    console.log(`✅ Plataforma criada: ${created.name}`)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
