'use server';

import { invoiceSchema, type InvoiceInput } from '@/lib/validators/invoice';
import { requireRole } from '@/lib/rbac';
import { InvoiceService } from '../services/invoice.service';
import { revalidatePath } from 'next/cache';

export async function listInvoices(orgId: string) {
  await requireRole(orgId, ['owner', 'admin', 'member']);
  return InvoiceService.list(orgId);
}

export async function createInvoice(orgId: string, data: InvoiceInput) {
  await requireRole(orgId, ['owner', 'admin', 'member']);
  const parsed = invoiceSchema.parse(data);
  const invoice = await InvoiceService.create(orgId, parsed);
  revalidatePath(`/org/[slug]/invoices`, 'page');
  return invoice;
}
