'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testApi = async () => {
    setLoading(true);
    setMessage('Testando...');
    
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: 'Cliente Teste ' + new Date().getTime(),
          email: 'teste' + new Date().getTime() + '@email.com',
          phone: '(11) 99999-9999',
          address: 'Rua Teste, 123'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ CLIENTE CRIADO! ID: ' + data.data.id);
      } else {
        setMessage('❌ ERRO: ' + data.error);
      }
    } catch (error: any) {
      setMessage('❌ ERRO: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h1 className="text-2xl font-bold mb-2">🎉 SISTEMA CONECTADO!</h1>
      <p className="text-green-600 font-semibold mb-4">API /api/clientes funcionando!</p>
      
      <div className="bg-gray-50 p-4 rounded mb-6">
        <button 
          onClick={testApi}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 font-semibold disabled:bg-gray-400"
        >
          {loading ? '🔄 Testando...' : '🚀 Testar API Client'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded text-center ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4">
        <p><strong>Rota:</strong> POST /api/clientes</p>
        <p><strong>Banco:</strong> Supabase</p>
      </div>
    </div>
  );
}