# 🚀 Guia Mestre de Deploy: Top Cassinos

Este é o guia definitivo para migrar a plataforma **Top Cassinos** de um ambiente de desenvolvimento (SQLite) para produção (Supabase + Vercel). Siga cada passo com atenção para garantir a estabilidade e segurança do sistema.

---

## 1. Migração para Supabase (PostgreSQL)

O Supabase fornece o banco de dados PostgreSQL escalável necessário para a produção.

### 1.1 Alteração do Schema Prisma
Abra o arquivo `prisma/schema.prisma` e altere o bloco `datasource db`:

```prisma
// Localização: prisma/schema.prisma

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 1.2 Configuração de URLs no Supabase
No dashboard do Supabase (**Project Settings > Database**), você encontrará as URLs necessárias:

*   **DATABASE_URL**: Use a URL do **Connection Pooling** (Porta `6543`). Ela deve terminar com `?pgbouncer=true`.
*   **DIRECT_URL**: Use a URL de **Direct Connection** (Porta `5432`).

### 1.3 Inicialização do Banco de Dados
Execute o comando abaixo para limpar o histórico do SQLite e criar as tabelas no PostgreSQL do Supabase:

```bash
npx prisma migrate dev --name init_supabase
```
> [!WARNING]
> Este comando irá resetar o banco de dados local. Certifique-se de que sua `DATABASE_URL` no `.env` já esteja apontando para o Supabase.

---

## 2. Configuração de Produção (Vercel)

### 2.1 Variáveis de Ambiente (Environment Variables)
No painel da Vercel (**Settings > Environment Variables**), adicione a lista completa:

| Variável | Valor/Origem |
| :--- | :--- |
| `DATABASE_URL` | URL do Supabase (Porta 6543 + pgbouncer=true) |
| `DIRECT_URL` | URL do Supabase (Porta 5432) |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` |
| `NEXTAUTH_SECRET` | Gere uma chave aleatória (ex: `openssl rand -base64 32`) |
| `CLOUDINARY_CLOUD_NAME` | Dashboard do Cloudinary |
| `CLOUDINARY_API_KEY` | Dashboard do Cloudinary |
| `CLOUDINARY_API_SECRET` | Dashboard do Cloudinary |
| `ADMIN_EMAIL` | Email para o primeiro acesso admin |
| `ADMIN_PASSWORD` | Senha para o primeiro acesso admin |
| `ADMIN_NAME` | Nome do administrador |

### 2.2 Comando de Build Customizado
Na Vercel, altere o **Build Command** em **Project Settings**:

**Comando:**
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

---

## 3. Webhooks e Ativação Live

Para que os pagamentos sejam processados e as ordens liberadas automaticamente, configure os Webhooks.

### 3.1 Stripe (Dashboard)
1. Vá em **Developers > Webhooks**.
2. Clique em **Add Endpoint**.
3. **URL:** `https://seu-dominio.vercel.app/api/webhooks/stripe`
4. **Eventos:** `checkout.session.completed`

### 3.2 Mercado Pago (Dashboard)
1. Vá em **Suas Integrações > Notificações IPN/Webhooks**.
2. **URL de produção:** `https://seu-dominio.vercel.app/api/webhooks/mercadopago`
3. **Eventos:** `payment.created`, `payment.updated`

### 3.3 Execução do Seed (Admin Inicial)
Após o primeiro deploy bem-sucedido, você precisa popular o banco com os dados iniciais e o usuário admin. Execute localmente apontando para o banco de produção ou via script na Vercel:

```bash
npx prisma db seed
```
*Isto criará o usuário admin definido nas variáveis de ambiente e as configurações de White Label iniciais.*

---

## 4. Verificação Pós-Deploy

### ✅ Checklist de Validação
- [ ] **Acesso Admin**: Tente logar em `/admin` com as credenciais do SEED.
- [ ] **White Label (Logo)**: Vá em Configurações, altere a Logo via Cloudinary e verifique se ela atualiza em tempo real no Header.
- [ ] **SSL/HTTPS**: Verifique se o cadeado está ativo no domínio.
- [ ] **Pixels de Marketing**: 
    - Use a extensão **Meta Pixel Helper** para ver se o ID configurado no Admin está disparando o evento `PageView`.
    - Use o **Tag Assistant** para validar o GTM.
- [ ] **Checkout**: Realize um teste de compra com os gateways em modo "Test" antes de virar para "Live".

---

> [!TIP]
> **Dica de Senior DevOps:** Sempre mantenha o `prisma/schema.prisma` sincronizado. Se adicionar um novo modelo, lembre-se de rodar `npx prisma migrate dev` localmente e o deploy da Vercel cuidará do `migrate deploy` automaticamente.
