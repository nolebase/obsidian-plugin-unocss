// https://github.com/unocss/unocss/blob/main/packages/shared-docs/src/defaultConfig.ts
export const defaultConfigRaw = `import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      cdn: 'https://esm.sh/',
      'vertical-align': 'middle',
      extraProperties: {
        'display': 'inline-block',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
`
