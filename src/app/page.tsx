import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-slate-100">
      <div className="max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
          🇰🇪 Biashara SaaS Platform
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
          Modern Invoicing & CRM for Kenyan Enterprises
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Manage clients, send M-Pesa linked invoices, track payments with real-time status updates, and streamline billing.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/onboarding"
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-lg shadow-emerald-900/40"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-900 text-slate-300 font-medium transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
