# 🎰 Top Cassinos – Plataforma SaaS de Vitrine de Sistemas Digitais

Plataforma completa de vitrine e venda de sistemas digitais prontos (cassino, jogos, lootbox) para empreendedores brasileiros.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + TailwindCSS
- **Backend:** API Routes Next.js (Node.js/TypeScript)
- **Banco de dados:** SQLite/PostgreSQL via Prisma ORM
- **Pagamentos:** Stripe & Mercado Pago (SDKs Oficiais)
- **Marketing:** Meta Pixel & Google Tag Manager (Injeção Dinâmica)
- **Autenticação:** NextAuth.js (JWT/Credentials)
- **Storage:** Cloudinary (upload de imagens)
- **Deploy:** Vercel (frontend) + Railway/Neon (banco)

---

## ⚙️ Instalação e Configuração

### 1. Clone e instale as dependências

```bash
git clone <repo-url>
cd top-cassinos
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL |
| `NEXTAUTH_URL` | URL base da aplicação (ex: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret JWT (min 32 chars) — gere com `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary |
| `CLOUDINARY_API_KEY` | API Key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret do Cloudinary |
| `ADMIN_EMAIL` | Email do admin inicial |
| `ADMIN_PASSWORD` | Senha do admin inicial |
| `ADMIN_NAME` | Nome do admin inicial |

### 3. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Aplicar as migrations (desenvolvimento)
npm run db:migrate

# OU apenas sincronizar o schema (sem histórico de migrations)
npm run db:push
```

### 4. Executar o seed (dados iniciais)

```bash
npm run db:seed
```

Isso cria:
- **1 admin** com as credenciais do `.env`
- **3 plataformas de exemplo:** GoldenSpin Casino, LuckyBox Lootbox e PlayZone Games

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse:
- **Site público:** http://localhost:3000
- **Admin:** http://localhost:3000/admin (login: credenciais do .env)

---

## 📁 Estrutura do Projeto

```
top-cassinos/
├── app/
│   ├── page.tsx                    # Landing page pública
│   ├── layout.tsx                  # Layout raiz
│   ├── globals.css                 # Estilos globais
│   ├── contato/
│   │   └── page.tsx                # Formulário de contato
│   ├── plataforma/
│   │   └── [slug]/
│   │       ├── page.tsx            # Detalhe da plataforma (SSG)
│   │       └── PlatformDetailClient.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Layout admin (protegido)
│   │   ├── page.tsx                # Dashboard
│   │   ├── login/page.tsx          # Login admin
│   │   ├── plataformas/
│   │   │   ├── page.tsx            # Lista de plataformas
│   │   │   ├── PlatformForm.tsx    # Formulário reutilizável
│   │   │   ├── nova/page.tsx       # Criar plataforma
│   │   │   └── [id]/page.tsx       # Editar plataforma
│   │   ├── leads/
│   │   │   └── page.tsx            # Gestão de leads + CSV
│   │   └── configuracoes/
│   │       └── page.tsx            # Configurações do site (Abas: Geral, Pagamentos, Marketing)
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── platforms/
│       │   ├── route.ts            # GET lista, POST cria
│       │   └── [id]/
│       │       ├── route.ts        # GET, PUT, DELETE
│       │       └── view/route.ts   # POST incrementa views
│       ├── leads/
│       │   ├── route.ts            # GET lista, POST cria
│       │   └── export/route.ts     # GET exporta CSV
│       ├── upload/route.ts         # POST upload Cloudinary
│       ├── checkout/route.ts       # POST cria sessão Stripe/MP
│       └── admin/settings/route.ts # GET, POST configurações globais
├── components/
│   ├── PlatformCard.tsx            # Card da plataforma no catálogo
│   ├── IframeViewer.tsx            # Viewer com toggle mobile/desktop
│   ├── LeadModal.tsx               # Modal de captura de lead
│   ├── AdminSidebar.tsx            # Sidebar do painel admin
│   ├── CategoryFilter.tsx          # Filtro por categoria
│   └── SearchBar.tsx               # Campo de busca
├── lib/
│   ├── db.ts                       # Singleton Prisma
│   ├── cloudinary.ts               # Helpers de upload
│   ├── auth.ts                     # Configuração NextAuth
│   └── utils.ts                    # Utilitários gerais
├── prisma/
│   ├── schema.prisma               # Schema do banco
│   └── seed.ts                     # Dados iniciais
├── middleware.ts                   # Proteção das rotas /admin
├── next.config.ts                  # Configuração Next.js
└── .env.example                    # Template de variáveis
```

---

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Banco PostgreSQL em produção (recomendado: [Railway](https://railway.app) ou [Neon](https://neon.tech))
- Conta no [Cloudinary](https://cloudinary.com)

### Passo a passo

1. **Importe o repositório** na Vercel (Connect Git Repository)

2. **Configure as variáveis de ambiente** no painel da Vercel:
   - Copie todas as variáveis do `.env.example`
   - `NEXTAUTH_URL` = sua URL de produção (ex: `https://topcassinos.com.br`)
   - `NEXTAUTH_SECRET` = gere com `openssl rand -base64 32`

3. **Configure o banco no Railway:**
   - Crie um projeto → Add PostgreSQL
   - Copie a `DATABASE_URL` do Railway para a Vercel

4. **Apply migrations em produção:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
   Ou execute pelo CLI da Railway (painel de comandos).

5. **Deploy automático** pelo git push na branch `main`

---

## 🔧 Comandos Úteis

```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build de produção
npm run db:migrate     # Criar e aplicar migrations
npm run db:push        # Sincronizar schema (sem migration)
npm run db:seed        # Popular banco com dados iniciais
npm run db:studio      # Interface visual do banco (Prisma Studio)
```

---

## 📞 Contato

- **WhatsApp:** +55 22 99215-7330
- **Projeto:** Top Cassinos

---

© 2025 Top Cassinos. Todos os direitos reservados.
