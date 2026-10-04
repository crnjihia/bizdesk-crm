import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'BizDesk CRM | Kenyan SME Multi-Tenant Invoicing Platform',
    template: '%s | BizDesk CRM',
  },
  description:
    'Production-grade multi-tenant CRM, M-Pesa linked invoicing, and revenue intelligence platform engineered for Kenyan SMEs and African enterprises.',
  keywords: [
    'Kenyan SME CRM',
    'M-Pesa Invoicing',
    'Kenya Tax Invoicing',
    'Multi-Tenant SaaS',
    'Next.js 14 CRM',
    'African Enterprise Billing',
  ],
  authors: [{ name: 'BizDesk CRM Team', url: 'https://bizdesk.co.ke' }],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://bizdesk.co.ke',
    siteName: 'BizDesk CRM',
    title: 'BizDesk CRM | Kenyan SME Multi-Tenant Invoicing & CRM',
    description:
      'Manage clients, issue professional invoices, reconcile M-Pesa settlements, and scale your business with enterprise multi-tenancy.',
    images: [
      {
        url: '/screenshots/dashboard-preview.png',
        width: 1200,
        height: 630,
        alt: 'BizDesk CRM Overview Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizDesk CRM | Kenyan SME Multi-Tenant Invoicing & CRM',
    description:
      'Manage clients, issue professional invoices, and reconcile M-Pesa settlements.',
    images: ['/screenshots/dashboard-preview.png'],
    creator: '@bizdeskcrm',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
