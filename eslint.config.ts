import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/*.md',
    '**/*.yaml',
    '**/*.yml',
  ],
  rules: {
    'import/order': 'off',
    'antfu/import-dedupe': 'error',
    'style/padding-line-between-statements': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'type-builtin',
          'type-import',
          'type-internal',
          ['type-parent', 'type-sibling', 'type-index'],
          'value-builtin',
          'value-external',
          'value-internal',
          ['value-parent', 'value-sibling', 'value-index'],
          ['wildcard-value-parent', 'wildcard-value-sibling', 'wildcard-value-index'],
          'side-effect',
          'style',
        ],
        newlinesBetween: 'always',
      },
    ],
  },
})
