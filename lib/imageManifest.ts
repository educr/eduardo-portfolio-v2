import manifest from '../image-manifest.json'

type Manifest = Record<string, { width: number; height: number }>

export default manifest as Manifest
