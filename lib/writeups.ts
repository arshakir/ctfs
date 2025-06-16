import fs from 'fs'
import path from 'path'

export interface Writeup {
  slug: string
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  date: string
  tags: string[]
  ctf: string
  ctfSlug: string
  content?: string
}

export interface CTF {
  slug: string
  name: string
  description: string
  difficulty?: string
  content?: string
  writeups: Writeup[]
}

// Validation functions
export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(slug)
}

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateWriteup(writeup: Partial<Writeup>): writeup is Writeup {
  return !!(
    writeup.slug &&
    writeup.title &&
    writeup.description &&
    writeup.category &&
    writeup.difficulty &&
    writeup.date &&
    writeup.tags &&
    writeup.ctf &&
    writeup.ctfSlug &&
    isValidSlug(writeup.slug) &&
    isValidSlug(writeup.ctfSlug)
  )
}

export function validateCTF(ctf: Partial<CTF>): ctf is CTF {
  return !!(
    ctf.slug &&
    ctf.name &&
    ctf.description &&
    isValidSlug(ctf.slug) &&
    Array.isArray(ctf.writeups)
  )
}

// Path to writeups directory
const WRITEUPS_DIRECTORY = path.join(process.cwd(), 'writeups')

// Helper function to ensure writeups directory exists
function ensureWriteupsDirectory() {
  if (!fs.existsSync(WRITEUPS_DIRECTORY)) {
    throw new Error(`Writeups directory not found: ${WRITEUPS_DIRECTORY}`)
  }
}

// Read all markdown files from the writeups directory
function readMarkdownFiles(): { 
  writeups: { filePath: string; slug: string; ctfSlug: string }[],
  ctfs: { filePath: string; slug: string }[]
} {
  ensureWriteupsDirectory()
  
  const writeupFiles: { filePath: string; slug: string; ctfSlug: string }[] = []
  const ctfFiles: { filePath: string; slug: string }[] = []
  
  function traverseDirectory(dir: string, currentCtfSlug?: string) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // If we're in the root writeups directory, this directory name is the CTF slug
        const ctfSlug = currentCtfSlug || normalizeSlug(item)
        traverseDirectory(fullPath, ctfSlug)
      } else if (item === 'README.md') {
        if (currentCtfSlug) {
          // This is a writeup README.md file
          const parentDir = path.basename(path.dirname(fullPath))
          const slug = normalizeSlug(parentDir)
          writeupFiles.push({ filePath: fullPath, slug, ctfSlug: currentCtfSlug })
        } else {
          // This is a CTF-level README.md file
          // The current directory name is the CTF slug
          const ctfSlug = normalizeSlug(path.basename(dir))
          ctfFiles.push({ filePath: fullPath, slug: ctfSlug })
        }
      } else if ((item.endsWith('.md') || item.endsWith('.markdown')) && item !== 'README.md') {
        // This is a regular markdown file (not README.md)
        const slug = normalizeSlug(path.basename(item, path.extname(item)))
        const ctfSlug = currentCtfSlug || normalizeSlug(path.basename(path.dirname(fullPath)))
        writeupFiles.push({ filePath: fullPath, slug, ctfSlug })
      }
    }
  }
  
  traverseDirectory(WRITEUPS_DIRECTORY)
  return { writeups: writeupFiles, ctfs: ctfFiles }
}

// Parse a CTF README file and extract CTF data
function parseCTFFile(filePath: string, slug: string): CTF | null {
  try {
    
    // Read the markdown content
    const fileContents = fs.readFileSync(filePath, 'utf8')
    
    // CTFs don't need metadata.json - create CTF from directory name and README content
    const ctf: Partial<CTF> = {
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Write-ups from ${slug.replace(/-/g, ' ')}`,
      content: fileContents.trim(),
      writeups: []
    }
    
    
    // Validate the CTF object
    if (validateCTF(ctf)) {
      return ctf
    } else {
      console.warn(`Invalid CTF data for ${slug}:`, ctf)
      return null
    }
  } catch (error) {
    console.error(`Error parsing CTF file ${filePath}:`, error)
    return null
  }
}

function parseMarkdownFile(filePath: string, slug: string, ctfSlug: string): Writeup | null {
  try {
    // Read the markdown content
    const fileContents = fs.readFileSync(filePath, 'utf8')
    
    // Look for metadata.json in the same directory
    const metadataPath = path.join(path.dirname(filePath), 'metadata.json')
    
    if (!fs.existsSync(metadataPath)) {
      console.warn(`No metadata.json found for ${filePath}`)
      return null
    }
    
    // Read and parse metadata
    const metadataContents = fs.readFileSync(metadataPath, 'utf8')
    const metadata = JSON.parse(metadataContents)
    
    // Create writeup object from metadata
    const writeup: Partial<Writeup> = {
      slug,
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      difficulty: metadata.difficulty,
      date: metadata.date,
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      ctf: metadata.ctf,
      ctfSlug: metadata.ctfSlug || metadata.ctf_slug || ctfSlug, // Use detected ctfSlug as fallback
      content: fileContents.trim()
    }
    
    // Validate the writeup
    if (validateWriteup(writeup)) {
      return writeup
    } else {
      console.warn(`Invalid writeup data in ${filePath}:`, writeup)
      return null
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

// Load all writeups from markdown files
export function loadWriteupsFromMarkdown(): Writeup[] {
  try {
    const { writeups: markdownFiles } = readMarkdownFiles()
    const writeups: Writeup[] = []
    
    for (const { filePath, slug, ctfSlug } of markdownFiles) {
      const writeup = parseMarkdownFile(filePath, slug, ctfSlug)
      if (writeup) {
        writeups.push(writeup)
      }
    }
    
    return writeups
  } catch (error) {
    console.error('Error loading writeups from markdown:', error)
    return []
  }
}

// Load CTF data from markdown files
export function loadCTFsFromMarkdown(): Map<string, CTF> {
  try {
    const { ctfs: ctfFiles } = readMarkdownFiles()
    
    const ctfMap = new Map<string, CTF>()
    
    for (const { filePath, slug } of ctfFiles) {
      const ctf = parseCTFFile(filePath, slug)
      if (ctf) { // Only add if parsing was successful and validation passed
        ctfMap.set(slug, ctf)
      } else {
        console.warn(`Failed to parse CTF: ${slug}`)
      }
    }
    
    return ctfMap
  } catch (error) {
    console.error('Error loading CTFs from markdown:', error)
    return new Map()
  }
}

// Cache for loaded writeups (optional optimization)
let cachedWriteups: Writeup[] | null = null

export function getAllWriteups(): Writeup[] {
  if (cachedWriteups === null) {
    cachedWriteups = loadWriteupsFromMarkdown()
  }
  return cachedWriteups
}

// Clear cache (useful for development)
export function clearWriteupsCache(): void {
  cachedWriteups = null
}

export function getCTFs(): CTF[] {
  const writeups = getAllWriteups()
  const ctfData = loadCTFsFromMarkdown()
  
  const ctfMap = new Map<string, CTF>()

  // First, add all CTFs that have README files
  ctfData.forEach((ctf, slug) => {
    ctfMap.set(slug, {
      slug: ctf.slug,
      name: ctf.name,
      description: ctf.description,
      difficulty: ctf.difficulty,
      content: ctf.content,
      writeups: [],
    })
  })

  // Then, process writeups and create CTFs for those that don't have README files
  writeups.forEach((writeup) => {
    
    if (!ctfMap.has(writeup.ctfSlug)) {
      // Create a default CTF for writeups without a corresponding README
      const ctf: CTF = {
        slug: writeup.ctfSlug,
        name: writeup.ctf,
        description: `Write-ups from ${writeup.ctf}`,
        writeups: [],
      }
      
      if (validateCTF(ctf)) {
        ctfMap.set(writeup.ctfSlug, ctf)
      } else {
        console.warn(`Failed to create valid CTF for slug: ${writeup.ctfSlug}`)
        return // Skip this writeup if we can't create a valid CTF
      }
    }
    
    // Add the writeup to the CTF
    const ctf = ctfMap.get(writeup.ctfSlug)
    if (ctf) {
      ctf.writeups.push(writeup)
    }
  })

  return Array.from(ctfMap.values())
}

export function getCTFBySlug(slug: string): CTF | undefined {
  console.log(getCTFs());
  return getCTFs().find((ctf) => ctf.slug === slug)
}

export function getWriteupBySlug(ctfSlug: string, writeupSlug: string): Writeup | undefined {
  if (!isValidSlug(ctfSlug) || !isValidSlug(writeupSlug)) {
    return undefined
  }
  const ctf = getCTFBySlug(ctfSlug)
  return ctf?.writeups.find((writeup) => writeup.slug === writeupSlug)
}

export function getWriteupsByCategory(category: string): Writeup[] {
  const writeups = getAllWriteups()
  return writeups.filter((writeup) => writeup.category.toLowerCase() === category.toLowerCase())
}

export function getWriteupsByTag(tag: string): Writeup[] {
  const writeups = getAllWriteups()
  return writeups.filter((writeup) => writeup.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
}

export function searchWriteups(query: string): Writeup[] {
  const writeups = getAllWriteups()
  const lowercaseQuery = query.toLowerCase()
  return writeups.filter(
    (writeup) =>
      writeup.title.toLowerCase().includes(lowercaseQuery) ||
      writeup.description.toLowerCase().includes(lowercaseQuery) ||
      writeup.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      writeup.category.toLowerCase().includes(lowercaseQuery),
  )
}
