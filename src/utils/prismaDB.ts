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

// Configure connection string with SSL parameters
const dbUrl = new URL(rawConnectionString)
if (!dbUrl.searchParams.has("sslmode")) {
  dbUrl.searchParams.set("sslmode", "require")
}

// Configure adapter with SSL that works for both pooling and direct connections
const adapter = new PrismaPg({
  connectionString: dbUrl.toString(),
  ssl: {
    rejectUnauthorized: false,
  },
})

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
