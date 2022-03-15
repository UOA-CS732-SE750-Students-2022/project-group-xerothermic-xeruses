const path = require('node:path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: { project: path.resolve(__dirname, './tsconfig.json'), sourceType: 'module' },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: { node: true, jest: true },
  rules: {
    eqeqeq: ['error', 'smart'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': ['warn', { ignoreParameters: true }],
    'no-mixed-operators': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_+', varsIgnorePattern: '^_+' }],
    'prefer-destructuring': 'warn',
    'prefer-template': 'warn',
  },
};
