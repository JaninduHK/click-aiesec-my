import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/prismaDB";
import { authOptions } from "@/utils/auth";
import LinksTable from "@/components/Dashboard/LinksTable";

export const metadata: Metadata = {
  title: "Links | click.aiesec.my",
  description: "Manage your shortened links",
};

export default async function LinksPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const whereLinks = isAdmin ? {} : { userId: session?.user?.id as string };

  const links = await prisma.shortLink.findMany({
    where: whereLinks,
    include: {
      user: { select: { id: true, name: true, email: true, lc: true } },
      _count: { select: { clickEvents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedLinks = links.map((link) => ({
    id: link.id,
    slug: link.slug,
    destination: link.destination,
    title: link.title,
    isActive: link.isActive,
    clickCount: link._count.clickEvents,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
    user: isAdmin ? link.user : undefined,
  }));

  return <LinksTable initialLinks={serializedLinks} isAdmin={isAdmin} />;
}
