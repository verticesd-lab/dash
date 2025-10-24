// src/app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// Este componente envolve a sua aplicação para que os componentes clientes
// possam usar o hook useSession() e saber quem está logado.

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}