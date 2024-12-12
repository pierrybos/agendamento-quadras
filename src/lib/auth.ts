import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt";

// Extender o PrismaAdapter para customizar a criação do usuário
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data: any) => {
    const { emailVerified, ...userData } = data;
    
    // Verifica se é um registro de empresa pela URL atual
    const isEmpresa = global?.window?.location?.pathname?.includes('/register/empresa');
    
    return await prisma.user.create({
      data: {
        ...userData,
        type: isEmpresa ? "empresa" : "cliente",
        emailVerified: emailVerified || null,
        role: "user"
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        type: true,
        role: true
      }
    });
  },
  getUser: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        type: true,
        role: true
      }
    });
  },
  getUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        type: true,
        role: true
      }
    });
  },
  getUserByAccount: async ({ providerAccountId, provider }: { providerAccountId: string, provider: string }) => {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          providerAccountId,
          provider,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            type: true,
            role: true
          }
        }
      }
    });
    return account?.user ?? null;
  }
} as Adapter;

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            type: true,
            role: true
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          role: user.role
        };
      }
    }),
  ],
  adapter: customPrismaAdapter,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback:', { user, account, profile });
      // Se for login com Google em /register/empresa, marcar como empresa
      if (account?.provider === "google") {
        const isEmpresa = global?.window?.location?.pathname?.includes('/register/empresa');
        if (isEmpresa) {
          await prisma.user.update({
            where: { email: user.email! },
            data: { type: "empresa" },
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              image: true,
              type: true,
              role: true
            }
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.type = user.type;
        session.user.role = user.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  debug: true,
  session: {
    strategy: "database"
  }
};
