import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar slug={params.slug} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header slug={params.slug} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
