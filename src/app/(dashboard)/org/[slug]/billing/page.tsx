import prisma from '@/lib/prisma';
import PricingCards from '@/components/billing/PricingCards';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BillingPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
  });

  if (!org) notFound();

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Plans</h1>
          <p className="text-sm text-slate-400">Manage your subscription, view plan limits, and upgrade</p>
        </div>
        <div className="flex gap-2">
          {org.plan !== 'free' && (
            <Link
              href={`/org/${params.slug}/billing/export`}
              className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition"
            >
              Bulk CSV Export
            </Link>
          )}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Current Subscription</span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-xl font-bold text-white capitalize">{org.plan} Tier</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>
        </div>
        <div className="text-sm text-slate-400">
          Charges are billed via Stripe in USD equivalent to Kenyan SME rates.
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Choose Plan</h2>
        <PricingCards orgId={org.id} slug={org.slug} currentPlan={org.plan} />
      </div>
    </div>
  );
}
