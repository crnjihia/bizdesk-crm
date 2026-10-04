# BizDesk CRM 🇰🇪

<p align="center">
  <img src="docs/images/dashboard-preview.png" alt="BizDesk CRM Overview Dashboard" width="100%" />
</p>

<p align="center">
  <strong>Production-Grade Multi-Tenant CRM & Invoicing Platform for Kenyan SMEs & African Enterprises</strong>
</p>

<p align="center">
  <a href="https://github.com/crnjihia/bizdesk-crm/actions/workflows/ci.yml"><img src="https://github.com/crnjihia/bizdesk-crm/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14_App_Router-black?logo=next.js" alt="Next.js 14" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma" /></a>
  <a href="https://stripe.com/"><img src="https://img.shields.io/badge/Stripe-Subscriptions-635BFF?logo=stripe" alt="Stripe" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-emerald.svg" alt="License: MIT" /></a>
</p>

---

## 🌟 Overview

**BizDesk CRM** is an all-in-one financial operating system tailored to the specific business workflows of Kenyan SMEs. From issuing professional tax invoices and reconciling M-Pesa mobile payments to managing client directories and scaling teams, BizDesk CRM brings enterprise-grade cloud capabilities with local market compatibility.

### ✨ Key Features

- **🇰🇪 M-Pesa Reconciled Invoicing**: Issue KES invoices and record M-Pesa transaction reference codes directly into the audit ledger with automatic payment status updates.
- **🛡️ Hard Multi-Tenancy Isolation**: Strict database-level scoping using Prisma middleware and `AsyncLocalStorage`. Automatic tenant boundary enforcement prevents cross-tenant data leaks.
- **📊 Real-Time Financial Dashboard**: Track total revenue collected, outstanding balances, overdue invoices, and monthly performance with interactive Recharts visualizations.
- **📄 Instant PDF Generation & Delivery**: Generate high-fidelity Kenyan SME tax invoices on the fly and deliver them directly via Resend email integration.
- **💳 Stripe Subscription Monetization**: Tiered plans (**Starter**, **Pro**, **Enterprise**) with hard limit enforcement (clients, monthly invoices, team seats) and webhook idempotency.
- **👥 Role-Based Access Control (RBAC)**: Fine-grained permissions for **Owner**, **Admin**, and **Member** roles.
- **📥 Bulk CSV Audit Exports**: Filter, paginate, and export complete invoice registries for Kenya Revenue Authority (KRA) filing and tax accounting.

---

## 🏛 Architecture Diagram

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

BizDesk CRM enforces **zero-trust multi-tenancy isolation** at the database layer:

1. **Per-Request Context**: Uses Node's `AsyncLocalStorage` via `tenantContext.run(orgId, callback)` to track the active tenant.
2. **Prisma Middleware Interception**: Intercepts every query on tenant-scoped models (`Client`, `Invoice`, `InvoiceItem`, `ActivityLog`, `Membership`).
3. **Automatic Query Mutation**:
   - `create` / `createMany`: Auto-injects `data.organizationId = currentOrgId`.
   - `findMany` / `findFirst` / `update` / `delete`: Auto-injects `where: { organizationId: currentOrgId }`.
   - `findUnique`: Rewrites queries to scoped `findFirst` with `organizationId` filter, preventing primary-key traversal leaks across tenants.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

Permissions are strictly scoped per-organization:

| Feature / Action                      | Owner | Admin |  Member   |
| :------------------------------------ | :---: | :---: | :-------: |
| View Dashboard & Reports              |  ✅   |  ✅   |    ✅     |
| Manage Clients (CRUD & Archive)       |  ✅   |  ✅   | View Only |
| Create & Issue Invoices               |  ✅   |  ✅   |    ✅     |
| Record M-Pesa Settlements             |  ✅   |  ✅   |    ✅     |
| Manage Team Seats & Invites           |  ✅   |  ✅   |    ❌     |
| Upgrade Subscription / Billing Portal |  ✅   |  ❌   |    ❌     |
| Bulk CSV Export (Pro/Enterprise)      |  ✅   |  ✅   |    ❌     |
| Delete Organization                   |  ✅   |  ❌   |    ❌     |

---

## 🛠 Tech Stack

| Domain               | Technology                                           |
| :------------------- | :--------------------------------------------------- |
| **Framework**        | Next.js 14 (App Router, Server Components & Actions) |
| **Language**         | TypeScript 5 (Strict Mode)                           |
| **Styling**          | Tailwind CSS + Lucide Icons + shadcn/ui principles   |
| **Database**         | PostgreSQL 16 via Prisma ORM                         |
| **Authentication**   | NextAuth v5 (Auth.js) — Google OAuth & Magic Link    |
| **Billing**          | Stripe Subscriptions + Idempotent Webhook Handler    |
| **Charts**           | Recharts (Responsive Area and Donut Charts)          |
| **Testing**          | Vitest (Unit) + Playwright (E2E)                     |
| **Containerization** | Docker + docker-compose                              |

---

## 🚀 Quickstart

### Prerequisites

- **Node.js**: v20 or newer
- **Docker**: For running PostgreSQL locally
- **npm** or **pnpm**

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/crnjihia/bizdesk-crm.git
cd bizdesk-crm

# 2. Install dependencies
npm install

# 3. Spin up PostgreSQL container
docker compose up -d

# 4. Configure environment variables
cp .env.example .env

# 5. Push database schema & generate Prisma Client
npx prisma generate
npx prisma db push

# 6. Seed demo organization, clients, and invoices
npm run seed

# 7. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the application.

---

## ⚙️ Environment Configuration

| Variable                | Description                           | Default / Example                                               |
| :---------------------- | :------------------------------------ | :-------------------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string          | `postgresql://postgres:postgrespassword@localhost:5433/bizdesk` |
| `NEXTAUTH_SECRET`       | Secret key for JWT session encryption | `bizdesk-crm-super-secret-jwt-key-2026-safe`                    |
| `NEXTAUTH_URL`          | Canonical app URL                     | `http://localhost:3000`                                         |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID                | `your-google-client-id`                                         |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth Client Secret            | `your-google-client-secret`                                     |
| `RESEND_API_KEY`        | Resend API key for email delivery     | `re_your_api_key`                                               |
| `EMAIL_FROM`            | Default sender email address          | `invoicing@bizdesk.co.ke`                                       |
| `STRIPE_SECRET_KEY`     | Stripe secret key for subscriptions   | `sk_test_...`                                                   |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification secret    | `whsec_...`                                                     |

---

## 🧪 Testing Suite

BizDesk CRM includes comprehensive automated testing:

```bash
# Run unit tests (RBAC validation & Prisma tenant isolation middleware)
npm test

# Run TypeScript typecheck without emitting output
npm run typecheck

# Run end-to-end invoice lifecycle test with Playwright
npm run test:e2e
```

---

## 📁 Repository Structure

```
bizdesk-crm/
├── .github/                  # GitHub Actions CI & issue/PR templates
│   ├── workflows/ci.yml      # Automated lint, typecheck, and unit test pipeline
│   └── ISSUE_TEMPLATE/       # Structured bug report & feature request templates
├── docs/                     # Media and architectural documentation
│   └── images/               # High-resolution screenshots and diagrams
├── prisma/                   # Prisma database schema and seed script
│   ├── schema.prisma         # Multi-tenant data models
│   └── seed.ts               # Demo organization, clients, and sample invoices
├── src/
│   ├── app/                  # Next.js 14 App Router routes & API endpoints
│   │   ├── (auth)/           # Authentication (login, register, onboarding)
│   │   ├── (dashboard)/      # Protected multi-tenant dashboard & modules
│   │   └── api/              # Invoices, health, webhooks, export, checkout
│   ├── components/           # Reusable UI components & Recharts visualizations
│   ├── lib/                  # Auth configuration, plan limits, tenant context
│   └── server/               # RBAC guards, email delivery, and cron utilities
├── tests/                    # Vitest unit tests & Playwright E2E suites
├── docker-compose.yml        # Local PostgreSQL container definition
└── package.json              # Project scripts and dependencies
```

---

## 🤝 Contributing

I welcome contributions! Please review [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## 🔒 Security

For security vulnerabilities or bug disclosures, please review [SECURITY.md](SECURITY.md).

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
