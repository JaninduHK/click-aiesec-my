import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/utils/prismaDB";
import { normalizeSlug } from "@/utils/shortLink";
import { UAParser } from "ua-parser-js";

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
  const city = headerList.get("x-vercel-ip-city") || undefined;
  const region = headerList.get("x-vercel-ip-country-region") || undefined;

  // Parse user agent to extract device, browser, and OS
  let device: string | undefined;
  let browser: string | undefined;
  let os: string | undefined;

  if (userAgent) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Determine device type
    const deviceType = result.device.type;
    if (deviceType === "mobile") {
      device = "Mobile";
    } else if (deviceType === "tablet") {
      device = "Tablet";
    } else {
      device = "Desktop";
    }

    // Get browser name
    browser = result.browser.name || undefined;

    // Get OS name
    os = result.os.name || undefined;
  }

  try {
    await prisma.clickEvent.create({
      data: {
        shortLinkId: link.id,
        ip,
        userAgent: userAgent || undefined,
        referer: referer || undefined,
        country,
        city,
        region,
        device,
        browser,
        os,
      },
    });
  } catch (error) {
    console.error("Failed to record click event", error);
  }

  return NextResponse.redirect(link.destination);
}
