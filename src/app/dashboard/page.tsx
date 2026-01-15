import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/prismaDB";
import { authOptions } from "@/utils/auth";
import AnalyticsDashboard from "@/components/Dashboard/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics | click.aiesec.my",
  description: "Comprehensive analytics for your shortened links",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const whereLinks = isAdmin ? {} : { userId: session?.user?.id as string };
  const clickWhere = isAdmin ? {} : { shortLink: { userId: session?.user?.id } };

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    linkCount,
    totalClicks,
    uniqueClicks,
    clicksLast24h,
    uniqueClicksLast24h,
    clicksLast7days,
    topLinks,
    clicksByCountry,
    clicksByDevice,
    clicksByBrowser,
    clicksByOs,
    recentClicks,
  ] = await Promise.all([
    prisma.shortLink.count({ where: whereLinks }),
    prisma.clickEvent.count({ where: clickWhere }),
    // Count unique clicks by distinct IP addresses
    prisma.clickEvent.groupBy({
      by: ["ip"],
      where: { ...clickWhere, ip: { not: null } },
    }).then((result) => result.length),
    prisma.clickEvent.count({
      where: { ...clickWhere, createdAt: { gte: last24h } },
    }),
    // Count unique clicks in last 24h by distinct IP addresses
    prisma.clickEvent.groupBy({
      by: ["ip"],
      where: { ...clickWhere, ip: { not: null }, createdAt: { gte: last24h } },
    }).then((result) => result.length),
    prisma.clickEvent.count({
      where: { ...clickWhere, createdAt: { gte: last7days } },
    }),
    prisma.shortLink.findMany({
      where: whereLinks,
      take: 10,
      orderBy: { clickEvents: { _count: "desc" } },
      include: {
        _count: { select: { clickEvents: true } },
      },
    }),
    prisma.clickEvent.groupBy({
      by: ["country"],
      where: { ...clickWhere, country: { not: null } },
      _count: true,
      orderBy: { _count: { country: "desc" } },
      take: 10,
    }),
    prisma.clickEvent.groupBy({
      by: ["device"],
      where: { ...clickWhere, device: { not: null } },
      _count: true,
      orderBy: { _count: { device: "desc" } },
    }),
    prisma.clickEvent.groupBy({
      by: ["browser"],
      where: { ...clickWhere, browser: { not: null } },
      _count: true,
      orderBy: { _count: { browser: "desc" } },
      take: 5,
    }),
    prisma.clickEvent.groupBy({
      by: ["os"],
      where: { ...clickWhere, os: { not: null } },
      _count: true,
      orderBy: { _count: { os: "desc" } },
      take: 5,
    }),
    prisma.clickEvent.findMany({
      where: clickWhere,
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        shortLink: {
          select: { slug: true, title: true },
        },
      },
    }),
  ]);

  const analyticsData = {
    overview: {
      linkCount,
      totalClicks,
      uniqueClicks,
      clicksLast24h,
      uniqueClicksLast24h,
      clicksLast7days,
      avgClicksPerLink: linkCount > 0 ? Math.round(totalClicks / linkCount) : 0,
    },
    topLinks: topLinks.map((link) => ({
      id: link.id,
      slug: link.slug,
      title: link.title || link.slug,
      clicks: link._count.clickEvents,
    })),
    locations: clicksByCountry.map((item) => ({
      country: item.country || "Unknown",
      clicks: item._count,
    })),
    devices: clicksByDevice.map((item) => ({
      device: item.device || "Unknown",
      clicks: item._count,
    })),
    browsers: clicksByBrowser.map((item) => ({
      browser: item.browser || "Unknown",
      clicks: item._count,
    })),
    operatingSystems: clicksByOs.map((item) => ({
      os: item.os || "Unknown",
      clicks: item._count,
    })),
    recentActivity: recentClicks.map((click) => ({
      id: click.id,
      slug: click.shortLink.slug,
      title: click.shortLink.title,
      country: click.country,
      city: click.city,
      device: click.device,
      browser: click.browser,
      os: click.os,
      timestamp: click.createdAt.toISOString(),
    })),
  };

  return <AnalyticsDashboard data={analyticsData} />;
}
