module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  extends: [
    'vue',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  'globals': {
    'uni': true,
    'getCurrentPages': true
  }
}
