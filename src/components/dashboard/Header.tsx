'use client';

import Link from 'next/link';

export default function Header({ slug }: { slug: string }) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/60 backdrop-blur px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href={`/org/${slug}/dashboard`} className="hover:text-slate-200">
          Organization
        </Link>
        <span>/</span>
        <span className="text-emerald-400 font-mono font-medium">{slug}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-slate-400">Live Workspace</span>
      </div>
    </header>
  );
}
