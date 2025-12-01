import { PDFDocument } from 'pdf-lib'
import { readFile, writeFile } from 'fs/promises'

export async function mergePDFs(inputPaths: string[], outputPath: string): Promise<void> {
  const mergedPdf = await PDFDocument.create()

  for (const path of inputPaths) {
    const pdfBytes = await readFile(path)
    const pdf = await PDFDocument.load(pdfBytes)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }

  const mergedPdfBytes = await mergedPdf.save()
  await writeFile(outputPath, mergedPdfBytes)
}

export async function splitPDF(
  inputPath: string,
  outputDir: string,
  splitBy: 'page' | 'range' = 'page'
): Promise<string[]> {
  const pdfBytes = await readFile(inputPath)
  const pdf = await PDFDocument.load(pdfBytes)
  const totalPages = pdf.getPageCount()
  const outputPaths: string[] = []

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create()
    const [copiedPage] = await newPdf.copyPages(pdf, [i])
    newPdf.addPage(copiedPage)

    const outputPath = `${outputDir}/page-${i + 1}.pdf`
    const newPdfBytes = await newPdf.save()
    await writeFile(outputPath, newPdfBytes)
    outputPaths.push(outputPath)
  }

  return outputPaths
}

export async function compressPDF(inputPath: string, outputPath: string): Promise<void> {
  const pdfBytes = await readFile(inputPath)
  const pdf = await PDFDocument.load(pdfBytes)

  const compressedBytes = await pdf.save({
    useObjectStreams: true,
  })

  await writeFile(outputPath, compressedBytes)
}

export async function protectPDF(
  inputPath: string,
  outputPath: string,
  password: string
): Promise<void> {
  const pdfBytes = await readFile(inputPath)
  const pdf = await PDFDocument.load(pdfBytes)

  // Note: pdf-lib doesn't support encryption directly
  // In production, use a library like node-qpdf or hummus
  const pdfBytesOut = await pdf.save()
  await writeFile(outputPath, pdfBytesOut)
}

export async function getPDFInfo(inputPath: string): Promise<{
  pages: number
  title?: string
  author?: string
}> {
  const pdfBytes = await readFile(inputPath)
  const pdf = await PDFDocument.load(pdfBytes)

  return {
    pages: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
  }
}
