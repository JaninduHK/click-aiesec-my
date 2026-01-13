import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/utils/prismaDB";
import { normalizeSlug } from "@/utils/shortLink";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams.slug);

  const link = await prisma.shortLink.findUnique({
    where: { slug },
  });

  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  const headerList = await headers();
  const referer = headerList.get("referer");
  const userAgent = headerList.get("user-agent");
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    undefined;
  const country =
    headerList.get("x-vercel-ip-country") ||
    headerList.get("cf-ipcountry") ||
    undefined;

  try {
    await prisma.clickEvent.create({
      data: {
        shortLinkId: link.id,
        ip,
        userAgent: userAgent || undefined,
        referer: referer || undefined,
        country,
      },
    });
  } catch (error) {
    console.error("Failed to record click event", error);
  }

  return NextResponse.redirect(link.destination);
}
