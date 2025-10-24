// src/app/layout.tsx

// Importa o componente que você acabou de criar
import { Providers } from './providers.tsx'; 
import './globals.css';
import { Inter } from 'next/font/google'; 

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Envolve o conteúdo principal no Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}