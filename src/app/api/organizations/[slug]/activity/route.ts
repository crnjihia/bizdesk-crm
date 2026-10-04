import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  if (!org) return NextResponse.json([], { status: 200 });

  const activities = await prisma.activityLog.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' },
    take: 15,
  });

  return NextResponse.json(activities);
}
