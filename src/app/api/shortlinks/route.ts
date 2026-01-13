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

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to view links." },
      { status: 401 },
    );
  }

  const isAdmin = session.user.role === "ADMIN";
  const { searchParams } = new URL(request.url);
  const userIdFilter = searchParams.get("userId");

  const where = isAdmin
    ? userIdFilter
      ? { userId: userIdFilter }
      : {}
    : { userId: session.user.id };

  const links = await prisma.shortLink.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { clickEvents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    links.map((link) => ({
      ...link,
      clickCount: link._count.clickEvents,
      _count: undefined,
    })),
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to create links." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { slug, destination, title } = body ?? {};

  if (!slug || !destination) {
    return NextResponse.json(
      { error: "Slug and destination URL are required." },
      { status: 400 },
    );
  }

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

  if (isSlugReserved(normalizedSlug)) {
    return NextResponse.json(
      { error: "Slug is reserved. Please choose another." },
      { status: 400 },
    );
  }

  if (!isValidDestination(destination)) {
    return NextResponse.json(
      { error: "Destination must be a valid http(s) URL." },
      { status: 400 },
    );
  }

  const existing = await prisma.shortLink.findUnique({
    where: { slug: normalizedSlug },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Slug is already in use. Try another one." },
      { status: 409 },
    );
  }

  const newLink = await prisma.shortLink.create({
    data: {
      slug: normalizedSlug,
      destination,
      title,
      userId: session.user.id as string,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { clickEvents: true } },
    },
  });

  return NextResponse.json(
    { ...newLink, clickCount: newLink._count.clickEvents, _count: undefined },
    { status: 201 },
  );
}
