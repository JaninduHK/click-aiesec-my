import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to view analytics." },
      { status: 401 },
    );
  }

  const isAdmin = session.user.role === "ADMIN";
  const { searchParams } = new URL(request.url);
  const userIdFilter = searchParams.get("userId");
  const targetUserId = isAdmin && userIdFilter ? userIdFilter : session.user.id;

  const linkWhere = isAdmin && !userIdFilter ? {} : { userId: targetUserId };
  const clickWhere =
    isAdmin && !userIdFilter
      ? {}
      : {
          shortLink: { userId: targetUserId },
        };

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [linkCount, totalClicks, clicksLast24h, topLinks] = await Promise.all([
    prisma.shortLink.count({ where: linkWhere }),
    prisma.clickEvent.count({ where: clickWhere }),
    prisma.clickEvent.count({
      where: { ...clickWhere, createdAt: { gte: last24h } },
    }),
    prisma.shortLink.findMany({
      where: linkWhere,
      take: 5,
      orderBy: { clickEvents: { _count: "desc" } },
      include: {
        _count: { select: { clickEvents: true } },
      },
    }),
  ]);

  return NextResponse.json({
    linkCount,
    totalClicks,
    clicksLast24h,
    topLinks: topLinks.map((link) => ({
      id: link.id,
      slug: link.slug,
      title: link.title,
      destination: link.destination,
      clickCount: link._count.clickEvents,
    })),
  });
}
