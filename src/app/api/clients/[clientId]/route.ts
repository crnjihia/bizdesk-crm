import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { clientSchema } from '@/lib/validators/client';

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.clientId },
  });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(request: Request, { params }: { params: { clientId: string } }) {
  try {
    const body = await request.json();
    const data = clientSchema.partial().parse(body);

    const client = await prisma.client.update({
      where: { id: params.clientId },
      data,
    });
    return NextResponse.json(client);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
