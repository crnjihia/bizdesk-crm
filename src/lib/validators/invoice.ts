import { z } from 'zod';

export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().min(0),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  lines: z.array(invoiceLineSchema).min(1, 'At least one line item required'),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceLineInput = z.infer<typeof invoiceLineSchema>;
