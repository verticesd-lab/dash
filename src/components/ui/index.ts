// Tipos base para o sistema
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: AuthPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum AuthPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum Status {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO'
}

// Tipos para forms e APIs
export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

// Tipos para paginação
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para sessão
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
}