import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

// Versão leve do auth para o middleware (sem bcrypt, sem prisma)
// Usada apenas para verificar a sessão JWT
export const { auth: middlewareAuth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: () => null, // Não usamos no middleware
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
})

export { middlewareAuth as auth }
