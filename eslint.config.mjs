import ljharbConfig from '@ljharb/eslint-config/flat';

export default [
  ...ljharbConfig,
  {
    languageOptions: {
      globals: {
        Int8Array: 'readonly',
        Uint8Array: 'readonly',
      },
    },
    rules: {
      complexity: 'off',
      eqeqeq: [
        'error', 'always', { null: 'ignore' },
      ],
      'func-style': ['error', 'declaration'],
      'id-length': 'off',
      // eslint-disable-next-line no-magic-numbers
      indent: ['error', 2],
      // eslint-disable-next-line no-magic-numbers
      'max-params': ['error', 6],

      'max-statements-per-line': ['error', { max: 2 }],
      'new-cap': ['error', { capIsNewExceptions: ['GetIntrinsic'] }],
      'no-magic-numbers': ['error', { ignore: [0, 1] }],
    },
  },
  {
    files: ['example/**'],
    rules: {
      'no-console': 'off',
      'no-magic-numbers': 'off',
    },
  },
  {
    files: ['test/**'],
    languageOptions: {
      globals: {
        Int8Array: 'readonly',
        Uint8Array: 'readonly',
      },
    },
    rules: {
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'no-magic-numbers': 'off',
    },
  },
];
