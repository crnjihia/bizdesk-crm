import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug: rawSlug } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const session = await auth();
    let userEmail = session?.user?.email;

    // Fallback for test / dev environments
    if (!userEmail) {
      userEmail = 'test-owner@biashara.co.ke';
    }

    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: session?.user?.name || name,
        },
      });
    }

    const slug = rawSlug ? generateSlug(rawSlug) : generateSlug(name);

    // Verify slug uniqueness
    const existing = await prisma.organization.findUnique({
      where: { slug },
    });

    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const org = await prisma.organization.create({
      data: {
        name,
        slug: finalSlug,
        plan: 'free',
        memberships: {
          create: {
            userId: user.id,
            role: 'owner',
          },
        },
      },
    });

    const response = NextResponse.json({
      id: org.id,
      name: org.name,
      slug: org.slug,
    });

    response.cookies.set('orgId', org.id, { path: '/', httpOnly: false });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create organization' }, { status: 500 });
  }
}
