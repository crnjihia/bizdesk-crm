import prisma from '@/lib/prisma';
import { setCurrentOrg } from '@/lib/tenant';
import type { ClientInput } from '@/lib/validators/client';

export class ClientService {
  static async list(orgId: string, search?: string) {
    return setCurrentOrg(orgId, async () => {
      const where: any = { organizationId: orgId, archived: false };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
        ];
      }
      return prisma.client.findMany({ where, orderBy: { createdAt: 'desc' } });
    });
  }

  static async create(orgId: string, data: ClientInput) {
    return setCurrentOrg(orgId, async () => {
      return prisma.client.create({ data: { ...data, organizationId: orgId } });
    });
  }

  static async update(orgId: string, id: string, data: Partial<ClientInput>) {
    return setCurrentOrg(orgId, async () => {
      return prisma.client.update({ where: { id }, data });
    });
  }

  static async archive(orgId: string, id: string) {
    return setCurrentOrg(orgId, async () => {
      return prisma.client.update({ where: { id }, data: { archived: true } });
    });
  }
}
