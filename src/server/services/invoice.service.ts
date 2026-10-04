import prisma from '@/lib/prisma';
import { setCurrentOrg } from '@/lib/tenant';
import { Prisma } from '@prisma/client';
import type { InvoiceInput } from '@/lib/validators/invoice';

export class InvoiceService {
  static async generateNumber(orgId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    const latest = await prisma.invoice.findFirst({
      where: { organizationId: orgId, number: { startsWith: prefix } },
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    let nextSeq = 1;
    if (latest?.number) {
      const parts = latest.number.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num)) nextSeq = num + 1;
    }
    return `${prefix}${nextSeq.toString().padStart(4, '0')}`;
  }

  static async create(orgId: string, data: InvoiceInput) {
    return setCurrentOrg(orgId, async () => {
      const number = await this.generateNumber(orgId);
      let total = new Prisma.Decimal(0);
      const lines = data.lines.map((l) => {
        const amt = new Prisma.Decimal(l.unitPrice).mul(l.quantity);
        total = total.add(amt);
        return {
          description: l.description,
          quantity: l.quantity,
          unitPrice: new Prisma.Decimal(l.unitPrice),
          amount: amt,
        };
      });

      return prisma.invoice.create({
        data: {
          organizationId: orgId,
          clientId: data.clientId,
          number,
          dueDate: new Date(data.dueDate),
          notes: data.notes,
          status: 'draft',
          total,
          lines: { create: lines },
        },
        include: { client: true, lines: true },
      });
    });
  }

  static async list(orgId: string) {
    return setCurrentOrg(orgId, async () => {
      return prisma.invoice.findMany({
        where: { organizationId: orgId },
        include: { client: true, lines: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  }
}
