import { prisma } from './db'
import { getMaxJobsPerDay } from './plans'

export async function checkRateLimit(tenantId: string): Promise<boolean> {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })

  if (!tenant) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const usage = await prisma.usage.findUnique({
    where: {
      tenantId_date: {
        tenantId,
        date: today,
      },
    },
  })

  const maxJobs = getMaxJobsPerDay(tenant.plan)
  const currentJobs = usage?.jobCount || 0

  return currentJobs < maxJobs
}

export async function incrementUsage(tenantId: string): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.usage.upsert({
    where: {
      tenantId_date: {
        tenantId,
        date: today,
      },
    },
    create: {
      tenantId,
      date: today,
      jobCount: 1,
      apiCalls: 1,
    },
    update: {
      jobCount: { increment: 1 },
      apiCalls: { increment: 1 },
    },
  })
}

export async function getUsageStats(tenantId: string): Promise<{
  jobCount: number
  maxJobs: number
  storageBytes: bigint
}> {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })

  if (!tenant) {
    return { jobCount: 0, maxJobs: 0, storageBytes: BigInt(0) }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const usage = await prisma.usage.findUnique({
    where: {
      tenantId_date: {
        tenantId,
        date: today,
      },
    },
  })

  return {
    jobCount: usage?.jobCount || 0,
    maxJobs: getMaxJobsPerDay(tenant.plan),
    storageBytes: usage?.storageBytes || BigInt(0),
  }
}
