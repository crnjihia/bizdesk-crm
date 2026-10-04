import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        lines: true,
        organization: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.number}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 20px; }
    .title { font-size: 28px; font-weight: bold; color: #065f46; }
    .meta { font-size: 14px; color: #64748b; }
    .bill-to { margin: 30px 0; display: flex; justify-content: space-between; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 13px; text-transform: uppercase; color: #475569; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .total-box { margin-top: 30px; text-align: right; }
    .total-amount { font-size: 24px; font-weight: bold; color: #059669; }
    .status-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #d1fae5; color: #065f46; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${invoice.organization.name}</div>
      <div class="meta">Kenya SME Invoicing System</div>
    </div>
    <div style="text-align: right;">
      <h2>INVOICE</h2>
      <div class="meta"><strong># ${invoice.number}</strong></div>
      <div class="status-badge">${invoice.status}</div>
    </div>
  </div>

  <div class="bill-to">
    <div>
      <strong>Billed To:</strong><br/>
      ${invoice.client.name}<br/>
      ${invoice.client.email || ''}<br/>
      ${invoice.client.phone || ''}
    </div>
    <div style="text-align: right;">
      <strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}<br/>
      <strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}<br/>
      ${invoice.mpesaRef ? `<strong>M-Pesa Ref:</strong> ${invoice.mpesaRef}` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price (KES)</th>
        <th style="text-align: right;">Amount (KES)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.lines
        .map(
          (l) => `<tr>
          <td>${l.description}</td>
          <td style="text-align: center;">${l.quantity}</td>
          <td style="text-align: right;">${Number(l.unitPrice).toLocaleString()}</td>
          <td style="text-align: right; font-weight: bold;">${Number(l.amount).toLocaleString()}</td>
        </tr>`,
        )
        .join('')}
    </tbody>
  </table>

  <div class="total-box">
    <div style="color: #64748b; font-size: 14px;">Total Payable (${invoice.currency}):</div>
    <div class="total-amount">KES ${Number(invoice.total).toLocaleString()}</div>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="invoice-${invoice.number}.html"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
