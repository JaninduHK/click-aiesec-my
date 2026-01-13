import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to view analytics." },
      { status: 401 },
    );
  }

  const link = await prisma.shortLink.findUnique({
    where: { id: resolvedParams.id },
    select: {
      id: true,
      userId: true,
      slug: true,
      title: true,
      destination: true,
      createdAt: true,
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && link.userId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const daysParam = Number(searchParams.get("days"));
  const windowDays =
    Number.isFinite(daysParam) && daysParam > 0
      ? Math.min(daysParam, 180)
      : 30;

  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - windowDays);

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalClicks, events] = await Promise.all([
    prisma.clickEvent.count({ where: { shortLinkId: link.id } }),
    prisma.clickEvent.findMany({
      where: { shortLinkId: link.id, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  let clicksLast24h = 0;
  let clicksLast7d = 0;
  const dailyCounts: Record<string, number> = {};
  const referrers: Record<string, number> = {};
  const countries: Record<string, number> = {};

  events.forEach((event) => {
    if (event.createdAt >= last24h) {
      clicksLast24h += 1;
    }

    if (event.createdAt >= last7d) {
      clicksLast7d += 1;
    }

    const dayKey = event.createdAt.toISOString().slice(0, 10);
    dailyCounts[dayKey] = (dailyCounts[dayKey] ?? 0) + 1;

    if (event.referer) {
      try {
        const host = new URL(event.referer).hostname || event.referer;
        referrers[host] = (referrers[host] ?? 0) + 1;
      } catch {
        referrers[event.referer] = (referrers[event.referer] ?? 0) + 1;
      }
    } else {
      referrers["Direct / None"] = (referrers["Direct / None"] ?? 0) + 1;
    }

    const countryKey = event.country || "Unknown";
    countries[countryKey] = (countries[countryKey] ?? 0) + 1;
  });

  return NextResponse.json({
    link,
    totalClicks,
    clicksLast24h,
    clicksLast7d,
    windowDays,
    dailyCounts,
    referrers,
    countries,
    recentEvents: events.slice(0, 50),
  });
}
