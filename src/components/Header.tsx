'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Agendamento de Quadras</span>
            </Link>
          </div>

          {session?.user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}