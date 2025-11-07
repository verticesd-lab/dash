import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  console.log('🔵 POST /api/clientes - Iniciando...');
  console.log('🔍 Headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const session = await getServerSession(authOptions);
    console.log('🔍 Session:', session ? 'Existe' : 'Null');
    console.log('🔍 Session completa:', JSON.stringify(session, null, 2));
    
    if (!session) {
      console.log('❌ Sessão não encontrada - retornando 401');
      return NextResponse.json(
        { success: false, error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    const tenantId = (session.user as any).tenantId;
    const body = await request.json();
    console.log('Dados recebidos:', body);
    
    const { nome, email, telefone, cidade, estado } = body;

    if (!nome || !telefone) {
      return NextResponse.json(
        { success: false, error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar cliente
    const client = await prisma.cliente.create({
      data: {
        nome,
        email: email || null,
        telefone,
        cidade: cidade || null,
        estado: estado || null,
        empresaId: tenantId
      }
    });

    console.log('✅ CLIENTE CRIADO NO SUPABASE! ID:', client.id);
    
    return NextResponse.json({ 
      success: true, 
      data: client,
      message: 'Cliente salvo no Supabase com sucesso! 🎉'
    });
    
  } catch (error: any) {
    console.error('🔴 ERRO AO CRIAR CLIENTE:', error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Erro: ${error.message}` 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const clientes = await prisma.cliente.findMany({
      where: { empresaId: tenantId },
      include: {
        Empresa: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: clientes 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}