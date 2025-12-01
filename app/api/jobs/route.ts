import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createJob, JobType } from '@/lib/jobs'
import { saveMultipleFiles } from '@/lib/storage'
import { checkRateLimit, incrementUsage } from '@/lib/rate-limit'
import { getMaxFileSize } from '@/lib/plans'

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(req)

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobs = await prisma.job.findMany({
      where: { userId: currentUser.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(req)

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check rate limit
    const canProcess = await checkRateLimit(currentUser.tenantId)
    if (!canProcess) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const formData = await req.formData()
    const type = formData.get('type') as JobType
    const files = formData.getAll('files') as File[]

    if (!type || files.length === 0) {
      return NextResponse.json({ error: 'Missing type or files' }, { status: 400 })
    }

    // Get tenant to check plan limits
    const tenant = await prisma.tenant.findUnique({
      where: { id: currentUser.tenantId },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const maxFileSize = getMaxFileSize(tenant.plan as any)

    // Validate file sizes
    for (const file of files) {
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `File size exceeds limit for ${tenant.plan} plan` },
          { status: 400 }
        )
      }
    }

    // Save files
    const fileBuffers = await Promise.all(
      files.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        name: file.name,
      }))
    )

    const filePaths = await saveMultipleFiles(fileBuffers)

    // Create job
    const jobId = await createJob(
      type,
      filePaths,
      currentUser.userId,
      currentUser.tenantId
    )

    // Increment usage
    await incrementUsage(currentUser.tenantId)

    return NextResponse.json({ jobId, message: 'Job created successfully' })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
