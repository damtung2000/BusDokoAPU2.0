module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    quotes: [
      'error',
      'single',
    ],
    // we want to force semicolons
    semi: [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/no-use-before-define': 1,
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-shadow': ['error', {
      builtinGlobals: false, hoist: 'functions', allow: [], ignoreOnInitialization: false,
    }],
  },
};
