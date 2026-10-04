import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function InvoiceDetailPage({
  params,
}: {
  params: { slug: string; invoiceId: string };
}) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.invoiceId },
    include: { client: true, lines: true, payments: true },
  });

  if (!invoice) notFound();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white font-mono">{invoice.number}</h1>
            <div className="px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase">
              Status: {invoice.status}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">Billed to: <strong className="text-slate-200">{invoice.client?.name}</strong></p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-medium transition"
          >
            Download PDF
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-800 text-sm">
          <div>
            <span className="text-xs uppercase text-slate-500 block">Status</span>
            <span className="font-semibold text-emerald-400 uppercase tracking-wider">{invoice.status}</span>
          </div>
          <div>
            <span className="text-xs uppercase text-slate-500 block">Due Date</span>
            <span className="text-slate-300">{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-xs uppercase text-slate-500 block">Currency</span>
            <span className="text-slate-300">{invoice.currency}</span>
          </div>
          <div>
            <span className="text-xs uppercase text-slate-500 block">Total Amount</span>
            <span className="font-mono text-emerald-400 font-bold">KES {Number(invoice.total).toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">Line Items</h3>
          <table className="w-full text-left text-sm border-t border-slate-800">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2">Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {invoice.lines.map((l) => (
                <tr key={l.id}>
                  <td className="py-2.5">{l.description}</td>
                  <td className="py-2.5 text-center">{l.quantity}</td>
                  <td className="py-2.5 text-right font-mono">KES {Number(l.unitPrice).toLocaleString()}</td>
                  <td className="py-2.5 text-right font-mono text-emerald-400">KES {Number(l.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
