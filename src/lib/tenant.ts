import { AsyncLocalStorage } from 'node:async_hooks';
import prisma from './prisma';

type OrgContext = { orgId: string | null };
const orgStorage = new AsyncLocalStorage<OrgContext>();

/**
 * Bind an organization ID to the current asynchronous execution context.
 */
export async function setCurrentOrg<T>(orgId: string, fn: () => Promise<T>): Promise<T> {
  return orgStorage.run({ orgId }, fn);
}

export const runWithTenant = setCurrentOrg;

/**
 * Retrieve the current organization ID from the async storage context.
 */
export function getCurrentOrgId(): string | null {
  return orgStorage.getStore()?.orgId ?? null;
}

const TENANT_MODELS = ['Client', 'Invoice', 'ActivityLog', 'Membership'];

/**
 * Prisma middleware for strict multi-tenant isolation.
 * Automatically injects `where: { organizationId: currentOrgId }` into queries
 * and sets `data.organizationId = currentOrgId` on creation.
 */
export function tenantMiddleware(params: any, next: (args: any) => any) {
  const orgId = getCurrentOrgId();

  if (!orgId || !TENANT_MODELS.includes(params.model)) {
    return next(params);
  }

  const action = params.action;

  if (action === 'create') {
    if (!params.args) params.args = {};
    if (!params.args.data) params.args.data = {};
    params.args.data.organizationId = orgId;
    return next(params);
  }

  if (action === 'createMany') {
    if (params.args?.data) {
      if (Array.isArray(params.args.data)) {
        params.args.data = params.args.data.map((item: any) => ({
          ...item,
          organizationId: orgId,
        }));
      } else {
        params.args.data.organizationId = orgId;
      }
    }
    return next(params);
  }

  // Read actions
  if (['findMany', 'findFirst', 'count', 'aggregate', 'groupBy'].includes(action)) {
    if (!params.args) params.args = {};
    params.args.where = {
      ...params.args.where,
      organizationId: orgId,
    };
    return next(params);
  }

  // findUnique can leak across tenants if querying by primary key alone.
  // Transform to findFirst with organizationId filter to ensure isolation.
  if (action === 'findUnique') {
    params.action = 'findFirst';
    if (!params.args) params.args = {};
    params.args.where = {
      ...params.args.where,
      organizationId: orgId,
    };
    return next(params);
  }

  // Write/Delete actions
  if (['update', 'updateMany', 'delete', 'deleteMany'].includes(action)) {
    if (!params.args) params.args = {};
    params.args.where = {
      ...params.args.where,
      organizationId: orgId,
    };
    return next(params);
  }

  return next(params);
}

// Attach middleware to Prisma client singleton
try {
  prisma.$use(tenantMiddleware);
} catch {
  // Gracefully handle environments where client is mocked
}

export { prisma as tenantPrisma };
