# Contributing to BizDesk CRM

Thank you for your interest in contributing to **BizDesk CRM**! We are building the premier open-source CRM and invoicing platform for Kenyan SMEs and African businesses.

## 🛠 Development Workflow

### 1. Fork & Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/bizdesk-crm.git
   cd bizdesk-crm
   ```

### 2. Branching Strategy
Create a feature branch named according to conventional commits:
```bash
git checkout -b feat/client-export-filters
# or
git checkout -b fix/invoice-total-rounding
```

### 3. Local Environment
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local PostgreSQL database:
   ```bash
   docker compose up -d
   ```
3. Copy environment variables and apply schema:
   ```bash
   cp .env.example .env
   npx prisma db push
   npm run seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing & Quality Standards

Before opening a pull request, ensure all checks pass:

- **Typecheck**: `npm run typecheck` must pass with zero errors.
- **Unit Tests**: `npm test` must execute and pass all suites.
- **Linting**: Code should adhere to ESLint and Prettier rules.
- **Multi-Tenancy**: Any database queries touching tenant records (`Client`, `Invoice`, etc.) must adhere to the multi-tenancy isolation middleware.

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `test:` Adding or updating tests
- `refactor:` Code improvements without functional changes
- `chore:` Tooling, dependencies, or configuration updates

## 🚀 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the Pull Request template completely.
4. Ensure all CI checks pass.
