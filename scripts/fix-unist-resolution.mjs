import fs from 'fs'
import path from 'path'

const nestedPackageDir = path.join(
  process.cwd(),
  'node_modules',
  'unist-util-visit-parents',
  'node_modules',
  'unist-util-is'
)

const nestedPackageJson = path.join(nestedPackageDir, 'package.json')

if (!fs.existsSync(nestedPackageDir)) {
  process.exit(0)
}

if (fs.existsSync(nestedPackageJson)) {
  process.exit(0)
}

fs.rmSync(nestedPackageDir, { recursive: true, force: true })
console.log('Removed broken nested unist-util-is directory to restore module resolution.')
