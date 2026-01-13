import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Self-service registration is disabled. Ask an admin to invite you." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { name, email, password, role } = body ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase();
  const exist = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (exist) {
    return NextResponse.json(
      { error: "User already exists!" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "ADMIN" ? "ADMIN" : "USER",
      createdById: session.user.id as string,
    },
  });

  return NextResponse.json(
    { success: true, message: "User created successfully!" },
    { status: 201 },
  );
}
