import * as unoCssModule from 'unocss'
import { $fetch } from 'ofetch'

// https://github.com/unocss/unocss/blob/6d94efc56b0c966f25f46d8988b3fd30ebc189aa/packages/shared-docs/src/config.ts#L5
const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor

// https://github.com/unocss/unocss/blob/6d94efc56b0c966f25f46d8988b3fd30ebc189aa/packages/shared-docs/src/config.ts#L7-L9
const CDN_BASE = 'https://esm.sh/'
const modulesCache = new Map<string, Promise<unknown> | unknown>()
modulesCache.set('unocss', unoCssModule)

// https://github.com/unocss/unocss/blob/6d94efc56b0c966f25f46d8988b3fd30ebc189aa/packages/shared-docs/src/config.ts#L26
// eslint-disable-next-line no-new-func
const nativeImport = new Function('a', 'return import(a);')

// https://github.com/unocss/unocss/blob/6d94efc56b0c966f25f46d8988b3fd30ebc189aa/packages/shared-docs/src/config.ts#L31-L33
async function fetchAndImportAnyModuleWithCDNCapabilities(name: string) {
  if (name.endsWith('.json')) {
    const response = await $fetch(CDN_BASE + name, { responseType: 'json' })
    return { default: response }
  }

  return nativeImport(CDN_BASE + name)
}

// https://github.com/unocss/unocss/blob/6d94efc56b0c966f25f46d8988b3fd30ebc189aa/packages/shared-docs/src/config.ts#L27-L37
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

// https://github.com/unocss/unocss/blob/main/packages/shared-docs/src/config.ts
const importUnocssRegex = /import\s(.*?)\sfrom\s*(['"])unocss\2/g
const importObjectRegex = /import\s*(\{[\s\S]*?\})\s*from\s*(['"])([\w@/-]+)\2/g
const importDefaultRegex = /import\s(.*?)\sfrom\s*(['"])([\w@/-]+)\2/g
const exportDefaultRegex = /export default /
const importRegex = /\bimport\s*\(/g

// https://github.com/unocss/unocss/blob/main/packages/shared-docs/src/config.ts
export async function evaluateAnyModule<T>(configCode: string): Promise<T | undefined> {
  const transformedCode = configCode
    .replace(importUnocssRegex, 'const $1 = await __import("unocss");')
    .replace(importObjectRegex, 'const $1 = await __import("$3");')
    .replace(importDefaultRegex, 'const $1 = (await __import("$3")).default;')
    .replace(exportDefaultRegex, 'return ')
    .replace(importRegex, '__import(')

  const wrappedDynamicImport = new AsyncFunction('__import', transformedCode)
  return await wrappedDynamicImport(dynamicImportAnyModule)
}
