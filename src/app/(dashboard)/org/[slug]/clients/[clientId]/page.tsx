import prisma from '@/lib/prisma';
import ClientForm from '@/components/clients/ClientForm';
import { notFound } from 'next/navigation';

export default async function ClientDetailPage({ params }: { params: { slug: string; clientId: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.clientId },
    include: { invoices: true },
  });

  if (!client) notFound();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{client.name}</h1>
        <p className="text-sm text-slate-400">Edit contact details and review invoice history</p>
      </div>
      <ClientForm orgSlug={params.slug} initialData={client} />
    </div>
  );
}
