import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platformId, gateway } = body
    
    const platform = await prisma.platform.findUnique({
      where: { id: platformId }
    })

    if (!platform) {
      return NextResponse.json({ error: 'Plataforma não encontrada' }, { status: 404 })
    }

    const settings = await prisma.settings.findUnique({
      where: { id: 'default' }
    })

    if (!settings) {
      return NextResponse.json({ error: 'Configurações de pagamento não encontradas' }, { status: 500 })
    }

    // Amount could be dynamic based on platform in a real scenario
    const amount = 997.00 

    if (gateway === 'stripe') {
      if (!settings.stripeSecretKey) {
        return NextResponse.json({ error: 'Stripe não configurado no painel admin' }, { status: 400 })
      }
      
      const stripe = new Stripe(settings.stripeSecretKey)
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'brl',
            product_data: { 
              name: `Plataforma: ${platform.name}`,
              description: 'Licença de uso vitalícia'
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/plataforma/${platform.slug}`,
      })

      return NextResponse.json({ url: session.url })
    } 
    
    if (gateway === 'mercadopago') {
      if (!settings.mpAccessToken) {
        return NextResponse.json({ error: 'Mercado Pago não configurado no painel admin' }, { status: 400 })
      }

      const client = new MercadoPagoConfig({ accessToken: settings.mpAccessToken })
      const preference = new Preference(client)
      
      const result = await preference.create({
        body: {
          items: [{
            id: platform.id,
            title: `Plataforma: ${platform.name}`,
            quantity: 1,
            unit_price: amount,
            currency_id: 'BRL',
          }],
          back_urls: {
            success: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success`,
            failure: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/failure`,
            pending: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/pending`,
          },
          auto_return: 'approved',
        }
      })

      return NextResponse.json({ url: result.init_point })
    }

    return NextResponse.json({ error: 'Método de pagamento não suportado' }, { status: 400 })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Erro interno no checkout' }, { status: 500 })
  }
}
