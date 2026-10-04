import Link from 'next/link';

export default function MarketingPricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-white">Transparent Pricing for Kenyan SMEs</h1>
        <p className="text-slate-400">Scale your business operations with predictable pricing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Free Starter</h2>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">KES 0</p>
          <p className="text-sm text-slate-400">Ideal for sole proprietors starting out.</p>
          <Link href="/onboarding" className="block text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold">
            Get Started Free
          </Link>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white">Business Pro</h2>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">KES 2,999<span className="text-xs text-slate-400"> /mo</span></p>
          <p className="text-sm text-slate-400">Unlimited clients, invoices, bulk export & team seats.</p>
          <Link href="/onboarding" className="block text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
