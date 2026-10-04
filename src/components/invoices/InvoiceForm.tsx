'use client';

import { useState } from 'react';

interface Props {
  orgSlug: string;
  clients: Array<{ id: string; name: string }>;
}

export default function InvoiceForm({ orgSlug, clients }: Props) {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addLine = () => setLines([...lines, { description: '', quantity: 1, unitPrice: 0 }]);
  const updateLine = (i: number, field: string, val: any) => {
    const updated = [...lines];
    (updated[i] as any)[field] = field === 'description' ? val : Number(val);
    setLines(updated);
  };

  const total = lines.reduce((acc, l) => acc + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, dueDate, notes, lines }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create invoice');
      window.location.href = `/org/${orgSlug}/invoices`;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-slate-900 border border-slate-800 p-6 rounded-xl">
      {error && <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-sm rounded">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Client</label>
          <select
            name="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
          >
            <option value="">Select client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Due Date</label>
          <input
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs uppercase text-slate-400">Line Items</label>
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              placeholder="Description"
              value={line.description}
              onChange={(e) => updateLine(idx, 'description', e.target.value)}
              required
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Qty"
              value={line.quantity}
              onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
              className="w-20 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Unit Price"
              value={line.unitPrice || ''}
              onChange={(e) => updateLine(idx, 'unitPrice', e.target.value)}
              className="w-32 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
            />
          </div>
        ))}
        <button type="button" onClick={addLine} className="text-xs text-emerald-400 hover:underline">
          + Add another item
        </button>
      </div>

      <div>
        <label className="block text-xs uppercase text-slate-400 mb-1">Notes / Payment Terms</label>
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Lipa na M-Pesa Buy Goods Till 123456 or Bank Transfer..."
          rows={2}
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <div className="text-sm text-slate-400">Total: <strong className="text-emerald-400 font-mono text-lg">KES {total.toLocaleString()}</strong></div>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-sm transition">
          {loading ? 'Generating...' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}
