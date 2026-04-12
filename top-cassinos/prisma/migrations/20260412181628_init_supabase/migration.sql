-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "clientUrl" TEXT NOT NULL,
    "adminUrl" TEXT NOT NULL,
    "adminLogin" TEXT,
    "adminPassword" TEXT,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "companyName" TEXT NOT NULL DEFAULT 'Top Cassinos',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "seoTitle" TEXT NOT NULL DEFAULT 'Top Cassinos – Plataformas Prontas para Lucrar',
    "seoDescription" TEXT NOT NULL DEFAULT '',
    "siteName" TEXT NOT NULL DEFAULT 'Top Cassinos',
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#fbbf24',
    "secondaryColor" TEXT NOT NULL DEFAULT '#000000',
    "heroTitle" TEXT NOT NULL DEFAULT 'As melhores plataformas prontas para você lucrar',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Sistemas de cassino, jogos e entretenimento prontos para lançar. Sem código, sem complicação.',
    "faviconUrl" TEXT,
    "metaPixelId" TEXT,
    "gtmId" TEXT,
    "stripePublicKey" TEXT,
    "stripeSecretKey" TEXT,
    "mpPublicKey" TEXT,
    "mpAccessToken" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_slug_key" ON "Platform"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
