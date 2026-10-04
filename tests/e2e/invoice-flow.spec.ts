import { test, expect } from '@playwright/test';

test('full invoice lifecycle', async ({ page }) => {
  // 1. Onboarding – create organization
  await page.goto('http://localhost:3000/onboarding');
  await page.fill('input[placeholder="Organization name"]', 'Test Org');
  await page.click('text=Create organization');
  await page.waitForURL(/\/org\/test-org\/dashboard/);

  // 2. Add client
  await page.goto('http://localhost:3000/org/test-org/clients');
  await page.click('text=Add Client');
  await page.fill('input[name="name"]', 'Acme Corp');
  await page.fill('input[name="email"]', 'info@acme.com');
  await page.click('text=Create Client');

  // 3. Create invoice
  await page.goto('http://localhost:3000/org/test-org/invoices');
  await page.click('text=Add Invoice');
  await page.selectOption('select[name="clientId"]', { label: 'Acme Corp' });
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueStr = tomorrow.toISOString().split('T')[0];
  await page.fill('input[name="dueDate"]', dueStr);
  await page.fill('input[placeholder="Description"]', 'Service A');
  await page.fill('input[placeholder="Qty"]', '2');
  await page.fill('input[placeholder="Unit Price"]', '5000');
  await page.click('text=Create Invoice');

  // 4. Mark invoice as paid (MPesa) – simulated by PATCHing status
  const cookies = await page.context().cookies();
  const orgIdCookie = cookies.find((c) => c.name === 'orgId');
  const orgId = orgIdCookie?.value;

  const res = await page.request.get('/api/invoices', {
    headers: { cookie: `orgId=${orgId}` },
  });
  const invoices = await res.json();
  const invoiceId = invoices[0].id;

  await page.request.patch(`/api/invoices/${invoiceId}`, {
    data: { status: 'paid' },
    headers: { 'Content-Type': 'application/json', cookie: `orgId=${orgId}` },
  });

  // 5. Verify invoice shows paid status in UI
  await page.goto(`http://localhost:3000/org/test-org/invoices/${invoiceId}`);
  await expect(page.locator('text=Status')).toContainText('paid');
});
