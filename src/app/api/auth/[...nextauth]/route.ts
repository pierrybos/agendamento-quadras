import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Importação do Prisma Client

const options = {
  adapter: PrismaAdapter(prisma), // Integração com o Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Modificando a sessão para incluir dados adicionais
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role; // Role: admin, gerente, cliente
      session.user.companyId = user.companyId || null; // Empresa associada (se gerente/cliente)
      return session;
    },
    // Define a role ao criar ou autenticar usuários
    async signIn({ user, account, profile }) {
      if (!user.role || user.role === '') {
        // Se o usuário não tiver role, define como 'cliente'
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "cliente" },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin", // Página personalizada de login
  },
  secret: process.env.NEXTAUTH_SECRET, // Defina o segredo para a segurança da sessão
};

const handler = NextAuth(options);

// Exportando os métodos GET e POST para o NextAuth
export { handler as GET, handler as POST };
