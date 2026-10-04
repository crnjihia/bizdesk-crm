'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/slug';

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(generateSlug(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create organization');
      }

      const data = await res.json();
      router.push(`/org/${data.slug}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Step 1 of 1
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create your Organization</h1>
          <p className="text-sm text-slate-400">Set up your business workspace on Biashara SaaS</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
              Organization Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Organization name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-300 mb-1">
              Workspace URL Slug
            </label>
            <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-400">
              <span className="text-slate-500">biashara.co.ke/org/</span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="bg-transparent text-emerald-400 focus:outline-none ml-1 w-full font-mono text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition text-sm shadow-lg shadow-emerald-900/30 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create organization'}
          </button>
        </form>
      </div>
    </main>
  );
}
