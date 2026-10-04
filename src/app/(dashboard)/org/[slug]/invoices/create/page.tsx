import prisma from '@/lib/prisma';
import InvoiceForm from '@/components/invoices/InvoiceForm';

export default async function CreateInvoicePage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  const clients = org
    ? await prisma.client.findMany({
        where: { organizationId: org.id, archived: false },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      })
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Invoice</h1>
        <p className="text-sm text-slate-400">Generate itemized KES invoice with automatic numbering</p>
      </div>
      <InvoiceForm orgSlug={params.slug} clients={clients} />
    </div>
  );
}
