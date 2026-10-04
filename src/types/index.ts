import type { Role, InvoiceStatus, PaymentMethod } from '@prisma/client';

export type { Role, InvoiceStatus, PaymentMethod };

export interface OrganizationContext {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface ClientSummary {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
}
