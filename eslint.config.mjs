import coreWebVitalsConfig from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...coreWebVitalsConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]

export default eslintConfig
