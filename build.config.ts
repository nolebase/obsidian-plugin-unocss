import { copyFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import builtins from 'builtin-modules'
import { defineBuildConfig } from 'unbuild'

import { generateObsidianPluginManifest } from './scripts/manifest'
import { toErrorable } from './scripts/utils'

export default defineBuildConfig({
  outDir: './dist',
  sourcemap: true,
  declaration: false,
  externals: [
    // Obsidian
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    // UnoCSS
    '@iconify/utils/lib/loader/fs',
    '@iconify/utils/lib/loader/install-pkg',
    '@iconify/utils/lib/loader/node-loader',
    '@iconify/utils/lib/loader/node-loaders',
    // Builtins
    ...builtins,
  ],
  rollup: {
    esbuild: {
      format: 'cjs',
    },
    output: {
      dir: './dist',
      format: 'cjs',
      sourcemap: 'inline',
      entryFileNames: 'main.js',
    },
    // required for unocss, ofetch, etc.
    // otherwise unbuild will detect them as external
    // dependencies that are inline implicitly external
    // by esbuild
    inlineDependencies: true,
  },
  hooks: {
    'build:before': async () => {
      await toErrorable(async () => await rm(join(cwd(), 'main.js')))
      await toErrorable(async () => await rm(join(cwd(), 'manifest.json')))
    },
    'build:done': async () => {
      await generateObsidianPluginManifest()
      await copyFile(join(cwd(), 'dist', 'main.js'), join(cwd(), 'main.js'))
      await copyFile(join(cwd(), 'dist', 'manifest.json'), join(cwd(), 'manifest.json'))
    },
  },
})
