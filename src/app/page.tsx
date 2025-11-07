import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Se está autenticado, redireciona para dashboard
  if (session) {
    redirect('/dashboard')
  }

  // Se não está autenticado, redireciona para login
  redirect('/login')
}