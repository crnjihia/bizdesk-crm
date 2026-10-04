import prisma from '@/lib/prisma';

export const PLAN_LIMITS = {
  free: {
    maxClients: 5,
    maxInvoicesPerMonth: 10,
    maxSeats: 1,
    bulkExport: false,
  },
  pro: {
    maxClients: Infinity,
    maxInvoicesPerMonth: Infinity,
    maxSeats: 5,
    bulkExport: true,
  },
  enterprise: {
    maxClients: Infinity,
    maxInvoicesPerMonth: Infinity,
    maxSeats: Infinity,
    bulkExport: true,
  },
};

export async function enforceClientLimit(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { plan: true },
  });
  if (!org) throw new Error('Organization not found');

  if (org.plan === 'free') {
    const count = await prisma.client.count({
      where: { organizationId: orgId, archived: false },
    });
    if (count >= PLAN_LIMITS.free.maxClients) {
      throw new Error('Free plan limit reached: max 5 active clients. Upgrade to Pro for unlimited clients.');
    }
  }
}

export async function enforceInvoiceLimit(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { plan: true },
  });
  if (!org) throw new Error('Organization not found');

  if (org.plan === 'free') {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const count = await prisma.invoice.count({
      where: {
        organizationId: orgId,
        createdAt: { gte: startOfMonth },
        status: { not: 'cancelled' },
      },
    });
    if (count >= PLAN_LIMITS.free.maxInvoicesPerMonth) {
      throw new Error('Free plan limit reached: max 10 invoices per month. Upgrade to Pro for unlimited invoices.');
    }
  }
}

export async function enforceSeatLimit(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { plan: true },
  });
  if (!org) throw new Error('Organization not found');

  const plan = (org.plan as keyof typeof PLAN_LIMITS) || 'free';
  const maxSeats = PLAN_LIMITS[plan]?.maxSeats ?? 1;

  const currentSeats = await prisma.membership.count({
    where: { organizationId: orgId },
  });

  if (currentSeats >= maxSeats) {
    throw new Error(`Team seat limit reached (${maxSeats} seats on ${plan} plan). Upgrade to add more members.`);
  }
}
