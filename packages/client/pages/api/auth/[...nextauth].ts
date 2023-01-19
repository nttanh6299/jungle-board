import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import GitHubProvider from 'next-auth/providers/github'
import { ReqUser, signIn } from 'apis/auth'

export const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const loggedUser: ReqUser = {
          name: user.name,
          email: user.email || '',
          image: user.image,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        }
        const { data } = await signIn(loggedUser)
        user.id = data?.user?.id
        if (data?.accessToken) {
          user.accessToken = data.accessToken
        }
        return true
      } catch (_) {
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.id = token.id
      delete session.user
      return session
    },
  },
}

export default NextAuth(nextAuthOptions)
