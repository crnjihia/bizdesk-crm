import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireRole, hasRole } from '@/lib/rbac';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    membership: {
      findFirst: vi.fn(),
    },
    $use: vi.fn(),
  },
}));

describe('RBAC requireRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows owner to perform owner/admin actions', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: 'usr-1', email: 'owner@bizdesk.co.ke' },
      expires: '2099-01-01',
    } as any);

    vi.mocked(prisma.membership.findFirst).mockResolvedValueOnce({
      id: 'mem-1',
      role: 'owner',
      userId: 'usr-1',
    } as any);

    await expect(requireRole('org-1', ['owner', 'admin'])).resolves.toEqual({
      id: 'mem-1',
      role: 'owner',
      userId: 'usr-1',
    });
  });

  it('rejects member attempting owner actions with Forbidden error', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: 'usr-2', email: 'staff@bizdesk.co.ke' },
      expires: '2099-01-01',
    } as any);

    vi.mocked(prisma.membership.findFirst).mockResolvedValueOnce({
      id: 'mem-2',
      role: 'member',
      userId: 'usr-2',
    } as any);

    await expect(requireRole('org-1', ['owner'])).rejects.toThrow('Forbidden: insufficient role');
  });

  it('rejects unauthenticated requests', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any);

    await expect(requireRole('org-1', ['owner', 'admin'])).rejects.toThrow('Unauthenticated');
  });

  it('hasRole returns true or false correctly', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'usr-1', email: 'owner@bizdesk.co.ke' },
      expires: '2099-01-01',
    } as any);

    vi.mocked(prisma.membership.findFirst).mockResolvedValue({
      id: 'mem-1',
      role: 'admin',
      userId: 'usr-1',
    } as any);

    expect(await hasRole('org-1', ['admin'])).toBe(true);
    expect(await hasRole('org-1', ['owner'])).toBe(false);
  });
});
