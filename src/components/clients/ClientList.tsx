'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

export default function ClientList({ orgSlug, initialClients }: { orgSlug: string; initialClients: Client[] }) {
  const [clients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <input
          type="text"
          placeholder="Search clients by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <Link
          href={`/org/${orgSlug}/clients/create`}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shrink-0"
        >
          Add Client
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Client Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Company</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No clients found. Click &quot;Add Client&quot; to register your first Kenyan business client.
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">{client.name}</td>
                  <td className="p-3 text-slate-400">{client.email || '—'}</td>
                  <td className="p-3 text-slate-400">{client.phone || '—'}</td>
                  <td className="p-3 text-slate-400">{client.company || '—'}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/org/${orgSlug}/clients/${client.id}`}
                      className="text-emerald-400 hover:underline text-xs"
                    >
                      View / Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
