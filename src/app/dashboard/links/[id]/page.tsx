import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/prismaDB";
import { authOptions } from "@/utils/auth";
import CopyButton from "@/components/Dashboard/CopyButton";

export const metadata: Metadata = {
  title: "Link analytics",
  description: "Detailed analytics for a short link.",
};

const shortDomain =
  process.env.NEXT_PUBLIC_SHORT_DOMAIN || "https://click.aiesec.my";

export default async function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const link = await prisma.shortLink.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  if (!link) {
    redirect("/dashboard");
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && link.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [events, totalClicks] = await Promise.all([
    prisma.clickEvent.findMany({
      where: { shortLinkId: link.id, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.clickEvent.count({ where: { shortLinkId: link.id } }),
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

  const dailySeries = Object.entries(dailyCounts).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  const maxDaily =
    dailySeries.length > 0
      ? Math.max(...dailySeries.map(([, count]) => count))
      : 1;

  const topReferrers = Object.entries(referrers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const topCountries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <section className="space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-primary">
                Link analytics
              </p>
              <h1 className="text-2xl font-bold text-dark dark:text-white">
                {link.title || "Untitled link"}
              </h1>
              <p className="text-body-secondary text-sm">
                {shortDomain.replace(/\/$/, "")}/{link.slug}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                value={`${shortDomain.replace(/\/$/, "")}/${link.slug}`}
                label="Copy link"
              />
              <Link
                href="/dashboard"
                className="rounded-lg border border-stroke px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-body-secondary">
            <span>
              Destination:{" "}
              <a
                href={link.destination}
                target="_blank"
                className="text-primary underline"
                rel="noreferrer"
              >
                {link.destination}
              </a>
            </span>
            {isAdmin && link.user?.email && (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-800 dark:bg-dark-3 dark:text-white">
                Owner: {link.user.email}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="All-time clicks" value={totalClicks} />
          <StatCard label="Clicks (24h)" value={clicksLast24h} />
          <StatCard label="Clicks (7 days)" value={clicksLast7d} />
          <StatCard label="Tracked events (30 days)" value={events.length} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-dark dark:text-white">
                  Daily clicks (last 30 days)
                </p>
                <span className="text-xs text-body-secondary">
                  {dailySeries.length} days of activity
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {dailySeries.length === 0 && (
                  <p className="text-sm text-body-secondary">
                    No clicks captured yet. Share your short link to start seeing data.
                  </p>
                )}
                {dailySeries.map(([date, count]) => (
                  <div
                    key={date}
                    className="flex items-center gap-3 text-sm text-body-secondary"
                  >
                    <span className="w-24">{date}</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-dark-3">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(count / maxDaily) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-dark dark:text-white">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-dark dark:text-white">
                  Recent clicks
                </p>
                <span className="text-xs text-body-secondary">
                  Showing up to 20 latest events
                </span>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stroke text-body-secondary dark:border-dark-3">
                      <th className="px-2 py-3">Time</th>
                      <th className="px-2 py-3">Referrer</th>
                      <th className="px-2 py-3">Country</th>
                      <th className="px-2 py-3">IP (last octet hidden)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke dark:divide-dark-3">
                    {events.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-2 py-4 text-center text-body-secondary"
                        >
                          No clicks yet.
                        </td>
                      </tr>
                    )}
                    {events.slice(0, 20).map((event) => (
                      <tr key={event.id}>
                        <td className="px-2 py-2 text-body-secondary">
                          {new Intl.DateTimeFormat("en", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(event.createdAt))}
                        </td>
                        <td className="px-2 py-2 text-body-secondary">
                          {event.referer || "Direct"}
                        </td>
                        <td className="px-2 py-2 text-body-secondary">
                          {event.country || "Unknown"}
                        </td>
                        <td className="px-2 py-2 text-body-secondary">
                          {event.ip
                            ? event.ip.replace(/\.\d+$/, ".xxx")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <p className="text-lg font-semibold text-dark dark:text-white">
                Top referrers
              </p>
              <div className="mt-3 space-y-2">
                {topReferrers.length === 0 && (
                  <p className="text-sm text-body-secondary">
                    No referrer data yet.
                  </p>
                )}
                {topReferrers.map(([ref, count]) => (
                  <div
                    key={ref}
                    className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2 text-sm text-body-secondary dark:border-dark-3"
                  >
                    <span className="truncate">{ref}</span>
                    <span className="text-dark dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <p className="text-lg font-semibold text-dark dark:text-white">
                Countries
              </p>
              <div className="mt-3 space-y-2">
                {topCountries.length === 0 && (
                  <p className="text-sm text-body-secondary">
                    No country data yet.
                  </p>
                )}
                {topCountries.map(([country, count]) => (
                  <div
                    key={country}
                    className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2 text-sm text-body-secondary dark:border-dark-3"
                  >
                    <span>{country}</span>
                    <span className="text-dark dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
    <p className="text-sm text-body-secondary">{label}</p>
    <p className="text-3xl font-semibold text-dark dark:text-white">{value}</p>
  </div>
);
