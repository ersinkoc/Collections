module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
    '^@types/(.*)': '<rootDir>/src/types/$1',
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@core/(.*)': '<rootDir>/src/core/$1',
    '^@plugins/(.*)': '<rootDir>/src/plugins/$1'
  },
  transform: {
    '^.+\\.ts': ['ts-jest', {
      tsconfig: {
        target: 'ES2020',
        module: 'commonjs'
      }
    }]
  },
  testTimeout: 10000,
  verbose: true,
  bail: false,
  errorOnDeprecated: true
};