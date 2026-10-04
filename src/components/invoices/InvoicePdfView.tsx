'use client';

interface Props {
  invoice: {
    number: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    total: number;
    mpesaRef?: string | null;
    client: { name: string; email?: string | null };
    lines: Array<{ id: string; description: string; quantity: number; unitPrice: number; amount: number }>;
  };
}

export default function InvoicePdfView({ invoice }: Props) {
  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between border-b border-emerald-600 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-800">Biashara Invoice</h2>
          <p className="text-xs text-slate-500">Official Kenyan SME Tax Invoice</p>
        </div>
        <div className="text-right">
          <p className="font-mono font-bold text-lg">{invoice.number}</p>
          <p className="text-xs text-slate-500">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <strong className="text-slate-700">Client:</strong>
          <p className="font-semibold">{invoice.client.name}</p>
          <p className="text-slate-500">{invoice.client.email || ''}</p>
        </div>
        <div className="text-right">
          <strong className="text-slate-700">Payment Due:</strong>
          <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          {invoice.mpesaRef && <p className="text-emerald-700 font-mono text-xs">M-Pesa: {invoice.mpesaRef}</p>}
        </div>
      </div>

      <table className="w-full text-left text-sm border-t border-slate-200">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
            <th className="py-2 px-3">Item</th>
            <th className="py-2 px-3 text-center">Qty</th>
            <th className="py-2 px-3 text-right">Unit Price</th>
            <th className="py-2 px-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoice.lines.map((l) => (
            <tr key={l.id}>
              <td className="py-2 px-3">{l.description}</td>
              <td className="py-2 px-3 text-center">{l.quantity}</td>
              <td className="py-2 px-3 text-right font-mono">KES {Number(l.unitPrice).toLocaleString()}</td>
              <td className="py-2 px-3 text-right font-mono font-bold">KES {Number(l.amount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right pt-4 border-t border-slate-200">
        <p className="text-xs uppercase text-slate-500">Total Payable</p>
        <p className="text-2xl font-bold font-mono text-emerald-700">KES {Number(invoice.total).toLocaleString()}</p>
      </div>
    </div>
  );
}
