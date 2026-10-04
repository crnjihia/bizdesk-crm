import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function SettingsPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
  });

  if (!org) notFound();

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
        <p className="text-sm text-slate-400">Configure business identity, default currency, and contact info</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Business Name</label>
          <input
            defaultValue={org.name}
            disabled
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Workspace Slug</label>
          <input
            defaultValue={org.slug}
            disabled
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-emerald-400 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Default Invoicing Currency</label>
          <input
            defaultValue="KES (Kenyan Shilling)"
            disabled
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
