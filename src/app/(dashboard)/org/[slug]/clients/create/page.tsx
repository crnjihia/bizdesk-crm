import ClientForm from '@/components/clients/ClientForm';

export default function CreateClientPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Add New Client</h1>
        <p className="text-sm text-slate-400">Register a new client or corporate entity for billing</p>
      </div>
      <ClientForm orgSlug={params.slug} />
    </div>
  );
}
