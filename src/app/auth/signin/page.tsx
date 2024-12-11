"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    // Busca os provedores configurados no NextAuth
    getProviders().then((res) => setProviders(res));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Bem-vindo ao Sistema de Quadras
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Faça login para continuar
        </p>

        {providers &&
          Object.values(providers).map((provider: any) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition mb-4"
            >
              Entrar com {provider.name}
            </button>
          ))}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Ao continuar, você concorda com nossos{" "}
            <a href="/terms" className="text-blue-500 hover:underline">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="/privacy" className="text-blue-500 hover:underline">
              Política de Privacidade
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
