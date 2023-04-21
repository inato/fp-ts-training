module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  globals: {
    transform: {
      '*': [
        'ts-jest',
        {
          diagnostics: { warnOnly: true },
        },
      ],
    },
  },
};
