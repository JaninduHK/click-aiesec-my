import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

// Configure database connection
const rawConnectionString = process.env.DATABASE_URL
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not set")
}

// Check if using connection pooling (port 6543)
const isPooling = rawConnectionString.includes(':6543') || rawConnectionString.includes('pooler')

// Only set SSL for direct connections, not for pooling
const dbUrl = new URL(rawConnectionString)
if (!isPooling && !dbUrl.searchParams.has("sslmode")) {
  dbUrl.searchParams.set("sslmode", "require")
}

// Configure adapter based on connection type
const adapter = new PrismaPg({
  connectionString: dbUrl.toString(),
  // SSL config only for direct connections
  ...(isPooling ? {} : { ssl: { rejectUnauthorized: false } }),
})

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
