import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, tenantName } = await req.json()

    // Validate input
    if (!name || !email || !password || !tenantName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create tenant and user
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        slug: tenantName.toLowerCase().replace(/\s+/g, '-') + '-' + uuidv4().substring(0, 8),
        plan: 'FREE',
      },
    })

    const verifyToken = uuidv4()

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tenantId: tenant.id,
        role: 'ADMIN',
        verifyToken,
      },
    })

    // In production, send verification email here
    console.log(`Verification token for ${email}: ${verifyToken}`)

    return NextResponse.json({
      message: 'Account created successfully. Please verify your email.',
      userId: user.id,
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
