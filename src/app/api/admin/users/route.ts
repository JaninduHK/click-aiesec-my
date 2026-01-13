import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only admins can view users." },
      { status: 403 },
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { shortLinks: true } },
      shortLinks: { select: { _count: { select: { clickEvents: true } } } },
    },
  });

  const shaped = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    createdById: user.createdById,
    linkCount: user._count.shortLinks,
    clickCount: user.shortLinks.reduce(
      (sum, link) => sum + link._count.clickEvents,
      0,
    ),
  }));

  return NextResponse.json(shaped);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only admins can create users." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { name, email, password, role, lc, designation } = body ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already exists for that email." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "ADMIN" ? "ADMIN" : "USER",
      lc,
      designation,
      createdById: session.user.id as string,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lc: true,
      designation: true,
      createdAt: true,
      _count: {
        select: { shortLinks: true },
      },
    },
  });

  return NextResponse.json({
    ...newUser,
    createdAt: newUser.createdAt.toISOString(),
    linkCount: newUser._count.shortLinks,
  }, { status: 201 });
}
