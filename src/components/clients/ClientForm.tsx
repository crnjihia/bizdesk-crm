'use client';

import { useState } from 'react';

interface Props {
  orgSlug: string;
  initialData?: any;
  onSuccess?: () => void;
}

export default function ClientForm({ orgSlug, initialData, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    notes: initialData?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = initialData?.id ? `/api/clients/${initialData.id}` : '/api/clients';
      const method = initialData?.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save');
      onSuccess ? onSuccess() : (window.location.href = `/org/${orgSlug}/clients`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-xl">
      {error && <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-sm rounded">{error}</div>}
      <div>
        <label className="block text-xs uppercase text-slate-400 mb-1">Client Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Acme Corp"
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-xs uppercase text-slate-400 mb-1">Email Address</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="info@acme.com"
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm outline-none focus:border-emerald-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Phone (+254)</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+254 712 345 678"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">Company</label>
          <input
            name="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Ltd"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-sm transition"
      >
        {loading ? 'Saving...' : initialData?.id ? 'Update Client' : 'Create Client'}
      </button>
    </form>
  );
}
