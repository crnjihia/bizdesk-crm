import prisma from '@/lib/prisma';
import PricingCards from '@/components/billing/PricingCards';
import { notFound } from 'next/navigation';

export default async function UpgradePage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
  });

  if (!org) notFound();

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Upgrade Your Subscription</h1>
        <p className="text-sm text-slate-400">Unlock bulk CSV export, unlimited clients & invoices, and more team seats</p>
      </div>
      <PricingCards orgId={org.id} slug={org.slug} currentPlan={org.plan} />
    </div>
  );
}
