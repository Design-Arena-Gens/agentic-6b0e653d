import { readFile, writeFile } from 'fs/promises'
import mammoth from 'mammoth'

export async function wordToHTML(inputPath: string, outputPath: string): Promise<void> {
  const buffer = await readFile(inputPath)
  const result = await mammoth.convertToHtml({ buffer })
  await writeFile(outputPath, result.value)
}

export async function wordToText(inputPath: string, outputPath: string): Promise<void> {
  const buffer = await readFile(inputPath)
  const result = await mammoth.extractRawText({ buffer })
  await writeFile(outputPath, result.value)
}

export async function findReplaceWord(
  inputPath: string,
  outputPath: string,
  find: string,
  replace: string
): Promise<void> {
  const buffer = await readFile(inputPath)
  const result = await mammoth.convertToHtml({ buffer })
  const updatedHtml = result.value.replace(new RegExp(find, 'g'), replace)
  await writeFile(outputPath, updatedHtml)
}

export async function mergeWord(inputPaths: string[], outputPath: string): Promise<void> {
  let mergedContent = ''

  for (const path of inputPaths) {
    const buffer = await readFile(path)
    const result = await mammoth.convertToHtml({ buffer })
    mergedContent += result.value + '<hr>'
  }

  await writeFile(outputPath, mergedContent)
}
