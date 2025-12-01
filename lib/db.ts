import { getMockPrisma } from './db-mock'

// Use mock database for demo (no actual Postgres required)
export const prisma = getMockPrisma() as any
