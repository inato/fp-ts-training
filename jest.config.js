module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  globals: {
    'ts-jest': {
      diagnostics: { warnOnly: true },
    },
  },
};
