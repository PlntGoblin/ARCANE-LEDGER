import type { NextAuthConfig } from 'next-auth';

// Edge-safe subset of the Auth.js config. Middleware (which runs on the Edge
// runtime) imports NextAuth(authConfig) from this file — importing the full
// auth.ts would drag in bcryptjs and the Prisma client, neither of which run
// on the Edge.
export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.name = user.name;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token?.id && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        session.user.name = (token.name as string) ?? session.user.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
