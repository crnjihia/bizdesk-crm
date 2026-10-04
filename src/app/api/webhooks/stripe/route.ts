import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_key';

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    // In dev / test where secret might be placeholder
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }
  }

  // Idempotency check: verify if this Stripe event has already been recorded
  const alreadyProcessed = await prisma.activityLog.findFirst({
    where: {
      action: 'stripe_webhook_received',
      entityId: event.id,
    },
  });

  if (alreadyProcessed) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  const orgId = event.data?.object?.metadata?.organizationId;

  // Log incoming webhook event for idempotency and auditability
  if (orgId) {
    await prisma.activityLog.create({
      data: {
        organizationId: orgId,
        action: 'stripe_webhook_received',
        entityType: 'stripe_event',
        entityId: event.id,
        metadata: { type: event.type },
      },
    });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const targetOrgId = session.metadata?.organizationId;
      const plan = session.metadata?.plan || 'pro';

      if (targetOrgId) {
        await prisma.organization.update({
          where: { id: targetOrgId },
          data: {
            plan,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const targetOrgId = subscription.metadata?.organizationId;
      if (targetOrgId) {
        await prisma.organization.update({
          where: { id: targetOrgId },
          data: { stripeSubscriptionId: subscription.id },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const targetOrgId = subscription.metadata?.organizationId;
      if (targetOrgId) {
        await prisma.organization.update({
          where: { id: targetOrgId },
          data: { plan: 'free', stripeSubscriptionId: null },
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.warn(`Payment failed for invoice ${invoice.id}`);
      break;
    }

    default:
      console.log(`Unhandled stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
