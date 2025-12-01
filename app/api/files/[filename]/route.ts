import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/tmp/uploads'

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    const filePath = join(UPLOAD_DIR, filename)

    const fileBuffer = await readFile(filePath)

    // Determine content type
    let contentType = 'application/octet-stream'
    if (filename.endsWith('.pdf')) contentType = 'application/pdf'
    else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else if (filename.endsWith('.docx')) {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
      contentType = 'image/jpeg'
    } else if (filename.endsWith('.png')) contentType = 'image/png'
    else if (filename.endsWith('.csv')) contentType = 'text/csv'
    else if (filename.endsWith('.txt')) contentType = 'text/plain'
    else if (filename.endsWith('.html')) contentType = 'text/html'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('File download error:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
