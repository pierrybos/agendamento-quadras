import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // Página de login
  },
  callbacks: {
    authorized({ token }) {
      return !!token; // Permite acesso se o token existir
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"], // Protege as rotas que começam com /admin
};
