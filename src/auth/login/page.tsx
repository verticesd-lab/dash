'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Micro SaaS</h1>
          <p className="text-gray-600 mb-8">Faça login para acessar o sistema</p>
          <Link 
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard - Micro SaaS</h1>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sair
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>✅ SISTEMA DE AUTENTICAÇÃO FUNCIONANDO!</strong>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-lg mb-2">Informações do Usuário</h3>
                <p><strong>Nome:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>ID:</strong> {(session.user as any)?.id}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-bold text-lg mb-2">Permissões</h3>
                <p><strong>Tenant ID:</strong> {(session.user as any)?.tenantId}</p>
                <p><strong>Role:</strong> {(session.user as any)?.role}</p>
                <p><strong>Expira:</strong> {new Date(session.expires).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">Próximos Passos:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Criar CRUD de clientes</li>
                <li>Implementar multi-tenant</li>
                <li>Criar dashboard com métricas</li>
                <li>Configurar pagamentos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}