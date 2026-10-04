import prisma from '@/lib/prisma';

/**
 * Automated cron/background task to detect and mark overdue invoices.
 * Any invoice in 'sent' status past its dueDate is automatically updated to 'overdue'.
 */
export async function detectAndMarkOverdueInvoices() {
  const now = new Date();

  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      status: 'sent',
      dueDate: { lt: now },
    },
    select: { id: true, number: true, organizationId: true },
  });

  if (overdueInvoices.length === 0) return { updatedCount: 0 };

  const result = await prisma.invoice.updateMany({
    where: {
      id: { in: overdueInvoices.map((inv) => inv.id) },
    },
    data: {
      status: 'overdue',
    },
  });

  return { updatedCount: result.count, invoices: overdueInvoices };
}
