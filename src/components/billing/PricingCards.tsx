'use client';

import { useState } from 'react';

interface Props {
  orgId: string;
  slug: string;
  currentPlan: string;
}

export default function PricingCards({ orgId, slug, currentPlan }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, plan, slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      kesPrice: 'KES 0',
      usdPrice: 'Free forever',
      features: ['Up to 5 active clients', '10 invoices per month', '1 team seat', 'Standard email invoices'],
    },
    {
      id: 'pro',
      name: 'Business Pro',
      kesPrice: 'KES 2,999',
      usdPrice: '~$20 / month',
      popular: true,
      features: ['Unlimited clients', 'Unlimited invoices', 'Up to 5 team seats', 'Bulk CSV export', 'M-Pesa payment tracking'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Scale',
      kesPrice: 'KES 9,999',
      usdPrice: '~$75 / month',
      features: ['Unlimited team seats', 'Custom Kenyan SME branding', 'Priority WhatsApp / phone support', 'Audit logging & API access'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((p) => {
        const isCurrent = currentPlan === p.id;
        return (
          <div
            key={p.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between relative ${
              p.popular ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/40' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-extrabold text-white">{p.kesPrice}</span>
                <span className="text-xs text-slate-400 block">{p.usdPrice}</span>
              </div>
              <ul className="space-y-2.5 my-6 text-sm text-slate-300">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => p.id !== 'free' && handleUpgrade(p.id as any)}
              disabled={isCurrent || p.id === 'free' || loading !== null}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                isCurrent
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : p.popular
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {isCurrent ? 'Current Plan' : loading === p.id ? 'Redirecting to Stripe...' : `Upgrade to ${p.name.split(' ')[0]}`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
