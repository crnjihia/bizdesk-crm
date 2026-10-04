'use client';

import { useState } from 'react';
import { recordMpesaPayment } from '@/server/actions/payment';

interface Props {
  orgId: string;
  invoiceId: string;
  invoiceNumber: string;
  expectedAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MpesaPaymentModal({
  orgId,
  invoiceId,
  invoiceNumber,
  expectedAmount,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [ref, setRef] = useState('');
  const [amount, setAmount] = useState(expectedAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setError('');

    try {
      await recordMpesaPayment(orgId, invoiceId, amount, ref);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record M-Pesa payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            M
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Record M-Pesa Payment</h3>
            <p className="text-xs text-slate-400">Reconcile {invoiceNumber}</p>
          </div>
        </div>

        {error && <div className="p-2.5 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">M-Pesa Confirmation Code</label>
            <input
              type="text"
              placeholder="e.g. QHD827K9P1"
              value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-emerald-400 font-mono text-sm tracking-wider focus:border-emerald-500 uppercase outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Amount Paid (KES)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white font-mono text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-lg shadow-emerald-900/30"
            >
              {loading ? 'Reconciling...' : 'Confirm & Mark Paid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
