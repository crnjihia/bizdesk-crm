import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const org = await prisma.organization.create({
    data: {
      name: 'Nairobi Tech Hub Ltd',
      slug: 'nairobi-tech-hub',
      plan: 'pro',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'owner@bizdesk.co.ke',
      name: 'Njeri Kamau',
    },
  });

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: org.id,
      role: 'owner',
    },
  });

  const clientsData = [
    { name: 'Safari Logistics Ltd', email: 'billing@safarilogistics.co.ke', phone: '+254712345678', company: 'Safari Logistics' },
    { name: 'Mombasa Fresh Grocers', email: 'accounts@mombasafresh.com', phone: '+254722334455', company: 'Mombasa Fresh' },
    { name: 'Kilimani Design Studio', email: 'hello@kilimanidesign.ke', phone: '+254733445566', company: 'Kilimani Studio' },
    { name: 'Rift Valley Agribusiness', email: 'finance@riftagri.co.ke', phone: '+254744556677', company: 'Rift Agribusiness' },
    { name: 'Boma Hardware Distributors', email: 'orders@bomahardware.co.ke', phone: '+254755667788', company: 'Boma Hardware' },
  ];

  const createdClients = [];
  for (const c of clientsData) {
    const client = await prisma.client.create({
      data: {
        organizationId: org.id,
        ...c,
      },
    });
    createdClients.push(client);
  }

  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= 10; i++) {
    const client = createdClients[(i - 1) % createdClients.length];
    const invoiceNumber = `INV-${currentYear}-${i.toString().padStart(4, '0')}`;
    const status = i <= 4 ? 'paid' : i <= 7 ? 'sent' : i === 8 ? 'overdue' : 'draft';

    const inv = await prisma.invoice.create({
      data: {
        organizationId: org.id,
        clientId: client.id,
        number: invoiceNumber,
        status: status as any,
        dueDate: new Date(Date.now() + (i * 2 - 10) * 86400000),
        currency: 'KES',
        total: new Prisma.Decimal(15000 * i),
        notes: `Standard monthly consulting and inventory management fee.`,
        mpesaRef: status === 'paid' ? `QHD${820000 + i}K9P` : null,
      },
    });

    await prisma.invoiceLine.create({
      data: {
        invoiceId: inv.id,
        description: 'Software & System Consultation',
        quantity: 1,
        unitPrice: new Prisma.Decimal(10000 * i),
        amount: new Prisma.Decimal(10000 * i),
      },
    });

    await prisma.invoiceLine.create({
      data: {
        invoiceId: inv.id,
        description: 'Technical Support & Integration Retainer',
        quantity: 1,
        unitPrice: new Prisma.Decimal(5000 * i),
        amount: new Prisma.Decimal(5000 * i),
      },
    });

    if (status === 'paid') {
      await prisma.payment.create({
        data: {
          invoiceId: inv.id,
          amount: new Prisma.Decimal(15000 * i),
          method: 'mpesa',
          ref: `QHD${820000 + i}K9P`,
          paidAt: new Date(),
        },
      });
    }
  }

  console.log('✅ Seed completed successfully with 1 org, 5 clients, and 10 invoices!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
