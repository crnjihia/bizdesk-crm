import { describe, it, expect, vi } from 'vitest';
import { setCurrentOrg, getCurrentOrgId, tenantMiddleware } from '@/lib/tenant';

describe('Tenant isolation middleware', () => {
  it('correctly tracks and binds tenant context in async execution', async () => {
    expect(getCurrentOrgId()).toBeNull();

    await setCurrentOrg('org-a', async () => {
      expect(getCurrentOrgId()).toBe('org-a');

      await setCurrentOrg('org-b', async () => {
        expect(getCurrentOrgId()).toBe('org-b');
      });

      expect(getCurrentOrgId()).toBe('org-a');
    });

    expect(getCurrentOrgId()).toBeNull();
  });

  it('prevents cross-org data access by auto-injecting tenant filter on read', async () => {
    await setCurrentOrg('org-tenant-b', async () => {
      const nextMock = vi.fn().mockImplementation((p) => Promise.resolve(p));

      // Attacker or query specifies no where clause
      const params = {
        model: 'Client',
        action: 'findMany',
        args: {},
      };

      await tenantMiddleware(params, nextMock);

      expect(nextMock).toHaveBeenCalledWith(
        expect.objectContaining({
          args: {
            where: {
              organizationId: 'org-tenant-b',
            },
          },
        }),
      );
    });
  });

  it('prevents cross-org data leak by overriding explicit foreign organizationId', async () => {
    await setCurrentOrg('org-tenant-b', async () => {
      const nextMock = vi.fn().mockImplementation((p) => Promise.resolve(p));

      // Attacker attempts to read org-tenant-a data
      const params = {
        model: 'Invoice',
        action: 'findMany',
        args: {
          where: { organizationId: 'org-tenant-a' },
        },
      };

      await tenantMiddleware(params, nextMock);

      // Middleware forces tenant isolation to current tenant
      expect(nextMock).toHaveBeenCalledWith(
        expect.objectContaining({
          args: {
            where: {
              organizationId: 'org-tenant-b',
            },
          },
        }),
      );
    });
  });

  it('converts findUnique to findFirst with organizationId scoping', async () => {
    await setCurrentOrg('org-tenant-b', async () => {
      const nextMock = vi.fn().mockImplementation((p) => Promise.resolve(p));

      const params = {
        model: 'Invoice',
        action: 'findUnique',
        args: {
          where: { id: 'inv-target-id' },
        },
      };

      await tenantMiddleware(params, nextMock);

      expect(params.action).toBe('findFirst');
      expect(nextMock).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'findFirst',
          args: {
            where: {
              id: 'inv-target-id',
              organizationId: 'org-tenant-b',
            },
          },
        }),
      );
    });
  });

  it('auto-injects organizationId on create', async () => {
    await setCurrentOrg('org-tenant-x', async () => {
      const nextMock = vi.fn().mockImplementation((p) => Promise.resolve(p));

      const params = {
        model: 'Client',
        action: 'create',
        args: {
          data: { name: 'New Client' },
        },
      };

      await tenantMiddleware(params, nextMock);

      expect(nextMock).toHaveBeenCalledWith(
        expect.objectContaining({
          args: {
            data: {
              name: 'New Client',
              organizationId: 'org-tenant-x',
            },
          },
        }),
      );
    });
  });
});
