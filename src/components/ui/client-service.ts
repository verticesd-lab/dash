import { PrismaClient } from '@prisma/client';
import { CreateClientData, UpdateClientData, PaginationParams, PaginatedResponse } from '@/types';

const prisma = new PrismaClient();

export class ClientService {
  async createClient(data: CreateClientData, tenantId: string) {
    try {
      const client = await prisma.client.create({
        data: {
          ...data,
          tenantId
        }
      });
      
      return { success: true, data: client };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  async getClients(tenantId: string, params: PaginationParams = {}) {
    try {
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const skip = (page - 1) * pageSize;
      
      const where: any = { tenantId };
      
      if (params.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
          { phone: { contains: params.search, mode: 'insensitive' } }
        ];
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.client.count({ where })
      ]);

      const response: PaginatedResponse<any> = {
        data: clients,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      };

      return { success: true, data: response };
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  async getClientById(id: string, tenantId: string) {
    try {
      const client = await prisma.client.findFirst({
        where: { 
          id,
          tenantId 
        }
      });

      if (!client) {
        return { success: false, error: 'Cliente não encontrado' };
      }

      return { success: true, data: client };
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  async updateClient(id: string, data: UpdateClientData, tenantId: string) {
    try {
      // Verificar se o cliente existe e pertence ao tenant
      const existingClient = await prisma.client.findFirst({
        where: { id, tenantId }
      });

      if (!existingClient) {
        return { success: false, error: 'Cliente não encontrado' };
      }

      const client = await prisma.client.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      return { success: true, data: client };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  async deleteClient(id: string, tenantId: string) {
    try {
      // Verificar se o cliente existe e pertence ao tenant
      const existingClient = await prisma.client.findFirst({
        where: { id, tenantId }
      });

      if (!existingClient) {
        return { success: false, error: 'Cliente não encontrado' };
      }

      await prisma.client.delete({
        where: { id }
      });

      return { success: true, message: 'Cliente deletado com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      
      if (error instanceof Error && error.message.includes('Foreign key constraint')) {
        return { 
          success: false, 
          error: 'Não é possível deletar cliente com registros associados' 
        };
      }

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }
}

export const clientService = new ClientService();