import prisma from '@/lib/prisma';
import InvoiceList from '@/components/invoices/InvoiceList';

export default async function InvoicesPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  const invoices = org
    ? await prisma.invoice.findMany({
        where: { organizationId: org.id },
        include: { client: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Invoices & Billing</h1>
        <p className="text-sm text-slate-400">Issue invoices, monitor status, and track payments</p>
      </div>
      <InvoiceList orgSlug={params.slug} invoices={invoices as any} />
    </div>
  );
}
