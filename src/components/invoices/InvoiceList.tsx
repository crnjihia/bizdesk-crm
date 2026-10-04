'use client';

import Link from 'next/link';

interface Invoice {
  id: string;
  number: string;
  total: any;
  status: string;
  dueDate: string;
  client: { name: string };
}

export default function InvoiceList({ orgSlug, invoices }: { orgSlug: string; invoices: Invoice[] }) {
  const getBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-600/40';
      case 'sent':
        return 'bg-blue-950/80 text-blue-400 border-blue-600/40';
      case 'overdue':
        return 'bg-red-950/80 text-red-400 border-red-600/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">All Invoices</h2>
        <Link
          href={`/org/${orgSlug}/invoices/create`}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition"
        >
          Add Invoice
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Invoice #</th>
              <th className="p-3">Client</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No invoices created yet. Click &quot;Add Invoice&quot; to issue your first invoice.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-medium text-white">{inv.number}</td>
                  <td className="p-3 text-slate-300">{inv.client?.name}</td>
                  <td className="p-3 font-mono text-emerald-400">KES {Number(inv.total).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs border uppercase tracking-wider font-semibold ${getBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link href={`/org/${orgSlug}/invoices/${inv.id}`} className="text-emerald-400 hover:underline text-xs">
                      View
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
