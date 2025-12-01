// Mock database for demo/development without actual Postgres
export const mockDb = {
  users: new Map(),
  tenants: new Map(),
  jobs: new Map(),
  usage: new Map(),
}

// Initialize with demo data
const demoTenantId = 'demo-tenant-1'
const demoUserId = 'demo-user-1'

mockDb.tenants.set(demoTenantId, {
  id: demoTenantId,
  name: 'Demo Organization',
  slug: 'demo-org',
  plan: 'FREE',
  createdAt: new Date(),
  updatedAt: new Date(),
})

mockDb.users.set('demo@example.com', {
  id: demoUserId,
  email: 'demo@example.com',
  password: '$2a$10$rZ5P3x9YGjQkXxK9EqOqO.W7nK6FZZ8YnL8K9YGxKpYVwZ8K9YGxK', // password: demo123
  name: 'Demo User',
  role: 'ADMIN',
  verified: true,
  tenantId: demoTenantId,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const today = new Date()
today.setHours(0, 0, 0, 0)

mockDb.usage.set(`${demoTenantId}-${today.toISOString()}`, {
  id: 'usage-1',
  tenantId: demoTenantId,
  date: today,
  jobCount: 0,
  storageBytes: BigInt(0),
  apiCalls: 0,
})

export function getMockPrisma() {
  return {
    user: {
      findUnique: async ({ where }: any) => {
        if (where.email) {
          return mockDb.users.get(where.email) || null
        }
        if (where.id) {
          const usersArray = Array.from(mockDb.users.values())
          for (const user of usersArray) {
            if ((user as any).id === where.id) {
              const tenant = mockDb.tenants.get((user as any).tenantId)
              return { ...user, tenant }
            }
          }
        }
        return null
      },
      create: async ({ data }: any) => {
        const user = {
          id: `user-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockDb.users.set(data.email, user)
        return user
      },
    },
    tenant: {
      create: async ({ data }: any) => {
        const tenant = {
          id: `tenant-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockDb.tenants.set(tenant.id, tenant)
        return tenant
      },
      findUnique: async ({ where }: any) => {
        return mockDb.tenants.get(where.id) || null
      },
    },
    job: {
      create: async ({ data }: any) => {
        const job = {
          id: `job-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockDb.jobs.set(job.id, job)
        return job
      },
      findUnique: async ({ where }: any) => {
        return mockDb.jobs.get(where.id) || null
      },
      findMany: async ({ where, orderBy, take }: any) => {
        const jobs = Array.from(mockDb.jobs.values())
          .filter((job: any) => !where?.userId || job.userId === where.userId)
          .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
        return take ? jobs.slice(0, take) : jobs
      },
      update: async ({ where, data }: any) => {
        const job = mockDb.jobs.get(where.id)
        if (job) {
          Object.assign(job, data)
          return job
        }
        return null
      },
    },
    usage: {
      findUnique: async ({ where }: any) => {
        const key = `${where.tenantId_date.tenantId}-${where.tenantId_date.date.toISOString()}`
        return mockDb.usage.get(key) || null
      },
      upsert: async ({ where, create, update }: any) => {
        const key = `${where.tenantId_date.tenantId}-${where.tenantId_date.date.toISOString()}`
        const existing = mockDb.usage.get(key)
        if (existing) {
          if (update.jobCount?.increment) {
            (existing as any).jobCount += update.jobCount.increment
          }
          if (update.apiCalls?.increment) {
            (existing as any).apiCalls += update.apiCalls.increment
          }
          return existing
        } else {
          const newUsage = { id: `usage-${Date.now()}`, ...create }
          mockDb.usage.set(key, newUsage)
          return newUsage
        }
      },
    },
  }
}
