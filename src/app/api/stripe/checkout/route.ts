import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orgId, plan, slug } = await request.json();

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });

    const priceAmount = plan === 'enterprise' ? 7500 : 2000; // in USD cents ($75 or $20)
    const planName = plan === 'enterprise' ? 'Enterprise Plan (KES 9,999/mo)' : 'Pro Plan (KES 2,999/mo)';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `BizDesk CRM - ${planName}`,
              description: 'Multi-tenant invoicing & CRM for Kenyan SMEs',
            },
            unit_amount: priceAmount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: {
        organizationId: org.id,
        plan,
      },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/org/${slug}/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/org/${slug}/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
