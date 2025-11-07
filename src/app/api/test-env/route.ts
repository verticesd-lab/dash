import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT_SET'
  
  // Esconde a senha por segurança
  const safeUrl = dbUrl.replace(/:[^@]+@/, ':****@')
  
  return NextResponse.json({
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_length: dbUrl.length,
    DATABASE_URL_safe: safeUrl,
    DATABASE_URL_raw_first_100: dbUrl.substring(0, 100),
    DIRECT_URL_exists: !!process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    all_env_keys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('NEXTAUTH')),
  })
}
