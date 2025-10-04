import { promises as fs } from 'fs'
import path from 'path'
import { imageSize } from 'image-size'

async function main() {
  const publicDir = path.join(process.cwd(), 'public')
  const manifestPath = path.join(process.cwd(), 'image-manifest.json')
  const manifest = {}

  async function walk(dir, base = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name)
      const publicPath = path.join(base, entry.name)

      if (entry.isDirectory()) {
        await walk(entryPath, publicPath)
        continue
      }

      const ext = entry.name.toLowerCase().split('.').pop()
      if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) {
        continue
      }

      try {
        const buffer = await fs.readFile(entryPath)
        const size = imageSize(buffer)
        if (size.width && size.height) {
          manifest[`/${publicPath.replace(/\\/g, '/')}`] = {
            width: size.width,
            height: size.height
          }
        }
      } catch (error) {
        console.warn(`Failed to read dimensions for ${entryPath}:`, error)
      }
    }
  }

  await walk(publicDir)
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`Image manifest generated at ${manifestPath}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
