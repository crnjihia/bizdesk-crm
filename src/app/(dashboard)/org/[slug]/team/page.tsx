import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function TeamPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: {
      memberships: { include: { user: true } },
    },
  });

  if (!org) notFound();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Team Members & RBAC</h1>
        <p className="text-sm text-slate-400">Manage organization staff and permission levels</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Member</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {org.memberships.map((m) => (
              <tr key={m.id}>
                <td className="p-3 font-medium text-white">{m.user.name || 'Staff User'}</td>
                <td className="p-3 text-slate-400">{m.user.email}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs uppercase font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {m.role}
                  </span>
                </td>
                <td className="p-3 text-right text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
