import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import packageJSON from '../package.json' with { type: 'json' }

interface ObsidianPluginManifest {
  id: string
  name: string
  version: string
  minAppVersion: string
  description: string
  author: string
  authorUrl: string
  isDesktopOnly: boolean
}
export async function generateObsidianPluginManifest() {
  const unocssManifest = {
    id: 'obsidian-plugin-unocss',
    name: 'UnoCSS',
    version: packageJSON.version,
    minAppVersion: '1.4.0',
    description: 'A Obsidian.md plugin that allows you to generate and apply UnoCSS and Tailwind CSS supported styles right in your notes.',
    author: 'Nólëbase',
    authorUrl: 'https://github.com/nolebase',
    isDesktopOnly: false,
  } satisfies ObsidianPluginManifest
  await writeFile(join(cwd(), 'dist', 'manifest.json'), `${JSON.stringify(unocssManifest, null, 2)}\n`)
}
