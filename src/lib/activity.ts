import prisma from '@/lib/prisma';

export async function logActivity(data: {
  organizationId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
}) {
  try {
    return await prisma.activityLog.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId || null,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata,
      },
    });
  } catch (err) {
    console.error('Failed to record activity log:', err);
    return null;
  }
}
