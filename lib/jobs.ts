import { prisma } from './db'
import { mergePDFs, splitPDF, compressPDF, protectPDF } from './processors/pdf'
import { mergeExcel, splitExcel, excelToCSV, csvToExcel, cleanExcelData } from './processors/excel'
import { wordToHTML, wordToText, mergeWord } from './processors/word'
import { convertDocument } from './processors/converter'
import { deleteFiles } from './storage'

export type JobType =
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-compress'
  | 'pdf-protect'
  | 'excel-merge'
  | 'excel-split'
  | 'excel-csv'
  | 'excel-clean'
  | 'word-merge'
  | 'word-html'
  | 'word-text'
  | 'convert'

export interface JobConfig {
  type: JobType
  inputFiles: string[]
  outputDir: string
  options?: Record<string, any>
}

export async function processJob(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({ where: { id: jobId } })

  if (!job) {
    throw new Error('Job not found')
  }

  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'PROCESSING' },
    })

    const inputFiles = job.inputFiles as string[]
    const config = (job.config as Record<string, any>) || {}
    const outputFiles: string[] = []

    const outputPath = `/tmp/uploads/output-${jobId}.pdf`

    switch (job.type) {
      case 'pdf-merge':
        await mergePDFs(inputFiles, outputPath)
        outputFiles.push(outputPath)
        break

      case 'pdf-split':
        const splitFiles = await splitPDF(inputFiles[0], '/tmp/uploads')
        outputFiles.push(...splitFiles)
        break

      case 'pdf-compress':
        await compressPDF(inputFiles[0], outputPath)
        outputFiles.push(outputPath)
        break

      case 'pdf-protect':
        await protectPDF(inputFiles[0], outputPath, config.password || 'password')
        outputFiles.push(outputPath)
        break

      case 'excel-merge':
        const excelOutput = `/tmp/uploads/output-${jobId}.xlsx`
        await mergeExcel(inputFiles, excelOutput)
        outputFiles.push(excelOutput)
        break

      case 'excel-split':
        const excelSplitFiles = await splitExcel(inputFiles[0], '/tmp/uploads')
        outputFiles.push(...excelSplitFiles)
        break

      case 'excel-csv':
        const csvOutput = `/tmp/uploads/output-${jobId}.csv`
        await excelToCSV(inputFiles[0], csvOutput)
        outputFiles.push(csvOutput)
        break

      case 'excel-clean':
        const cleanOutput = `/tmp/uploads/output-${jobId}.xlsx`
        await cleanExcelData(inputFiles[0], cleanOutput)
        outputFiles.push(cleanOutput)
        break

      case 'word-merge':
        const wordOutput = `/tmp/uploads/output-${jobId}.html`
        await mergeWord(inputFiles, wordOutput)
        outputFiles.push(wordOutput)
        break

      case 'word-html':
        const htmlOutput = `/tmp/uploads/output-${jobId}.html`
        await wordToHTML(inputFiles[0], htmlOutput)
        outputFiles.push(htmlOutput)
        break

      case 'word-text':
        const textOutput = `/tmp/uploads/output-${jobId}.txt`
        await wordToText(inputFiles[0], textOutput)
        outputFiles.push(textOutput)
        break

      case 'convert':
        const convertOutput = `/tmp/uploads/output-${jobId}.${config.toFormat}`
        await convertDocument(
          inputFiles[0],
          convertOutput,
          config.fromFormat,
          config.toFormat
        )
        outputFiles.push(convertOutput)
        break

      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        outputFiles,
      },
    })

    // Schedule cleanup of input and output files
    setTimeout(() => {
      deleteFiles([...inputFiles, ...outputFiles])
    }, 3600000) // 1 hour

  } catch (error: any) {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'FAILED',
        error: error.message,
      },
    })
  }
}

export async function createJob(
  type: JobType,
  inputFiles: string[],
  userId: string,
  tenantId: string,
  config?: Record<string, any>
): Promise<string> {
  const job = await prisma.job.create({
    data: {
      type,
      inputFiles,
      config,
      userId,
      tenantId,
      status: 'PENDING',
    },
  })

  // Process job asynchronously
  processJob(job.id).catch(console.error)

  return job.id
}
