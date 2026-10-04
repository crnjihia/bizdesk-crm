import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { clientSchema } from '@/lib/validators/client';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const orgId = cookieStore.get('orgId')?.value;
  if (!orgId) return NextResponse.json({ error: 'Org context required' }, { status: 400 });

  const clients = await prisma.client.findMany({
    where: { organizationId: orgId, archived: false },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    let orgId = cookieStore.get('orgId')?.value;

    if (!orgId) {
      const org = await prisma.organization.findFirst();
      orgId = org?.id;
    }
    if (!orgId) return NextResponse.json({ error: 'Organization required' }, { status: 400 });

    const body = await request.json();
    const data = clientSchema.parse(body);

    const client = await prisma.client.create({
      data: {
        ...data,
        organizationId: orgId,
      },
    });
    return NextResponse.json(client);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
