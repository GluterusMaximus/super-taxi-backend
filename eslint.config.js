import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  rules: {
    'curly': ['error', 'all'],
    'node/prefer-global/process': ['error', 'always'],
  },
})
