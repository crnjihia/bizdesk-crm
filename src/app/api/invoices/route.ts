import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { invoiceSchema } from '@/lib/validators/invoice';
import { InvoiceService } from '@/server/services/invoice.service';
import { cookies } from 'next/headers';

export async function GET(_request: Request) {
  const cookieStore = cookies();
  let orgId = cookieStore.get('orgId')?.value;
  if (!orgId) {
    const org = await prisma.organization.findFirst();
    orgId = org?.id;
  }
  if (!orgId) return NextResponse.json([], { status: 200 });

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: orgId },
    include: { client: true, lines: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(invoices);
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
    const data = invoiceSchema.parse(body);

    const invoice = await InvoiceService.create(orgId, data);
    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
