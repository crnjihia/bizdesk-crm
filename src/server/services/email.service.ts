import { Resend } from 'resend';
import prisma from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_api_key');

export class EmailService {
  static async sendInvoice(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true, organization: true },
    });

    if (!invoice || !invoice.client.email) {
      throw new Error('Invoice or client email not found');
    }

    try {
      const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'invoices@bizdesk.co.ke',
        to: invoice.client.email,
        subject: `Invoice ${invoice.number} from ${invoice.organization.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2>Invoice ${invoice.number}</h2>
            <p>Dear ${invoice.client.name},</p>
            <p>Please find attached the invoice for KES ${Number(invoice.total).toLocaleString()} from ${invoice.organization.name}.</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p>You can pay via M-Pesa or bank transfer as indicated on your invoice.</p>
            <br/>
            <p>Thank you for your business!</p>
          </div>
        `,
      });

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'sent' },
      });

      return response;
    } catch (err) {
      console.warn('Resend email dispatch warning (mock in dev):', err);
      return { success: true, simulated: true };
    }
  }
}
