import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/prismaDB";
import { authOptions } from "@/utils/auth";
import ChartsView from "@/components/Dashboard/ChartsView";

export const metadata: Metadata = {
  title: "Charts | click.aiesec.my",
  description: "Visual analytics and charts",
};

export default async function ChartsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const whereLinks = isAdmin ? {} : { userId: session?.user?.id as string };
  const clickWhere = isAdmin ? {} : { shortLink: { userId: session?.user?.id } };

  const now = new Date();
  const last30days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get clicks over last 30 days grouped by date
  const clicksByDate = isAdmin
    ? await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "ClickEvent"
        WHERE "createdAt" >= ${last30days}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `
    : await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
        SELECT DATE(ce."createdAt") as date, COUNT(*)::int as count
        FROM "ClickEvent" ce
        INNER JOIN "ShortLink" sl ON ce."shortLinkId" = sl.id
        WHERE ce."createdAt" >= ${last30days}
          AND sl."userId" = ${session?.user?.id}
        GROUP BY DATE(ce."createdAt")
        ORDER BY date ASC
      `;

  const [clicksByCountry, clicksByDevice, topLinks] = await Promise.all([
    prisma.clickEvent.groupBy({
      by: ["country"],
      where: { ...clickWhere, country: { not: null }, createdAt: { gte: last30days } },
      _count: true,
      orderBy: { _count: { country: "desc" } },
      take: 10,
    }),
    prisma.clickEvent.groupBy({
      by: ["device"],
      where: { ...clickWhere, device: { not: null }, createdAt: { gte: last30days } },
      _count: true,
      orderBy: { _count: { device: "desc" } },
    }),
    prisma.shortLink.findMany({
      where: whereLinks,
      take: 5,
      orderBy: { clickEvents: { _count: "desc" } },
      include: {
        _count: { select: { clickEvents: true } },
      },
    }),
  ]);

  const chartsData = {
    clicksOverTime: clicksByDate.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      clicks: Number(item.count),
    })),
    locationData: clicksByCountry.map((item) => ({
      country: item.country || "Unknown",
      clicks: item._count,
    })),
    deviceData: clicksByDevice.map((item) => ({
      device: item.device || "Unknown",
      clicks: item._count,
    })),
    topLinksData: topLinks.map((link) => ({
      slug: link.slug,
      title: link.title || link.slug,
      clicks: link._count.clickEvents,
    })),
  };

  return <ChartsView data={chartsData} />;
}
