import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

// Ensure the database connection enforces SSL (required by Supabase).
const rawConnectionString = process.env.DATABASE_URL
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not set")
}
const dbUrl = new URL(rawConnectionString)
if (!dbUrl.searchParams.has("sslmode")) {
  dbUrl.searchParams.set("sslmode", "require")
}

// Configure SSL for Supabase connection pooling
const adapter = new PrismaPg({
  connectionString: dbUrl.toString(),
  ssl: {
    rejectUnauthorized: false,
    // Additional SSL options for Supabase
    ca: undefined,
    checkServerIdentity: () => undefined,
  },
})

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
