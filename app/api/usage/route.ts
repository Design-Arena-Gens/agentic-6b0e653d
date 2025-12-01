import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getUsageStats } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(req)

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const usage = await getUsageStats(currentUser.tenantId)

    return NextResponse.json({
      usage: {
        jobCount: usage.jobCount,
        maxJobs: usage.maxJobs,
        storageBytes: usage.storageBytes.toString(),
      },
    })
  } catch (error) {
    console.error('Get usage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
