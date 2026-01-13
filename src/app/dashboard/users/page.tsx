import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/prismaDB";
import { authOptions } from "@/utils/auth";
import UsersManager from "@/components/Dashboard/UsersManager";

export const metadata: Metadata = {
  title: "User Management | click.aiesec.my",
  description: "Manage users and permissions",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
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
    orderBy: { createdAt: "desc" },
  });

  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    linkCount: user._count.shortLinks,
  }));

  return <UsersManager initialUsers={serializedUsers} />;
}
