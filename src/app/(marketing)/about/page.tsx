import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white">About Biashara SaaS</h1>
        <p className="text-slate-400">Empowering African commerce with modern financial infrastructure</p>
      </div>
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
        <p>
          Biashara SaaS was built to eliminate the friction Kenyan small and medium businesses face when managing clients, issuing KRA-compliant invoices, and tracking M-Pesa receipts.
        </p>
        <p>
          Our mission is to give every African business owner the tools and financial clarity to grow from a sole proprietorship into a multi-branch enterprise.
        </p>
      </div>
      <div className="pt-4">
        <Link href="/" className="text-emerald-400 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
