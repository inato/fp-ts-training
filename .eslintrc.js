module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'plugin:fp/recommended',
  ],
  plugins: ['fp', 'inato'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars-experimental': ['error'],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/camelcase': [
      'error',
      {
        properties: 'never',
      },
    ],
    'react-hooks/rules-of-hooks': 'off',
    'import/extensions': [
      'error',
      {
        ts: 'never',
      },
    ],
    'fp/no-throw':'off',
    'fp/no-class': 'off',
    'fp/no-mutation': 'off',
    'fp/no-nil': 'off',
    'fp/no-this': 'off',
    'fp/no-unused-expression': 'off',
    'inato/no-factories-outside-of-tests': 'error',
  },
};
