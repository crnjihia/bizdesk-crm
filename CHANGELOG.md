# Changelog

All notable changes to BizDesk CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-14

### Initial Release

We are excited to announce the initial release of **BizDesk CRM** (v0.1.0) — a production-grade multi-tenant CRM and financial invoicing platform designed for Kenyan SMEs and African growing businesses.

### Features
- **Multi-Tenancy & Tenant Isolation**:
  - Organization isolation powered by Prisma middleware and `AsyncLocalStorage` context.
  - Multi-tenant path routing under `/org/[slug]/...`.
- **Authentication & Onboarding**:
  - NextAuth v5 integration with Google OAuth and Magic Link email providers.
  - Organization creation and workspace onboarding flow.
- **Client Management**:
  - Full client registry with search, filtering, status badges, and archive/delete workflows.
  - Organization-scoped contact details and client history.
- **Invoicing & Payments**:
  - Dynamic invoice generator with line items, tax calculation, and automatic sequential numbering.
  - Multi-currency support with native Kenyan Shilling (KES) formatting.
  - M-Pesa mobile money payment recording and ledger reconciliation.
  - Client-ready PDF invoice generation (`@react-pdf/renderer`) and direct email dispatch via Resend.
  - Invoice lifecycle states: Draft, Sent, Paid, Overdue, Cancelled.
- **Analytics & Dashboard**:
  - Real-time KPI summaries: Total Revenue, Invoiced Volume, Overdue Balances, Active Clients.
  - Interactive monthly revenue chart powered by Recharts.
  - Organization-wide audit and activity feed.
- **Billing & Subscriptions**:
  - Stripe Checkout integration for subscription upgrades.
  - Tiered subscription model (Starter, Pro, Enterprise) with automated limit enforcement for clients, monthly invoices, and team seats.
  - Secure, idempotent Stripe webhook handling.
- **Role-Based Access Control (RBAC)**:
  - Role hierarchy: `Owner`, `Admin`, and `Member` with server action and route-level guards.
- **Data Export & Reporting**:
  - Filtered CSV bulk export for invoices and client databases suitable for accounting and KRA filing.
- **DevOps, Docker & SEO**:
  - Production Dockerfile with standalone Next.js compilation and `.dockerignore`.
  - Health check endpoint at `/api/health` verifying database connectivity and system status.
  - SEO optimization with metadata, OpenGraph cards, Twitter preview cards, `robots.txt`, and `sitemap.xml`.
  - GitHub Actions CI workflow covering typechecks and automated test suites.
