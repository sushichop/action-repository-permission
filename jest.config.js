module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)',
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/fixtures/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  verbose: true,
};
