import React from 'react';
import Link from 'next/link';

interface Props {
  currentPlan: string;
  requiredPlan: 'pro' | 'enterprise';
  orgSlug: string;
  children: React.ReactNode;
}

export default function PlanGate({ currentPlan, requiredPlan, orgSlug, children }: Props) {
  const allowed =
    requiredPlan === 'pro'
      ? currentPlan === 'pro' || currentPlan === 'enterprise'
      : currentPlan === 'enterprise';

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="p-8 rounded-2xl border border-emerald-500/30 bg-slate-900/90 text-center max-w-lg mx-auto space-y-4 my-6">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
        ★
      </div>
      <h3 className="text-xl font-bold text-white capitalize">{requiredPlan} Feature Locked</h3>
      <p className="text-sm text-slate-400">
        This feature requires the <strong>{requiredPlan.toUpperCase()}</strong> plan. Upgrade your organization to unlock unlimited access.
      </p>
      <Link
        href={`/org/${orgSlug}/billing/upgrade`}
        className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-emerald-900/40"
      >
        Upgrade Now
      </Link>
    </div>
  );
}
