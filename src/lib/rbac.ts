import prisma from './prisma';
import { auth } from './auth';
import type { Role } from '@prisma/client';

/**
 * Role-Based Access Control helper.
 * Enforces that the current authenticated user has an acceptable role within the target organization.
 */
export async function requireRole(orgId: string, allowedRoles: Role[]) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Unauthenticated');
  }

  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: orgId,
      user: { email: session.user.email },
    },
    select: { id: true, role: true, userId: true },
  });

  if (!membership) {
    throw new Error('No membership found for this organization');
  }

  if (!allowedRoles.includes(membership.role as Role)) {
    throw new Error('Forbidden: insufficient role');
  }

  return membership;
}

/**
 * Check if the current authenticated user has one of the specified roles in an organization.
 */
export async function hasRole(orgId: string, allowedRoles: Role[]): Promise<boolean> {
  try {
    await requireRole(orgId, allowedRoles);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current user's membership record for an organization.
 */
export async function getOrgMembership(orgId: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  return prisma.membership.findFirst({
    where: {
      organizationId: orgId,
      user: { email: session.user.email },
    },
    include: {
      user: true,
      organization: true,
    },
  });
}
