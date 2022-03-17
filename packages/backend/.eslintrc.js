const path = require('path');
const project = path.resolve(__dirname, './tsconfig.json');

module.exports = {
  ignorePatterns: ['.*'],
  parser: '@typescript-eslint/parser',
  parserOptions: { project, sourceType: 'module' },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: { node: true, jest: true },
  rules: {
    eqeqeq: ['error', 'smart'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': ['warn', { ignoreParameters: true }],
    'no-mixed-operators': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_+', varsIgnorePattern: '^_+' }],
    'import/order': ['warn', { alphabetize: { order: 'asc', caseInsensitive: true }, 'newlines-between': 'never' }],
    'prefer-destructuring': 'warn',
    'prefer-template': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
};
