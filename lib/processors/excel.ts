import ExcelJS from 'exceljs'
import { readFile, writeFile } from 'fs/promises'

export async function mergeExcel(inputPaths: string[], outputPath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()

  for (const path of inputPaths) {
    const sourceWorkbook = new ExcelJS.Workbook()
    await sourceWorkbook.xlsx.readFile(path)

    sourceWorkbook.eachSheet((sheet) => {
      const newSheet = workbook.addWorksheet(sheet.name)
      newSheet.model = Object.assign({}, sheet.model)
    })
  }

  await workbook.xlsx.writeFile(outputPath)
}

export async function splitExcel(inputPath: string, outputDir: string): Promise<string[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(inputPath)

  const outputPaths: string[] = []

  workbook.eachSheet((sheet, index) => {
    const newWorkbook = new ExcelJS.Workbook()
    const newSheet = newWorkbook.addWorksheet(sheet.name)
    newSheet.model = Object.assign({}, sheet.model)

    const outputPath = `${outputDir}/sheet-${index}.xlsx`
    newWorkbook.xlsx.writeFile(outputPath)
    outputPaths.push(outputPath)
  })

  return outputPaths
}

export async function excelToCSV(inputPath: string, outputPath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(inputPath)

  const worksheet = workbook.worksheets[0]
  await workbook.csv.writeFile(outputPath, { sheetName: worksheet.name })
}

export async function csvToExcel(inputPath: string, outputPath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  await workbook.csv.readFile(inputPath)

  await workbook.xlsx.writeFile(outputPath)
}

export async function cleanExcelData(inputPath: string, outputPath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(inputPath)

  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.value === null || cell.value === undefined || cell.value === '') {
          cell.value = ''
        }
        if (typeof cell.value === 'string') {
          cell.value = cell.value.trim()
        }
      })
    })
  })

  await workbook.xlsx.writeFile(outputPath)
}

export async function formatExcel(
  inputPath: string,
  outputPath: string,
  options: { bold?: boolean; fontSize?: number }
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(inputPath)

  workbook.eachSheet((sheet) => {
    sheet.getRow(1).eachCell((cell) => {
      cell.font = {
        bold: options.bold ?? true,
        size: options.fontSize ?? 12,
      }
    })
  })

  await workbook.xlsx.writeFile(outputPath)
}
