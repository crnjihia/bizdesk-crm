import prisma from '@/lib/prisma';
import PlanGate from '@/components/billing/PlanGate';
import { notFound } from 'next/navigation';

export default async function ExportPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
  });

  if (!org) notFound();

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Bulk Export Invoices</h1>
        <p className="text-sm text-slate-400">Download formatted CSV reports for your accountant or KRA audit</p>
      </div>

      <PlanGate currentPlan={org.plan} requiredPlan="pro" orgSlug={params.slug}>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <form action="/api/export/invoices" method="GET" className="space-y-4">
            <input type="hidden" name="slug" value={params.slug} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">Invoice Status Filter</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 text-sm focus:border-emerald-500"
                >
                  <option value="">All Statuses</option>
                  <option value="paid">Paid Only</option>
                  <option value="sent">Sent Only</option>
                  <option value="overdue">Overdue Only</option>
                  <option value="draft">Draft Only</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-emerald-900/30"
              >
                📥 Download Invoices CSV
              </button>
            </div>
          </form>
        </div>
      </PlanGate>
    </div>
  );
}
