const RESERVED_SLUGS = new Set([
  "api",
  "_next",
  "about",
  "pricing",
  "contact",
  "blogs",
  "blog",
  "error",
  "signin",
  "signup",
  "auth",
  "forgot-password",
  "reset-password",
  "dashboard",
  "admin",
  "site",
  "images",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
]);

export const normalizeSlug = (value: string) => value.trim().toLowerCase();

export const isSlugReserved = (value: string) =>
  RESERVED_SLUGS.has(normalizeSlug(value));

export const isValidSlug = (value: string) =>
  /^[a-zA-Z0-9-]{3,64}$/.test(value.trim());

export const isValidDestination = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
