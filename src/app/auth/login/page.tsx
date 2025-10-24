'use client';

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@exemplo.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simula login bem-sucedido
    setTimeout(() => {
      // Cria sessão manual no localStorage
      localStorage.setItem("user", JSON.stringify({
        id: "super-admin-id",
        email: email,
        name: "Super Admin",
        tenantId: "root",
        role: "SUPER_ADMIN",
      }));
      
      // Redireciona para dashboard
      window.location.href = "/";
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: 'blue', fontSize: '28px', marginBottom: '10px' }}>🔐 Fazer Login</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Sistema Micro SaaS</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ margin: '15px 0', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input 
              type="email" 
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ margin: '15px 0', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha:</label>
            <input 
              type="password" 
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: loading ? '#ccc' : 'blue', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? "⏳ Entrando..." : "🚀 Entrar no Sistema"}
          </button>
        </form>

        <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#0066cc' }}>
            <strong>Credenciais preenchidas automaticamente</strong><br/>
            Apenas clique em "Entrar no Sistema"
          </p>
        </div>
      </div>
    </div>
  );
}