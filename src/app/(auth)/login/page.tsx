'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // NextAuth email sign in endpoint or magic link flow
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Biashara SaaS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h1>
          <p className="text-sm text-slate-400">Access your business dashboard and invoices</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-center text-sm">
            ✨ Check your inbox! A magic sign-in link has been sent to <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@business.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition text-sm shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Sign in with Magic Link'}
            </button>
          </form>
        )}

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider absolute">or</span>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="w-full py-2.5 px-4 rounded-lg border border-slate-800 hover:bg-slate-800/60 text-slate-200 font-medium transition text-sm flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.37 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-emerald-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
