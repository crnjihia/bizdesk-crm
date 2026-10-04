import prisma from '@/lib/prisma';
import RevenueChart from '@/components/dashboard/RevenueChart';
import InvoiceStatusDonut from '@/components/dashboard/InvoiceStatusDonut';
import Link from 'next/link';

export default async function DashboardPage({ params }: { params: { slug: string } }) {
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: {
      invoices: true,
      clients: { where: { archived: false } },
    },
  });

  const invoices = org?.invoices || [];
  const clients = org?.clients || [];

  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const sentInvoices = invoices.filter((i) => i.status === 'sent');
  const draftInvoices = invoices.filter((i) => i.status === 'draft');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  const totalRevenue = paidInvoices.reduce((acc, i) => acc + Number(i.total), 0);
  const outstanding = [...sentInvoices, ...overdueInvoices].reduce((acc, i) => acc + Number(i.total), 0);

  const statusStats = {
    paid: paidInvoices.length,
    sent: sentInvoices.length,
    draft: draftInvoices.length,
    overdue: overdueInvoices.length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome to your Kenyan SME business operating center</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/org/${params.slug}/invoices/create`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition"
          >
            + New Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs uppercase text-slate-400 tracking-wider">Revenue Collected</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">KES {totalRevenue.toLocaleString()}</p>
          <span className="text-xs text-emerald-500/80 mt-1 block">✓ Paid & Reconciled</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs uppercase text-slate-400 tracking-wider">Outstanding Balance</span>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">KES {outstanding.toLocaleString()}</p>
          <span className="text-xs text-slate-400 mt-1 block">{sentInvoices.length} awaiting payment</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs uppercase text-slate-400 tracking-wider">Overdue Invoices</span>
          <p className="text-2xl font-bold text-red-400 font-mono mt-1">{overdueInvoices.length}</p>
          <span className="text-xs text-red-400/80 mt-1 block">Past due date</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs uppercase text-slate-400 tracking-wider">Active Clients</span>
          <p className="text-2xl font-bold text-white font-mono mt-1">{clients.length}</p>
          <span className="text-xs text-slate-400 mt-1 block">Registered customers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white">Revenue Performance (KES)</h2>
          <RevenueChart />
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white">Invoice Status Breakdown</h2>
          <InvoiceStatusDonut stats={statusStats} />
        </div>
      </div>
    </div>
  );
}
