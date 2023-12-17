export const defaultCSS = `
/* Write custom CSS here, and transformer support. For example: */
/* .custom {
  font-weight: 500;
  @apply p1 text-(white xl);
  background-color: theme('colors.red.400');
} */
`.trim()

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
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
`

export const customCSSLayerName = 'playground'

export const STORAGE_KEY = 'last-search'
