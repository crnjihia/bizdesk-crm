'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ slug }: { slug: string }) {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: `/org/${slug}/dashboard`, icon: '📊' },
    { label: 'Clients', href: `/org/${slug}/clients`, icon: '👥' },
    { label: 'Invoices', href: `/org/${slug}/invoices`, icon: '🧾' },
    { label: 'Billing & Plans', href: `/org/${slug}/billing`, icon: '💳' },
    { label: 'Team Members', href: `/org/${slug}/team`, icon: '🏢' },
    { label: 'Settings', href: `/org/${slug}/settings`, icon: '⚙️' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md shadow-emerald-500/20">
            B
          </div>
          <div>
            <span className="font-bold text-white text-sm block">BizDesk CRM</span>
            <span className="text-[10px] text-emerald-400 font-mono">KENYA EDITION</span>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">M-Pesa Verified 🇰🇪</p>
        <p className="text-[11px] text-slate-500 mt-0.5">SME Operating System</p>
      </div>
    </aside>
  );
}
