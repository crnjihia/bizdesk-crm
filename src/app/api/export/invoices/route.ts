import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Parser } from 'json2csv';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgSlug = searchParams.get('slug');
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    if (!orgSlug) {
      return NextResponse.json({ error: 'Organization slug required' }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({
      where: { slug: orgSlug },
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (org.plan === 'free') {
      return NextResponse.json(
        { error: 'Bulk CSV export requires a Pro or Enterprise plan.' },
        { status: 403 },
      );
    }

    const where: any = { organizationId: org.id };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });

    const exportRows = invoices.map((inv) => ({
      InvoiceNumber: inv.number,
      Client: inv.client.name,
      ClientEmail: inv.client.email || '',
      Status: inv.status,
      Currency: inv.currency,
      TotalAmount: Number(inv.total),
      IssueDate: new Date(inv.issueDate).toISOString().split('T')[0],
      DueDate: new Date(inv.dueDate).toISOString().split('T')[0],
      MpesaRef: inv.mpesaRef || '',
    }));

    const json2csvParser = new Parser({
      fields: ['InvoiceNumber', 'Client', 'ClientEmail', 'Status', 'Currency', 'TotalAmount', 'IssueDate', 'DueDate', 'MpesaRef'],
    });
    const csv = json2csvParser.parse(exportRows);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="invoices-${orgSlug}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
