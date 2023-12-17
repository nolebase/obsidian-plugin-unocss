import type { UnoGenerator } from 'unocss'
import MagicString from 'magic-string'
import type { UnocssPluginContext } from '@unocss/core'

export enum TransformType {
  HTML = 'html',
  CSS = 'css',
}

function getId(type: TransformType) {
  switch (type) {
    case TransformType.HTML:
      return 'input.html'
    case TransformType.CSS:
      return 'input.css'
    default:
      throw new Error('Invalid type')
  }
}

export function normalizeOutput(type: TransformType, input: MagicString) {
  switch (type) {
    case TransformType.HTML:
      return input.toString()
    case TransformType.CSS:
      return cleanOutput(input.toString())
  }
}

function cleanOutput(code: string | undefined) {
  if (!code)
    return ''

  return code.replace(/\/\*\s*?[\s\S]*?\s*?\*\//g, '')
    .replace(/\n\s+/g, '\n')
    .trim()
}

async function applyTransformers(unocss: UnoGenerator, code: MagicString, id: string, enforce?: 'pre' | 'post') {
  let { transformers } = unocss.config
  transformers = (transformers ?? []).filter(i => i.enforce === enforce)

  if (!transformers.length)
    return []

  const annotations = []
  const fakePluginContext = { uno: unocss } as UnocssPluginContext
  for (const { idFilter, transform } of transformers) {
    if (idFilter && !idFilter(id))
      continue

    const result = await transform(code, id, fakePluginContext)
    const _annotations = result?.highlightAnnotations

    if (_annotations)
      annotations.push(..._annotations)
  }

  return annotations
}

export async function getTransformed(unocss: UnoGenerator, type: TransformType, input?: string) {
  const id = getId(type)
  const inputMagicString = new MagicString(input || '')

  const annotations = []

  annotations.push(...await applyTransformers(unocss, inputMagicString, id, 'pre'))
  annotations.push(...await applyTransformers(unocss, inputMagicString, id))
  annotations.push(...await applyTransformers(unocss, inputMagicString, id, 'post'))

  return {
    output: normalizeOutput(type, inputMagicString),
    annotations,
  }
}
