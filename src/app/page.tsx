'use client';

import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se usuário está logado
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1>Bem-vindo ao Micro SaaS</h1>
        <p>Faça login para acessar o sistema</p>
        <a 
          href="/auth/login" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            backgroundColor: 'blue', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}
        >
          Fazer Login
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard - Micro SaaS</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>

      <div style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: 'green' }}>✅ SISTEMA FUNCIONANDO!</h2>
        <p><strong>Nome:</strong> {(user as any)?.name}</p>
        <p><strong>Email:</strong> {(user as any)?.email}</p>
        <p><strong>ID:</strong> {(user as any)?.id}</p>
        <p><strong>Tenant:</strong> {(user as any)?.tenantId}</p>
        <p><strong>Role:</strong> {(user as any)?.role}</p>
      </div>
    </div>
  );
}