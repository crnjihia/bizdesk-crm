'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { setCurrentOrg } from '@/lib/tenant';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function recordMpesaPayment(orgId: string, invoiceId: string, amount: number, mpesaRef: string) {
  await requireRole(orgId, ['owner', 'admin', 'member']);

  return setCurrentOrg(orgId, async () => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) throw new Error('Invoice not found');

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: new Prisma.Decimal(amount),
        method: 'mpesa',
        ref: mpesaRef.trim().toUpperCase(),
        paidAt: new Date(),
      },
    });

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        mpesaRef: mpesaRef.trim().toUpperCase(),
      },
    });

    await prisma.activityLog.create({
      data: {
        organizationId: orgId,
        action: 'mpesa_payment_recorded',
        entityType: 'payment',
        entityId: payment.id,
        metadata: {
          invoiceNumber: invoice.number,
          amount,
          mpesaRef: mpesaRef.trim().toUpperCase(),
        },
      },
    });

    revalidatePath(`/org/[slug]/invoices/${invoiceId}`, 'page');
    return payment;
  });
}
