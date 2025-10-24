'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sair
            </button>
          </div>
          
          <div className="space-y-4">
            <p>Bem-vindo, {session?.user?.name}!</p>
            <p>Email: {session?.user?.email}</p>
            <p>ID: {(session?.user as any)?.id}</p>
            <p>Tenant ID: {(session?.user as any)?.tenantId}</p>
            <p>Role: {(session?.user as any)?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}