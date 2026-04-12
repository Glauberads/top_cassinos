import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import { prisma } from '@/lib/db'
import { hexToHsl } from '@/lib/utils'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })

  return {
    title: {
      default: settings?.siteName || settings?.seoTitle || 'Top Cassinos',
      template: `%s | ${settings?.siteName || 'Top Cassinos'}`,
    },
    description:
      settings?.seoDescription ||
      'Sistemas de cassino, jogos e entretenimento prontos para lançar. Sem código, sem complicação.',
    icons: settings?.faviconUrl ? [{ rel: 'icon', url: settings.faviconUrl }] : undefined,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: 'https://topcassinos.com.br',
      siteName: settings?.siteName || 'Top Cassinos',
      title: settings?.seoTitle || 'Top Cassinos',
      description: settings?.seoDescription,
      images: settings?.logoUrl ? [settings.logoUrl] : undefined,
    },
  }
}

import { ToastProvider } from '@/components/ToastProvider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })

  // Fallbacks
  const primaryHex = settings?.primaryColor || '#fbbf24'
  const secondaryHex = settings?.secondaryColor || '#000000'
  const primaryHsl = hexToHsl(primaryHex)
  const secondaryHsl = hexToHsl(secondaryHex)

  return (
    <html lang="pt-BR" className="dark">
      <head>
        <style id="dynamic-branding">{`
          :root {
            --primary: ${primaryHsl} !important;
            --ring: ${primaryHsl} !important;
            --brand-primary: ${primaryHex};
            --brand-secondary: ${secondaryHex};
          }
          
          .gradient-text {
            background: linear-gradient(to right, ${primaryHex}, color-mix(in srgb, ${primaryHex}, white 20%)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
          }

          .glow-amber {
            box-shadow: 0 0 40px color-mix(in srgb, ${primaryHex}, transparent 85%) !important;
          }
        `}</style>
        {settings?.gtmId && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.gtmId}');`}
          </Script>
        )}
        {settings?.metaPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.metaPixelId}');
            fbq('track', 'PageView');`}
          </Script>
        )}
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
