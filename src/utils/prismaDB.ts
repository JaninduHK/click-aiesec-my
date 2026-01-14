import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

// Configure database connection
const rawConnectionString = process.env.DATABASE_URL
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not set")
}

// Create a connection pool with proper SSL configuration
const pool = new Pool({
  connectionString: rawConnectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Create the Prisma adapter using the pool
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
