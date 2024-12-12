import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";

// Extender o PrismaAdapter para customizar a criação do usuário
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data: any) => {
    const { image, emailVerified, ...userData } = data;
    return await prisma.user.create({
      data: {
        ...userData,
        type: "cliente",
        role: "user",
        emailVerified: emailVerified || null
      }
    });
  }
} as Adapter;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: customPrismaAdapter,
  debug: true, // Habilitar logs de debug
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback:', { user, account, profile });
      return true;
    },
    async session({ session, user }) {
      console.log('Session Callback - Input:', { 
        sessionData: session, 
        userData: user 
      });
      
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'user';
        session.user.type = user.type || 'cliente';
      }
      
      console.log('Session Callback - Output:', { 
        modifiedSession: session 
      });
      
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log('JWT Callback:', { token, user, account, profile });
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Se a URL for relativa (começar com /), adicione o baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Se a URL for do mesmo domínio, permita
      else if (url.startsWith(baseUrl)) {
        return url;
      }
      // Por padrão, redirecione para a página inicial
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login', // Página de erro de autenticação
  }
});

export { handler as GET, handler as POST };
