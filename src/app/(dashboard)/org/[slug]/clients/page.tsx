import prisma from '@/lib/prisma';
import ClientList from '@/components/clients/ClientList';

export default async function ClientsPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  const clients = org
    ? await prisma.client.findMany({
        where: { organizationId: org.id, archived: false },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clients Directory</h1>
          <p className="text-sm text-slate-400">Manage client contacts, billing profiles, and accounts</p>
        </div>
      </div>
      <ClientList orgSlug={params.slug} initialClients={clients as any} />
    </div>
  );
}
