import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import {
  isSlugReserved,
  isValidDestination,
  isValidSlug,
  normalizeSlug,
} from "@/utils/shortLink";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to view links." },
      { status: 401 },
    );
  }

  const link = await prisma.shortLink.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { clickEvents: true } },
      clickEvents: {
        orderBy: { createdAt: "desc" },
        take: 25,
      },
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && link.userId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  return NextResponse.json({
    ...link,
    clickCount: link._count.clickEvents,
    _count: undefined,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to update links." },
      { status: 401 },
    );
  }

  const link = await prisma.shortLink.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && link.userId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json();
  const { slug, destination, title, isActive } = body ?? {};
  const updateData: Record<string, any> = {};

  if (slug) {
    const normalizedSlug = normalizeSlug(slug);

    if (!isValidSlug(normalizedSlug)) {
      return NextResponse.json(
        {
          error:
            "Slug must be 3-64 characters and only contain letters, numbers, or hyphens.",
        },
        { status: 400 },
      );
    }

    if (isSlugReserved(normalizeSlug(slug))) {
      return NextResponse.json(
        { error: "Slug is reserved. Please choose another." },
        { status: 400 },
      );
    }

    const existing = await prisma.shortLink.findFirst({
      where: { slug: normalizedSlug, NOT: { id: resolvedParams.id } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug is already in use. Try another one." },
        { status: 409 },
      );
    }

    updateData.slug = normalizedSlug;
  }

  if (destination) {
    if (!isValidDestination(destination)) {
      return NextResponse.json(
        { error: "Destination must be a valid http(s) URL." },
        { status: 400 },
      );
    }

    updateData.destination = destination;
  }

  if (typeof title === "string") {
    updateData.title = title;
  }

  if (typeof isActive === "boolean") {
    updateData.isActive = isActive;
  }

  const updated = await prisma.shortLink.update({
    where: { id: resolvedParams.id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { clickEvents: true } },
    },
  });

  return NextResponse.json(
    { ...updated, clickCount: updated._count.clickEvents, _count: undefined },
    { status: 200 },
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to delete links." },
      { status: 401 },
    );
  }

  const link = await prisma.shortLink.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && link.userId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.shortLink.delete({
    where: { id: resolvedParams.id },
  });

  return NextResponse.json(
    { success: true, message: "Link deleted." },
    { status: 200 },
  );
}
