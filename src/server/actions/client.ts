'use server';

import { clientSchema, type ClientInput } from '@/lib/validators/client';
import { requireRole } from '@/lib/rbac';
import { ClientService } from '../services/client.service';
import { revalidatePath } from 'next/cache';

export async function listClients(orgId: string, search?: string) {
  await requireRole(orgId, ['owner', 'admin', 'member']);
  return ClientService.list(orgId, search);
}

export async function createClient(orgId: string, data: ClientInput) {
  await requireRole(orgId, ['owner', 'admin']);
  const parsed = clientSchema.parse(data);
  const client = await ClientService.create(orgId, parsed);
  revalidatePath(`/org/[slug]/clients`, 'page');
  return client;
}

export async function updateClient(orgId: string, clientId: string, data: Partial<ClientInput>) {
  await requireRole(orgId, ['owner', 'admin']);
  const parsed = clientSchema.partial().parse(data);
  const client = await ClientService.update(orgId, clientId, parsed);
  revalidatePath(`/org/[slug]/clients`, 'page');
  return client;
}

export async function archiveClient(orgId: string, clientId: string) {
  await requireRole(orgId, ['owner', 'admin']);
  const client = await ClientService.archive(orgId, clientId);
  revalidatePath(`/org/[slug]/clients`, 'page');
  return client;
}
