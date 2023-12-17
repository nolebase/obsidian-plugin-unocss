import * as unoCssModule from 'unocss'
import type { UserConfig } from '@unocss/core'
import { $fetch } from 'ofetch'

const CDN_BASE = 'https://esm.sh/'
const modulesCache = new Map<string, Promise<unknown> | unknown>()
modulesCache.set('unocss', unoCssModule)

// eslint-disable-next-line no-new-func
const nativeImport = new Function('a', 'return import(a);')

async function fetchAndImportAnyModuleWithCDNCapabilities(name: string) {
  if (name.endsWith('.json')) {
    const response = await $fetch(CDN_BASE + name, { responseType: 'json' })
    return { default: response }
  }

  return nativeImport(CDN_BASE + name)
}

// bypass vite interop
async function dynamicImportAnyModule(name: string): Promise<any> {
  if (modulesCache.has(name))
    return modulesCache.get(name)

  try {
    const module = await fetchAndImportAnyModuleWithCDNCapabilities(name)
    modulesCache.set(name, module)
  }
  catch (error) {
    console.error(`Failed to import module ${name} from CDN`, error)
  }
}

const importUnocssRegex = /import\s*(.*?)\s*from\s*(['"])unocss\2/g
const importObjectRegex = /import\s*(\{[\s\S]*?\})\s*from\s*(['"])([\w-@/]+)\2/g
const importDefaultRegex = /import\s*(.*?)\s*from\s*(['"])([\w-@/]+)\2/g
const exportDefaultRegex = /export default /
const importRegex = /\bimport\s*\(/g

const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor

export async function evaluateUserConfig<U = UserConfig>(configCode: string): Promise<U | undefined> {
  const transformedCode = configCode
    .replace(importUnocssRegex, 'const $1 = await __import("unocss");')
    .replace(importObjectRegex, 'const $1 = await __import("$3");')
    .replace(importDefaultRegex, 'const $1 = (await __import("$3")).default;')
    .replace(exportDefaultRegex, 'return ')
    .replace(importRegex, '__import(')

  const wrappedDynamicImport = new AsyncFunction('__import', transformedCode)
  return await wrappedDynamicImport(dynamicImportAnyModule)
}
