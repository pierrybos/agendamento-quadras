import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      type?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    type?: string
    role?: string
  }
}
