## Description
Briefly describe the changes made in this pull request and the problem they solve.

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🔧 Refactoring or tooling update

## Multi-Tenancy & Security Checklist
- [ ] All database queries on tenant models include or respect the `organizationId` isolation context.
- [ ] RBAC permissions have been validated with `requireRole` or equivalent guards.
- [ ] No tenant data or secrets are exposed in logs or API responses.

## Testing & Quality Checklist
- [ ] `npm run typecheck` passes with zero TypeScript errors.
- [ ] `npm test` passes all unit test suites.
- [ ] Relevant unit or integration tests have been added or updated.
- [ ] Verified manually in the local development environment (`http://localhost:3000`).

## Screenshots (if applicable)
Add before/after screenshots or recordings of UI changes.
