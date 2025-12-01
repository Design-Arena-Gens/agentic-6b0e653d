import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/tmp/uploads'

export async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function saveFile(buffer: Buffer, originalName: string): Promise<string> {
  await ensureUploadDir()

  const fileId = uuidv4()
  const extension = originalName.split('.').pop()
  const fileName = `${fileId}.${extension}`
  const filePath = join(UPLOAD_DIR, fileName)

  await writeFile(filePath, buffer)

  return filePath
}

export async function saveMultipleFiles(
  files: Array<{ buffer: Buffer; name: string }>
): Promise<string[]> {
  const paths: string[] = []

  for (const file of files) {
    const path = await saveFile(file.buffer, file.name)
    paths.push(path)
  }

  return paths
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

export async function deleteFiles(filePaths: string[]): Promise<void> {
  for (const path of filePaths) {
    await deleteFile(path)
  }
}

export function getFileUrl(filePath: string): string {
  const fileName = filePath.split('/').pop()
  return `/api/files/${fileName}`
}

export async function scheduleFileCleanup(filePath: string, delayMs: number = 3600000): Promise<void> {
  // Delete file after delay (default 1 hour)
  setTimeout(async () => {
    await deleteFile(filePath)
  }, delayMs)
}
