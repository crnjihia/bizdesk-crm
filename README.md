# BizDesk CRM 🇰🇪

[![CI](https://github.com/your-org/bizdesk-crm/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/bizdesk-crm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black.svg)](https://nextjs.org/)

**BizDesk CRM** is a production-grade multi-tenant CRM and invoicing platform engineered specifically for Kenyan SMEs and African growing enterprises. It combines client relationship management with M-Pesa linked invoicing, automated overdue detection, KES currency calculations, Stripe subscription billing, and CSV audit exports.

---

## 🏛 Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend & Client Layer (Next.js 14 App Router)"]
        UI["Tailwind CSS + shadcn/ui Dashboard"]
        ClientPages["/org/[slug]/* Pages"]
        AuthPages["/login, /register, /onboarding"]
    end

    subgraph ServerLayer["Backend & Multi-Tenancy Boundary"]
        Actions["Server Actions (CRM, Invoices, Payments)"]
        RouteHandlers["API Routes (/api/*)"]
        TenantMW["Prisma Middleware (Tenant Isolation Context)"]
        RBAC["RBAC Guard (requireRole)"]
        AuthJS["NextAuth v5 (Google OAuth + Magic Links)"]
    end

    subgraph DataIntegrations["Data & External Integrations"]
        DB[("PostgreSQL via Prisma ORM")]
        Stripe["Stripe Billing & Idempotent Webhooks"]
        Mpesa["M-Pesa Reconciliation Engine"]
        Resend["Resend Email Dispatch"]
    end

    UI --> ClientPages
    ClientPages --> Actions
    ClientPages --> RouteHandlers
    Actions --> RBAC
    RBAC --> TenantMW
    RouteHandlers --> TenantMW
    TenantMW --> DB
    RouteHandlers --> Stripe
    RouteHandlers --> Mpesa
    RouteHandlers --> Resend
    AuthPages --> AuthJS
    AuthJS --> DB
```

---

## 🏢 Multi-Tenancy Architecture

BizDesk CRM enforces **hard multi-tenancy isolation** at the database abstraction layer:
1. **Per-Request Context**: Uses Node's `AsyncLocalStorage` to store the active tenant ID (`organizationId`).
2. **Prisma Middleware**: Intercepts every query on tenant-scoped models (`Client`, `Invoice`, `ActivityLog`, `Membership`).
3. **Automatic Query Mutation**:
   - `create` / `createMany`: Auto-injects `data.organizationId = currentOrgId`.
   - `findMany` / `findFirst` / `update` / `delete`: Auto-injects `where: { organizationId: currentOrgId }`.
   - `findUnique`: Rewrites queries to scoped `findFirst` with `organizationId` filter, preventing primary-key traversal leaks across tenants.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

Permissions are scoped per-organization:

| Feature / Action | Owner | Admin | Member |
| :--- | :---: | :---: | :---: |
| View Dashboard & Reports | ✅ | ✅ | ✅ |
| Manage Clients (CRUD & Archive) | ✅ | ✅ | View Only |
| Create & Issue Invoices | ✅ | ✅ | ✅ |
| Record M-Pesa Settlements | ✅ | ✅ | ✅ |
| Manage Team Seats & Invites | ✅ | ✅ | ❌ |
| Upgrade Subscription / Billing Portal | ✅ | ❌ | ❌ |
| Bulk CSV Export (Pro/Enterprise) | ✅ | ✅ | ❌ |
| Delete Organization | ✅ | ❌ | ❌ |

---

## 🚀 Quickstart

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Docker)
- Stripe CLI (optional for webhook testing)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-org/bizdesk-crm.git
cd bizdesk-crm

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Generate Prisma Client & push schema
npx prisma generate
npx prisma db push

# 5. Seed demo organization, clients, and invoices
npm run seed

# 6. Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⚙️ Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5433/bizdesk` |
| `NEXTAUTH_SECRET` | Secret key for JWT encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical app URL | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your-google-client-secret` |
| `RESEND_API_KEY` | Resend API key for magic links & invoices | `re_12345678` |
| `EMAIL_FROM` | Default sender email | `invoices@bizdesk.co.ke` |
| `STRIPE_SECRET_KEY` | Stripe secret key for subscriptions | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification secret | `whsec_...` |

---

## 🧪 Testing

```bash
# Run unit tests (RBAC & Tenant Isolation)
npm test

# Run E2E Playwright test (Invoice Lifecycle)
npm run test:e2e
```

---

## 📸 Screenshots

| Overview Dashboard | Invoice Creation & Line Items |
| :---: | :---: |
| ![Dashboard Placeholder](https://placehold.co/600x350/0f172a/10b981?text=BizDesk+Dashboard) | ![Invoice Creation](https://placehold.co/600x350/0f172a/10b981?text=Invoice+Line+Items) |

---

## 📄 License
MIT © 2026 BizDesk CRM. Built for Kenyan SMEs.
